const prisma = require('../../db/prisma');
const { updateArticle, getArticle } = require('./dbCrud');
const { generateMarkdown, runQC } = require('./aiService');
const { getUniqueArticleSlug } = require('../../utils/article');
const fs = require('fs-extra');
const path = require('path');
const { extractFrontmatter, fixFrontmatterStructure } = require('../../utils/markdownUtils');

/**
 * Sanitize and slugify a string for use as a filename
 * @param {string} str - The string to slugify
 * @returns {string} - The sanitized slug
 */
function slugify(str) {
    if (!str) return 'untitled-article';
    
    return str
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens
        .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and multiple hyphens with single hyphen
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Perform QC loop for an article, auto-regenerating if needed, and collect all versions to save in a transaction.
 * @param {string} articleId - The article's ID
 * @param {string} content - The initial article content
 * @param {number} maxRetries - Maximum QC attempts (default 3)
 * @param {Object} options - { provider, model }
 * @returns {Promise<{versions: Array, finalVersionId: string, content: string, qcResult: object, status: string}>}
 */
async function performQC(articleId, content, maxRetries = 3, options = {}) {
    // Fetch article meta for prompt regeneration
    const article = await getArticle(articleId);
    if (!article) throw new Error('Article not found');
    let attempt = 0;
    let lastQCResult = null;
    let lastContent = content;
    let status = 'failed';
    let versionNum = (article.versions?.length || 0) + 1;
    const meta = {
        niche: article.niche,
        keyword: article.keyword,
        topic: article.topic,
        n: 3, // fallback, or use article.n if present
        targetURL: article.backlink,
        anchorText: article.anchorText,
        model: options.model || 'gemini-2.5-flash',
        provider: options.provider || 'gemini',
    };
    let feedback = '';
    const versionsToSave = [];
    let finalVersionId = null;
    let finalVersionNum = null;
    let finalQCResult = null;
    while (attempt < maxRetries) {
        // 1. Run QC (slow, external)
        lastQCResult = await runQC(lastContent, {
            backlinkUrl: meta.targetURL,
            anchorText: meta.anchorText,
            model: meta.model,
            provider: meta.provider
        });
        // 2. Fix frontmatter structure before saving
        const fixedContent = fixFrontmatterStructure(lastContent);
        
        // 3. Collect version data
        const versionData = {
            article_id: articleId,
            version_num: versionNum++,
            content_md: fixedContent,
            qc_attempts: attempt + 1,
            last_qc_status: lastQCResult.status,
            last_qc_notes: lastQCResult,
            prompt: feedback || '',
        };
        versionsToSave.push(versionData);
        if (lastQCResult.status === 'pass') {
            status = 'passed';
            finalVersionNum = versionData.version_num;
            finalQCResult = lastQCResult;
            break;
        }
        // 3. If fail, parse feedback and regenerate
        if (attempt < maxRetries - 1) {
            feedback = '';
            if (lastQCResult.recommendations && Array.isArray(lastQCResult.recommendations)) {
                feedback += 'Recommendations:\n' + lastQCResult.recommendations.join('\n');
            }
            if (lastQCResult.issues && Array.isArray(lastQCResult.issues)) {
                feedback += '\nIssues:\n' + lastQCResult.issues.join('\n');
            }
            const newContent = await generateMarkdown({ ...meta, feedback });
            lastContent = fixFrontmatterStructure(newContent);
        }
        attempt++;
    }

    
    
    // Save all versions in a single transaction
    await prisma.$transaction(async (tx) => {
        for (const v of versionsToSave) {
            const saved = await tx.articleVersion.create({ data: v });
            if (!finalVersionId && v.last_qc_status === 'pass') {
                finalVersionId = saved.id;
                finalVersionNum = v.version_num;
                finalQCResult = v.last_qc_notes;
            }
        }
        if (status !== 'passed') {
            await tx.article.update({ where: { id: articleId }, data: { status: 'flagged' } });
        }
    });
    // If all failed, finalVersionId is the last one
    if (!finalVersionId && versionsToSave.length > 0) {
        finalVersionId = versionsToSave[versionsToSave.length - 1].id;
        finalVersionNum = versionsToSave[versionsToSave.length - 1].version_num;
        finalQCResult = versionsToSave[versionsToSave.length - 1].last_qc_notes;
    }
    return {
        versionId: finalVersionId,
        versionNum: finalVersionNum,
        content: lastContent,
        qcResult: finalQCResult,
        status
    };
}

/**
 * Create a new article and its first version (QC'd, not selected).
 * @param {Object} meta - { domain_id, slug, status, user, ...articleMeta }
 * @param {Object} genParams - { niche, keyword, topic, n, targetURL, anchorText, model, provider, internalLinks }
 * @param {number} maxRetries
 * @returns {Promise<{articleId, versions, finalVersionId, content, qcResult, status}>}
 */
async function createArticleWithVersion(meta, genParams, maxRetries = 3) {
    // 1. Create article doc (outside tx)
    const baseSlug = meta.slug;
    const uniqueSlug = await getUniqueArticleSlug(baseSlug);
    // Extract domain_id from meta and remove it from the data object
    const { domain_id, ...articleData } = meta;
    
    const article = await prisma.article.create({
        data: {
            ...articleData,
            slug: uniqueSlug,
            status: meta.status || 'draft',
            anchor: genParams.anchorText,
            backlink_target: genParams.targetURL,
            keyword: genParams.keyword,
            niche: genParams.niche,
            topic: genParams.topic,
            internal_links: genParams.internalLinks || false,
            domain: domain_id ? {
                connect: {
                    id: domain_id
                }
            } : undefined,
        }
    });
    // 2. Generate markdown and run QC (outside tx)
    const rawContent = await generateMarkdown({ 
        ...genParams,
        domainId: meta.domain_id,
        internalLinks: genParams.internalLinks || false
    });
    const content = fixFrontmatterStructure(rawContent);
    console.log('Article generated: \n', content);
    const qcResult = await performQC(article.id, content, maxRetries, genParams);
    console.log('Article QC result: \n', qcResult);
    // 3. Return
    return {
        articleId: article.id,
        ...qcResult
    };
}

/**
 * Create a new version for an existing article (QC'd, not selected).
 * @param {string} articleId
 * @param {Object} genParams - { niche, keyword, topic, n, targetURL, anchorText, model, provider }
 * @param {number} maxRetries
 * @returns {Promise<{versions, finalVersionId, content, qcResult, status}>}
 */
async function createVersionForArticle(articleId, genParams, maxRetries = 3) {
    // Get article to get domain_id
    const article = await getArticle(articleId);
    if (!article) throw new Error('Article not found');
    
    // 1. Generate markdown and run QC (outside tx)
    const rawContent = await generateMarkdown({ 
        ...genParams,
        domainId: article.domain_id,
        internalLinks: genParams.internalLinks || false
    });
    const content = fixFrontmatterStructure(rawContent);
    const qcResult = await performQC(articleId, content, maxRetries, genParams);
    return qcResult;
}

/**
 * Add a blog post to a specified domain
 * @param {string} articleId - The article's ID
 * @param {string} domainName - The domain folder name
 * @param {Object} options - Optional configuration
 * @returns {Promise<{success: boolean, filePath: string, message: string}>}
 */
async function addBlogToDomain(articleId, domainName, options = {}) {
    try {
        // 1. Verify article exists and has selected version
        const article = await getArticle(articleId);
        if (!article) {
            throw new Error(`Article with ID ${articleId} not found`);
        }
        
        if (!article.selected_version_id) {
            throw new Error(`Article ${articleId} has no selected version`);
        }
        
        // 2. Get the selected version content
        const selectedVersion = article.versions.find(v => v.id === article.selected_version_id);
        if (!selectedVersion) {
            throw new Error(`Selected version ${article.selected_version_id} not found`);
        }
        
        // 3. Verify domain exists
        const domainsBase = options.domainsBase || path.resolve(__dirname, '../../../astro-builds/domains');
        const domainPath = path.join(domainsBase, domainName);
        
        if (!await fs.pathExists(domainPath)) {
            throw new Error(`Domain ${domainName} not found at ${domainPath}`);
        }
        
        // 4. Create markdown content with frontmatter
        const frontmatter = extractFrontmatter(selectedVersion.content_md);
        
        // Create frontmatter string with proper formatting
        // const frontmatterString = `---
        //     title: "${frontmatter.title}"
        //     description: "${frontmatter.description}"
        //     pubDate: ${frontmatter.pubDate.toISOString()}
        //     author: "${frontmatter.author}"
        //     image:
        //     url: "${frontmatter.image.url}"
        //     alt: "${frontmatter.image.alt}"
        //     tags: [${frontmatter.tags.map(tag => `"${tag}"`).join(', ')}]
        //     ---

        //     `;
        
        // 5. Validate content exists
        if (!selectedVersion.content_md || selectedVersion.content_md.trim() === '') {
            throw new Error(`Selected version ${article.selected_version_id} has no content`);
        }
        
        // Content is already fixed in the database, use as-is
        const markdownContent = selectedVersion.content_md;
        
        // 6. Create the markdown file with sanitized filename
        const sanitizedSlug = slugify(article.slug || article.topic || article.keyword);
        const fileName = `${sanitizedSlug}.md`;
        const postsDir = path.join(domainPath, 'src', 'content', 'posts');
        const filePath = path.join(postsDir, fileName);
        
        // Ensure posts directory exists
        await fs.ensureDir(postsDir);
        
        // Write the file
        await fs.writeFile(filePath, markdownContent, 'utf8');
        
        console.log(`✅ Blog post added to domain ${domainName}:`);
        console.log(`   📁 File: ${fileName} (sanitized from: ${article.slug})`);
        console.log(`   📍 Path: ${filePath}`);
        console.log(`   📝 Title: ${frontmatter?.title}`);
        console.log(`   📄 Content length: ${markdownContent.length} characters`);
        
        return {
            success: true,
            filePath: filePath,
            fileName: fileName,
            sanitizedSlug: sanitizedSlug,
            originalSlug: article.slug,
            message: `Blog post "${frontmatter?.title}" successfully added to domain ${domainName}`,
            article: {
                id: article.id,
                slug: article.slug,
                sanitizedSlug: sanitizedSlug,
                title: frontmatter?.title,
                author: frontmatter?.author,
                pubDate: frontmatter?.pubDate
            }
        };
        
    } catch (error) {
        console.error('❌ Error adding blog to domain:', error.message);
        
        let errorMessage = error.message;
        if (error.message.includes('no content')) {
            errorMessage = `Article version has no content. Please regenerate the article.`;
        } else if (error.message.includes('not found')) {
            errorMessage = `Article or version not found. Please check the article ID.`;
        } else if (error.message.includes('domain not found')) {
            errorMessage = `Domain folder not found. Please create the domain first.`;
        }
        
        return {
            success: false,
            filePath: null,
            fileName: null,
            message: errorMessage,
            error: error.message
        };
    }
}


module.exports = {
    performQC,
    createArticleWithVersion,
    createVersionForArticle,
    addBlogToDomain
};