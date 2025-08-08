const prisma = require('../../db/prisma');

/**
 * Get relevant articles from the same domain for internal linking
 * @param {string} domainId - The domain ID
 * @param {string} currentTopic - The current article topic for relevance matching
 * @param {number} limit - Maximum number of articles to return
 * @returns {Promise<Array>} - Array of relevant articles
 */
async function getRelevantArticles(domainId, currentTopic, limit = 5) {
    try {
        // Get articles from the same domain
        const articles = await prisma.article.findMany({
            where: {
                domain_id: domainId,
                status: {
                    in: ['published', 'draft', 'generated']
                }
            },
            select: {
                id: true,
                slug: true,
                topic: true,
                niche: true,
                keyword: true
                // ❌ Removed 'title' as it's not in your schema
            },
            take: limit
        });

        // Simple relevance scoring based on niche and keyword overlap
        const scoredArticles = articles.map(article => {
            let score = 0;

            if (article.niche && currentTopic.toLowerCase().includes(article.niche.toLowerCase())) {
                score += 2;
            }

            if (article.keyword && currentTopic.toLowerCase().includes(article.keyword.toLowerCase())) {
                score += 1;
            }

            if (article.topic && currentTopic.toLowerCase().includes(article.topic.toLowerCase())) {
                score += 1;
            }

            return { ...article, relevanceScore: score };
        });

        return scoredArticles
            .filter(article => article.relevanceScore > 0)
            .sort((a, b) => b.relevanceScore - a.relevanceScore)
            .slice(0, 3);
    } catch (error) {
        console.error('Error fetching relevant articles:', error);
        return [];
    }
}

/**
 * Insert internal links into blog content
 * @param {string} content - The blog content in markdown
 * @param {Array} relevantArticles - Array of relevant articles
 * @param {number} numLinks - Number of internal links to insert (1-2)
 * @returns {string} - Content with internal links inserted
 */
function insertInternalLinks(content, relevantArticles, numLinks = 2) {
    if (!relevantArticles || relevantArticles.length === 0) {
        return content;
    }

    const paragraphs = content.split('\n\n');
    const linksToInsert = Math.min(numLinks, relevantArticles.length);
    const selectedArticles = relevantArticles.slice(0, linksToInsert);

    let linksInserted = 0;
    const modifiedParagraphs = [];

    for (let i = 0; i < paragraphs.length && linksInserted < linksToInsert; i++) {
        const paragraph = paragraphs[i];

        if (paragraph.length < 50 || paragraph.startsWith('#')) {
            modifiedParagraphs.push(paragraph);
            continue;
        }

        const sentences = paragraph.split(/[.!?]+/).filter(s => s.trim().length > 20);

        if (sentences.length > 0) {
            const article = selectedArticles[linksInserted];
            const anchorText = article.topic || article.keyword || 'this article';
            const internalLink = `[${anchorText}](/posts/${article.slug})`;

            const midSentence = sentences[Math.floor(sentences.length / 2)];
            const words = midSentence.trim().split(' ');
            const insertIndex = Math.floor(words.length / 2);

            words.splice(insertIndex, 0, internalLink);
            const modifiedSentence = words.join(' ');

            const modifiedParagraph = paragraph.replace(midSentence.trim(), modifiedSentence);
            modifiedParagraphs.push(modifiedParagraph);
            linksInserted++;
        } else {
            modifiedParagraphs.push(paragraph);
        }
    }

    // Add the rest of the paragraphs (in case some were skipped)
    modifiedParagraphs.push(...paragraphs.slice(modifiedParagraphs.length));

    return modifiedParagraphs.join('\n\n');
}

/**
 * Process blog content with internal links
 * @param {string} content - The blog content
 * @param {string} domainId - The domain ID
 * @param {string} currentTopic - The current article topic
 * @param {boolean} enableInternalLinks - Whether to enable internal linking
 * @returns {Promise<string>} - Processed content
 */
async function processInternalLinks(content, domainId, currentTopic, enableInternalLinks) {
    if (!enableInternalLinks) {
        return content;
    }

    try {
        const relevantArticles = await getRelevantArticles(domainId, currentTopic);

        if (relevantArticles.length === 0) {
            console.log('No relevant articles found for internal linking');
            return content;
        }

        const numLinks = Math.floor(Math.random() * 2) + 1;
        const processedContent = insertInternalLinks(content, relevantArticles, numLinks);

        console.log(`Inserted ${numLinks} internal links into blog content`);
        return processedContent;
    } catch (error) {
        console.error('Error processing internal links:', error);
        return content;
    }
}

module.exports = {
    getRelevantArticles,
    insertInternalLinks,
    processInternalLinks
};
