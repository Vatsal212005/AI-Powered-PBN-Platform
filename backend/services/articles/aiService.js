const { callAI } = require('../llm/aiCaller');
const {blogPrompt, guidePrompt} = require('../../data/prompts/article');
const {qualityPrompt} = require('../../data/prompts/quality');
const { processInternalLinks } = require('./internalLinksService');
const { Prisma } = require('@prisma/client');

/**
 * Generate article markdown using AI (Gemini/vLLM) and the blog prompt.
 * @param {Object} params - { niche, keyword, topic, n, targetURL, anchorText, model, provider, maxRetries, feedback, internalLinks, domainId }
 * @returns {Promise<string>} - Generated markdown content
 */
async function generateMarkdown({ niche, keyword, topic, n, targetURL, anchorText, model = 'gemini-2.5-flash', provider = 'gemini', maxRetries = 3, feedback = '', userPrompt, internalLinks = false, domainId }) {
    let attempt = 0;
    let lastError;
    let prompt;
    const today = new Date().toISOString().slice(0, 10);
    if (!userPrompt) {
        prompt = blogPrompt
            .replace('{ Topic }', topic)
            .replace('{ Niche }', niche)
            .replace('{ Keyword }', keyword)
            .replace('{ Backlink Target URL }', targetURL)
            .replace('{ Anchor Text }', anchorText)
            .replace('{ n }', n)
            .replace("{Today's Date (YYYY-MM-DD)}", today);
        prompt += guidePrompt;
    }
    else {
        prompt = userPrompt + '\n\n' + guidePrompt;
    }
    if (feedback) {
        prompt += `\n\n# QC Feedback to Address:\n${feedback}`;
    }
    while (attempt < maxRetries) {
        try {
            const generatedContent = await callAI(prompt, { provider, modelName: model });
            
            // Process internal links if enabled
            if (internalLinks && domainId) {
                return await processInternalLinks(generatedContent, domainId, topic, internalLinks);
            }
            
            return generatedContent;
        } catch (err) {
            lastError = err;
            attempt++;
        }
    }
    throw lastError;
}

/**
 * Run quality check on article markdown using AI and the QC prompt.
 * @param {string} articleText - The markdown content to check
 * @param {Object} params - { backlinkUrl, anchorText, model, provider, maxRetries }
 * @returns {Promise<Object>} - QC result as JSON
 */
async function runQC(articleText, { backlinkUrl, anchorText, model = 'gemini-2.5-flash', provider = 'gemini', maxRetries = 3 } = {}) {
    let attempt = 0;
    let lastError;
    let prompt = qualityPrompt
        .replace('{ARTICLE_TEXT}', articleText)
        .replace('{BACKLINK_URL}', backlinkUrl || '')
        .replace('{BACKLINK_ANCHOR_TEXT}', anchorText || '');
    while (attempt < maxRetries) {
        try {
            const result = await callAI(prompt, { provider, modelName: model });
            // Debug: Log the sanitized result
            // console.log('QC Result (sanitized):', result.substring(0, 200) + '...');
            // The result is already sanitized, try to parse as JSON
            return JSON.parse(result);
        } catch (err) {
            console.error('JSON Parse Error:', err.message);
            lastError = err;
            attempt++;
        }
    }
    throw lastError;
}

module.exports = {
    generateMarkdown,
    runQC,
};