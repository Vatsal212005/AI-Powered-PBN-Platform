const { generateMarkdown, runQC } = require('./aiService');
const { processInternalLinks } = require('./internalLinksService');
const { extractFrontmatter, fixFrontmatterStructure } = require('../../utils/markdownUtils');
const { getUniqueArticleSlug } = require('../../utils/article');
const prisma = require('../../db/prisma');
const fs = require('fs-extra');
const path = require('path');

/**
 * AI Inference Step - Extract topic, anchor text, and suggested backlink from prompt
 * @param {string} userPrompt - The custom user prompt
 * @param {Object} params - Generation parameters
 * @returns {Promise<Object>} - Inferred values
 */
async function inferFromPrompt(userPrompt, params) {
    try {
        // If user prompt is provided, use it for inference
        if (userPrompt) {
            const inferencePrompt = `
Analyze the following blog generation prompt and extract key information:

Prompt: ${userPrompt}

Extract and return a JSON object with:
{
    "targetTopic": "The main topic of the blog",
    "anchorText": "Suggested anchor text for internal linking",
    "suggestedBacklink": "Any external backlink mentioned (discard if from admin UI)",
    "niche": "The niche/category",
    "keyword": "Primary keyword",
    "sections": "Number of sections (default 3)"
}

Only return the JSON object, no additional text.
            `;
            
            const { callAI } = require('../llm/aiCaller');
            const result = await callAI(inferencePrompt, { 
                provider: params.provider || 'gemini', 
                modelName: params.model || 'gemini-2.5-flash' 
            });
            
            return JSON.parse(result);
        }
        
        // If no user prompt, use the provided parameters
        return {
            targetTopic: params.topic,
            anchorText: params.anchorText,
            suggestedBacklink: params.targetURL,
            niche: params.niche,
            keyword: params.keyword,
            sections: params.n || 3
        };
    } catch (error) {
        console.error('Error in AI inference:', error);
        // Fallback to provided parameters
        return {
            targetTopic: params.topic,
            anchorText: params.anchorText,
            suggestedBacklink: params.targetURL,
            niche: params.niche,
            keyword: params.keyword,
            sections: params.n || 3
        };
    }
}

/**
 * Quality Check with detailed validation
 * @param {string} content - Blog content
 * @param {Object} params - Generation parameters
 * @returns {Promise<Object>} - QC result with detailed feedback
 */
async function performQualityCheck(content, params) {
    try {
        // Basic QC checks
        const qcResult = await runQC(content, {
            backlinkUrl: params.targetURL,
            anchorText: params.anchorText,
            model: params.model,
            provider: params.provider
        });

        // Additional custom checks
        const customChecks = {
            wordCount: content.split(/\s+/).length,
            hasTitle: content.includes('title:'),
            hasDescription: content.includes('description:'),
            hasTags: content.includes('tags:'),
            hasInternalLinks: params.internalLinks ? content.includes('(/posts/') : true,
            minWordCount: 500,
            maxWordCount: 3000
        };

        // Evaluate custom checks
        const issues = [];
        if (customChecks.wordCount < customChecks.minWordCount) {
            issues.push(`Content too short: ${customChecks.wordCount} words (minimum: ${customChecks.minWordCount})`);
        }
        if (customChecks.wordCount > customChecks.maxWordCount) {
            issues.push(`Content too long: ${customChecks.wordCount} words (maximum: ${customChecks.maxWordCount})`);
        }
        if (!customChecks.hasTitle) {
            issues.push('Missing title in frontmatter');
        }
        if (!customChecks.hasDescription) {
            issues.push('Missing description in frontmatter');
        }
        if (!customChecks.hasTags) {
            issues.push('Missing tags in frontmatter');
        }
        // Internal link QC logic
        if (params.internalLinks) {
            if (params._internalLinkStatus === 'skipped') {
                // Mark as skipped, do not fail QC
                issues.push('Internal linking skipped: no relevant articles found');
            } else if (!customChecks.hasInternalLinks) {
                issues.push('Internal links enabled but no internal links found');
            }
        }

        // Combine QC results
        // If internal linking was skipped, do not fail QC for that reason
        let finalStatus;
        if (qcResult.status === 'pass' && (issues.length === 0 || (issues.length === 1 && issues[0].includes('skipped')))) {
            finalStatus = 'pass';
        } else {
            finalStatus = 'fail';
        }

        return {
            ...qcResult,
            status: finalStatus,
            issues: [...(qcResult.issues || []), ...issues],
            customChecks
        };
    } catch (error) {
        console.error('Error in quality check:', error);
        return {
            status: 'fail',
            summary: 'Quality check failed',
            issues: ['Quality check error occurred'],
            recommendations: ['Retry generation']
        };
    }
}

/**
 * Extract metadata from generated content
 * @param {string} content - Blog content
 * @param {Object} params - Generation parameters
 * @returns {Promise<Object>} - Extracted metadata
 */
async function extractMetadata(content, params) {
    try {
        const frontmatter = extractFrontmatter(content);
        
        return {
            title: frontmatter.title || params.topic,
            description: frontmatter.description || `Learn about ${params.topic}`,
            slug: await getUniqueArticleSlug(params.topic),
            tags: frontmatter.tags || [params.niche, params.keyword],
            author: frontmatter.author || 'Admin',
            pubDate: frontmatter.pubDate || new Date(),
            image: frontmatter.image || {
                url: '/default-blog-image.jpg',
                alt: params.topic
            },
            wordCount: content.split(/\s+/).length,
            internalLinksCount: params.internalLinks ? (content.match(/\(\/posts\//g) || []).length : 0
        };
    } catch (error) {
        console.error('Error extracting metadata:', error);
        return {
            title: params.topic,
            description: `Learn about ${params.topic}`,
            slug: await getUniqueArticleSlug(params.topic),
            tags: [params.niche, params.keyword],
            author: 'Admin',
            pubDate: new Date(),
            image: {
                url: '/default-blog-image.jpg',
                alt: params.topic
            },
            wordCount: content.split(/\s+/).length,
            internalLinksCount: 0
        };
    }
}

/**
 * Write blog content to Astro markdown file
 * @param {string} content - Blog content
 * @param {string} domainSlug - Domain slug
 * @param {Object} metadata - Article metadata
 * @returns {Promise<Object>} - File write result
 */
async function writeToAstroFile(content, domainSlug, metadata) {
    try {
        const domainsBase = path.resolve(__dirname, '../../../astro-builds/domains');
        const domainPath = path.join(domainsBase, domainSlug);
        const postsDir = path.join(domainPath, 'src', 'content', 'posts');
        
        // Ensure posts directory exists
        await fs.ensureDir(postsDir);
        
        // Create filename from slug
        const fileName = `${metadata.slug}.md`;
        const filePath = path.join(postsDir, fileName);
        
        // Write the file
        await fs.writeFile(filePath, content, 'utf8');
        
        return {
            success: true,
            filePath,
            fileName,
            slug: metadata.slug
        };
    } catch (error) {
        console.error('Error writing to Astro file:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Complete blog generation pipeline
 * @param {Object} params - Generation parameters
 * @param {number} maxRetries - Maximum retry attempts
 * @returns {Promise<Object>} - Pipeline result
 */
async function runBlogPipeline(params, maxRetries = 3) {
    let attempt = 0;
    let lastError;
    let finalContent;
    let finalQCResult;
    let finalMetadata;
    let internalLinkStatus = null;

    while (attempt < maxRetries) {
        try {
            console.log(`Pipeline attempt ${attempt + 1}/${maxRetries}`);

            // Step 1: AI Inference
            console.log('Step 1: AI Inference');
            const inferredValues = await inferFromPrompt(params.userPrompt, params);
            console.log('Inferred values:', inferredValues);

            // Step 2: Blog Generation
            console.log('Step 2: Blog Generation');
            const generatedContent = await generateMarkdown({
                ...params,
                ...inferredValues,
                domainId: params.domain_id,
                internalLinks: params.internalLinks || false
            });

            // Step 3: Process Internal Links
            if (params.internalLinks && params.domain_id) {
                console.log('Step 3: Processing Internal Links');
                const { getRelevantArticles } = require('./internalLinksService');
                const relevantArticles = await getRelevantArticles(params.domain_id, inferredValues.targetTopic);
                if (!relevantArticles || relevantArticles.length === 0) {
                    console.warn(`No internal link available for topic: ${inferredValues.targetTopic}`);
                    internalLinkStatus = 'skipped';
                    finalContent = generatedContent;
                } else {
                    finalContent = await processInternalLinks(
                        generatedContent,
                        params.domain_id,
                        inferredValues.targetTopic,
                        params.internalLinks
                    );
                }
            } else {
                finalContent = generatedContent;
            }

            // Step 4: Fix frontmatter structure
            finalContent = fixFrontmatterStructure(finalContent);

            // Step 5: Quality Check
            console.log('Step 4: Quality Check');
            finalQCResult = await performQualityCheck(finalContent, { ...params, _internalLinkStatus: internalLinkStatus });

            if (finalQCResult.status === 'pass') {
                console.log('QC passed, proceeding to metadata extraction');
                break;
            } else {
                console.log('QC failed:', finalQCResult.issues);
                if (attempt < maxRetries - 1) {
                    // Add QC feedback to next attempt
                    params.feedback = finalQCResult.recommendations?.join('\n') || '';
                }
            }

            attempt++;
        } catch (error) {
            console.error(`Pipeline attempt ${attempt + 1} failed:`, error);
            lastError = error;
            attempt++;
        }
    }

    if (finalQCResult?.status !== 'pass') {
        throw new Error(`Pipeline failed after ${maxRetries} attempts. Last error: ${lastError?.message}`);
    }

    // Step 6: Extract Metadata
    console.log('Step 5: Extract Metadata');
    finalMetadata = await extractMetadata(finalContent, params);

    // Step 7: Save to Database
    console.log('Step 6: Save to Database');
    const article = await prisma.article.create({
        data: {
            domain_id: params.domain_id,
            slug: finalMetadata.slug,
            status: 'generated',
            user: params.user || 'admin',
            topic: params.topic,
            niche: params.niche,
            keyword: params.keyword,
            backlink_target: params.targetURL,
            anchor: params.anchorText,
            internal_links: params.internalLinks || false
        }
    });

    // Create version
    const version = await prisma.articleVersion.create({
        data: {
            article_id: article.id,
            version_num: 1,
            content_md: finalContent,
            qc_attempts: attempt + 1,
            last_qc_status: finalQCResult.status,
            last_qc_notes: finalQCResult
        }
    });

    // Set as selected version
    await prisma.article.update({
        where: { id: article.id },
        data: { selected_version_id: version.id }
    });

    // Step 8: Write to Astro File (if domain exists)
    let fileResult = null;
    if (params.domain_id) {
        console.log('Step 7: Write to Astro File');
        const domain = await prisma.domain.findUnique({
            where: { id: params.domain_id }
        });
        
        if (domain) {
            fileResult = await writeToAstroFile(finalContent, domain.slug, finalMetadata);
        }
    }

    return {
        success: true,
        articleId: article.id,
        versionId: version.id,
        content: finalContent,
        metadata: finalMetadata,
        qcResult: finalQCResult,
        fileResult,
        attempts: attempt + 1
    };
}

module.exports = {
    runBlogPipeline,
    inferFromPrompt,
    performQualityCheck,
    extractMetadata,
    writeToAstroFile
}; 