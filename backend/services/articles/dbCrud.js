const prisma = require('../../db/prisma');

async function createArticle(article) {
    return await prisma.article.create({ data: article });
}

async function getArticle(id) {
    return await prisma.article.findUnique({ where: { id }, include: { versions: true, domain: true } });
}

async function getAllArticles() {
    return await prisma.article.findMany({ 
        include: { 
            versions: {
                where: {
                    last_qc_status: 'pass'
                }
            }, 
            domain: true 
        } 
    });
}

async function updateArticle(id, data) {
    const { internalLinks, ...rest } = data;
    return await prisma.article.update({
        where: { id },
        data: {
            ...rest,
            ...(internalLinks !== undefined ? { internal_links: internalLinks } : {})
        }
    });
}

async function deleteArticle(id) {
    return await prisma.article.delete({ where: { id } });
}

async function setSelectedVersion(articleId, versionId) {
    return await prisma.article.update({
        where: { id: articleId },
        data: { selected_version_id: versionId }
    });
}

module.exports = {
    createArticle,
    getArticle,
    getAllArticles,
    updateArticle,
    deleteArticle,
    setSelectedVersion
};