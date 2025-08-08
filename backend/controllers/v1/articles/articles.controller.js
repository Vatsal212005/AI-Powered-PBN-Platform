const { addBlogToDomain } = require('../../../services/articles/coreServices');
const articleService = require('../../../services/articles/dbCrud');
const staticGen = require('../../../services/domain/staticGen');
const { getArticleForEditing, updateArticleContent } = require('../../../services/articles/editorService');
const { getRelevantArticles } = require('../../../services/articles/internalLinksService');

// GET /api/v1/articles
async function getAllArticles(req, res) {
    try {
        const articles = await articleService.getAllArticles();
        res.json(articles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// GET /api/v1/articles/:id
async function getArticle(req, res) {
    try {
        const { id } = req.params;
        const article = await articleService.getArticle(id);
        if (!article) return res.status(404).json({ error: 'Article not found' });
        res.json(article);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// PUT /api/v1/articles/:id
async function updateArticle(req, res) {
    try {
        const { id } = req.params;
        const data = req.body;
        const updated = await articleService.updateArticle(id, data);
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// DELETE /api/v1/articles/:id
async function deleteArticle(req, res) {
    try {
        const { id } = req.params;
        const deleted = await articleService.deleteArticle(id);
        res.json(deleted);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// POST /api/v1/articles/:id/select-version
async function setSelectedVersion(req, res) {
    try {
        const { id } = req.params;
        const { versionId } = req.body;
        if (!versionId) return res.status(400).json({ error: 'Missing versionId' });
        const updated = await articleService.setSelectedVersion(id, versionId);
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// POST /api/v1/articles/:id/publish
async function publishBlog(req, res) {
    try {
        const { id } = req.params;
        
        // 1. Get article and domain
        const article = await articleService.getArticle(id);
        if (!article) {
            return res.status(404).json({ 
                error: 'Article not found',
                details: `No article found with ID: ${id}`
            });
        }
        
        if (!article.domain) {
            return res.status(400).json({ 
                error: 'Article has no domain',
                details: 'Please assign a domain to this article before publishing'
            });
        }
        
        // 2. Check if article has selected version
        if (!article.selected_version_id) {
            return res.status(400).json({ 
                error: 'No selected version for this article',
                details: 'Please select a version before publishing'
            });
        }
        
        // 3. Check domain folder exists
        const domainSlug = article.domain.slug;
        const domainFolder = staticGen.DOMAINS_BASE + '/' + domainSlug;
        const fs = require('fs-extra');
        
        if (!await fs.pathExists(domainFolder)) {
            return res.status(400).json({ 
                error: 'Domain folder does not exist',
                details: `Domain folder '${domainSlug}' not found`,
                suggestion: 'Please create the domain folder first'
            });
        }
        
        // 4. Use addArticleToDomain for proper formatting
        const result = await addBlogToDomain(id, domainSlug);
        
        if (!result.success) {
            return res.status(400).json({
                error: 'Failed to publish blog',
                details: result.message || 'Unknown error occurred'
            });
        }
        
        // 5. Set status to published
        await articleService.updateArticle(id, { status: 'published' });
        
        res.json({ 
            success: true, 
            message: 'Blog published successfully!',
            articleId: id,
            file: result.fileName,
            filePath: result.filePath,
            sanitizedSlug: result.sanitizedSlug,
            originalSlug: result.originalSlug,
            article: result.article
        });
        
    } catch (err) {
        let errorMessage = 'Failed to publish blog';
        let statusCode = 500;
        
        if (err.message.includes('article not found')) {
            errorMessage = `Article with ID '${req.params.id}' not found`;
            statusCode = 404;
        } else if (err.message.includes('no selected version')) {
            errorMessage = `Article '${req.params.id}' has no selected version`;
            statusCode = 400;
        } else if (err.message.includes('domain not found')) {
            errorMessage = `Domain folder not found for article '${req.params.id}'`;
            statusCode = 404;
        } else if (err.message.includes('permission')) {
            errorMessage = 'Permission denied writing blog file.';
            statusCode = 403;
        } else if (err.message.includes('disk space')) {
            errorMessage = 'Insufficient disk space to create blog file.';
            statusCode = 507;
        } else if (err.message.includes('timeout')) {
            errorMessage = 'Database or file system operation timed out. Please try again.';
            statusCode = 408;
        } else {
            errorMessage = err.message;
        }
        
        res.status(statusCode).json({
            error: errorMessage,
            timestamp: new Date().toISOString()
        });
    }
}

// GET /api/v1/articles/getForEditing/:id
async function getArticleForEditingController(req, res) {
    try {
        const { id } = req.params;
        const result = await getArticleForEditing(id);
        if (!result.success) {
            return res.status(404).json({ error: result.error });
        }
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// PUT /api/v1/articles/updateContent/:id
async function updateArticleContentController(req, res) {
    try {
        const { id } = req.params;
        const { content } = req.body;
        
        if (!content) {
            return res.status(400).json({ error: 'Content is required' });
        }
        
        const result = await updateArticleContent(id, content);
        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// GET /api/v1/articles/getInternalLink
async function getInternalLink(req, res) {
    try {
        const { topic, domainId } = req.query;
        if (!topic || !domainId) {
            return res.status(400).json({ error: 'Missing topic or domainId' });
        }
        const relevant = await getRelevantArticles(domainId, topic, 1);
        if (!relevant || relevant.length === 0) {
            return res.status(404).json({ error: 'No relevant internal link found' });
        }
        const article = relevant[0];
        return res.json({
            anchorText: article.topic || article.keyword || 'this article',
            targetUrl: `/posts/${article.slug}`
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    getAllArticles,
    getArticle,
    updateArticle,
    deleteArticle,
    setSelectedVersion,
    publishBlog,
    getArticleForEditing: getArticleForEditingController,
    updateArticleContent: updateArticleContentController,
    getInternalLink
}; 