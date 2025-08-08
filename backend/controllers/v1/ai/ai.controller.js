const { mockData } = require('../../../data/mockData');
const { createArticleWithVersion, createVersionForArticle } = require('../../../services/articles/coreServices');
const { runBlogPipeline } = require('../../../services/articles/pipelineService');
const { getArticle } = require('../../../services/articles/dbCrud');
const slugify = require('slugify');

// POST /api/v1/ai/generateArticle
async function generateArticle(req, res) {
    try {
        // Accept a flat body, not meta/genParams objects
        const {
            domain_id, status, user, // meta fields
            niche, keyword, topic, n, targetURL, anchorText, model, provider, // genParams fields
            maxRetries = 3,
            userPrompt,
            internalLinks = false
        } = req.body;
        // Validate required fields
        if (!userPrompt && (!niche && !keyword && !topic && !n && !targetURL && !anchorText)) {
            return res.status(400).json({ error: 'Missing required fields: userPrompt, niche, keyword, topic, n, targetURL, anchorText' });
        }
        //return res.status(200).json(mockData);
        
        // Use the new pipeline for enhanced blog generation
        const pipelineParams = {
            domain_id, status, user, niche, keyword, topic, n, targetURL, anchorText, model, provider, userPrompt, internalLinks
        };
        
        const pipelineResult = await runBlogPipeline(pipelineParams, maxRetries);
        
        const result = {
            articleId: pipelineResult.articleId,
            draft: {
                versionId: pipelineResult.versionId,
                versionNum: 1,
                content: pipelineResult.content,
                qcResult: pipelineResult.qcResult
            },
            status: 'generated',
            metadata: pipelineResult.metadata,
            fileResult: pipelineResult.fileResult
        };
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// POST /api/v1/ai/generateArticleVersion
async function generateArticleVersion(req, res) {
    try {
        const { articleId, provider = 'gemini', maxRetries = 3 } = req.body;
        if (!articleId) {
            return res.status(400).json({ error: 'Missing required fields: articleId' });
        }
        const article = await getArticle(articleId);
        if (!article) {
            return res.status(404).json({ error: 'Article not found' });
        }
        const genParams = {
            niche: article.niche,
            keyword: article.keyword,
            topic: article.topic,
            n: 3, // or article.n if present
            targetURL: article.backlink_target,
            anchorText: article.anchor,
            // model: 'gemini-2.5-flash',
            provider: provider,
            internalLinks: article.internal_links || false,
        };
        const result = await createVersionForArticle(articleId, genParams, maxRetries);
        res.json({
            articleId,
            draft: {
                versionId: result.versionId,
                versionNum: result.versionNum,
                content: result.content,
                qcResult: result.qcResult
            },
            status: result.status
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    generateArticle,
    generateArticleVersion
};
