const prisma = require('../../db/prisma');
const { extractFrontmatter, fixFrontmatterStructure } = require('../../utils/markdownUtils');
const fs = require('fs-extra');
const path = require('path');

/**
 * Update article content in both database and Astro file
 * @param {string} articleId - Article ID
 * @param {string} newContent - Updated content
 * @param {Object} options - Update options
 * @returns {Promise<Object>} - Update result
 */
async function updateArticleContent(articleId, newContent, options = {}) {
    try {
        // Get article and domain info
        const article = await prisma.article.findUnique({
            where: { id: articleId },
            include: {
                domain: true,
                selected_version: true
            }
        });

        if (!article) {
            throw new Error('Article not found');
        }

        // Fix frontmatter structure
        const fixedContent = fixFrontmatterStructure(newContent);

        // Update database
        const updatedVersion = await prisma.articleVersion.create({
            data: {
                article_id: articleId,
                version_num: (article.versions?.length || 0) + 1,
                content_md: fixedContent,
                qc_attempts: 0,
                last_qc_status: 'manual_edit',
                last_qc_notes: { type: 'manual_edit', timestamp: new Date() }
            }
        });

        // Set as selected version
        await prisma.article.update({
            where: { id: articleId },
            data: { selected_version_id: updatedVersion.id }
        });

        // Update Astro file if article is published
        let fileResult = null;
        if (article.status === 'published' && article.domain) {
            fileResult = await updateAstroFile(article.domain.slug, article.slug, fixedContent);
        }

        return {
            success: true,
            articleId,
            versionId: updatedVersion.id,
            content: fixedContent,
            fileResult
        };
    } catch (error) {
        console.error('Error updating article content:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Update Astro markdown file
 * @param {string} domainSlug - Domain slug
 * @param {string} articleSlug - Article slug
 * @param {string} content - Updated content
 * @returns {Promise<Object>} - File update result
 */
async function updateAstroFile(domainSlug, articleSlug, content) {
    try {
        const domainsBase = path.resolve(__dirname, '../../../astro-builds/domains');
        const domainPath = path.join(domainsBase, domainSlug);
        const postsDir = path.join(domainPath, 'src', 'content', 'posts');
        const filePath = path.join(postsDir, `${articleSlug}.md`);

        // Check if file exists
        if (!await fs.pathExists(filePath)) {
            return {
                success: false,
                error: 'Astro file not found'
            };
        }

        // Write updated content
        await fs.writeFile(filePath, content, 'utf8');

        return {
            success: true,
            filePath,
            fileName: `${articleSlug}.md`
        };
    } catch (error) {
        console.error('Error updating Astro file:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Publish article to Astro file
 * @param {string} articleId - Article ID
 * @returns {Promise<Object>} - Publish result
 */
async function publishArticle(articleId) {
    try {
        const article = await prisma.article.findUnique({
            where: { id: articleId },
            include: {
                domain: true,
                selected_version: true
            }
        });

        if (!article) {
            throw new Error('Article not found');
        }

        if (!article.selected_version) {
            throw new Error('No selected version for this article');
        }

        if (!article.domain) {
            throw new Error('Article has no domain assigned');
        }

        // Update Astro file
        const fileResult = await updateAstroFile(
            article.domain.slug,
            article.slug,
            article.selected_version.content_md
        );

        if (!fileResult.success) {
            throw new Error(`Failed to update Astro file: ${fileResult.error}`);
        }

        // Update article status to published
        await prisma.article.update({
            where: { id: articleId },
            data: { status: 'published' }
        });

        return {
            success: true,
            articleId,
            fileResult,
            message: 'Article published successfully'
        };
    } catch (error) {
        console.error('Error publishing article:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Get article content for editing
 * @param {string} articleId - Article ID
 * @returns {Promise<Object>} - Article content
 */
async function getArticleForEditing(articleId) {
    try {
        const article = await prisma.article.findUnique({
            where: { id: articleId },
            include: {
                domain: true,
                selected_version: true,
                versions: {
                    orderBy: { version_num: 'desc' },
                    take: 10
                }
            }
        });

        if (!article) {
            throw new Error('Article not found');
        }

        return {
            success: true,
            article,
            content: article.selected_version?.content_md || '',
            metadata: {
                title: article.topic,
                slug: article.slug,
                status: article.status,
                domain: article.domain?.name,
                versions: article.versions
            }
        };
    } catch (error) {
        console.error('Error getting article for editing:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

module.exports = {
    updateArticleContent,
    updateAstroFile,
    publishArticle,
    getArticleForEditing
}; 