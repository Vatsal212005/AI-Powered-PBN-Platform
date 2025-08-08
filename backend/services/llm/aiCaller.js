const { callGemini } = require('./gemini');
const { callVllm } = require('./vllm');

/**
 * Sanitize AI response by removing backticks and JSON formatting
 * @param {string} response - Raw AI response
 * @returns {string} - Cleaned response
 */
function sanitizeResponse(response) {
    if (!response || typeof response !== 'string') {
        return response;
    }
    
    let cleaned = response.trim();
    
    // Remove markdown code blocks (```json, ```, etc.)
    cleaned = cleaned.replace(/```(?:json|js|javascript|markdown)?\s*\n?/gi, '');
    cleaned = cleaned.replace(/```\s*$/gi, '');
    
    // Remove leading/trailing backticks
    cleaned = cleaned.replace(/^`+/, '').replace(/`+$/, '');
    
    // Remove any remaining backticks at the start/end of lines
    cleaned = cleaned.replace(/^\s*`/gm, '').replace(/`\s*$/gm, '');
    
    return cleaned.trim();
}

/**
 * Central AI call dispatcher.
 * @param {string|object} content - The prompt or content to send.
 * @param {Object} options - { provider: 'gemini'|'vllm', modelName: string }
 * @returns {Promise<string>} - The generated text/content from the selected AI.
 */
async function callAI(content, { provider = 'gemini', modelName } = {}) {
    let response;
    switch (provider) {
        case 'gemini':
            response = await callGemini(content, modelName);
            break;
        case 'vllm':
            response = await callVllm(content, modelName);
            break;
        default:
            throw new Error(`Unknown AI provider: ${provider}`);
    }
    
    return sanitizeResponse(response);
}

module.exports = { callAI }; 