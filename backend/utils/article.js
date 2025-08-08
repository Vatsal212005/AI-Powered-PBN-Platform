const prisma = require('../db/prisma');


async function getUniqueArticleSlug(baseSlug) {
    let slug = baseSlug;
    let count = 1;
    while (await prisma.article.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${count++}`;
    }
    return slug;
}

module.exports = {
    getUniqueArticleSlug
};