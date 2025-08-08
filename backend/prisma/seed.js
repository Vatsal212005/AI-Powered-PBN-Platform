const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create sample domains first
  const domain1 = await prisma.domain.create({
    data: {
      slug: 'techblog',
      name: 'Tech Blog',
      url: 'https://techblog.com',
      tags: 'technology,AI,programming'
    }
  });

  const domain2 = await prisma.domain.create({
    data: {
      slug: 'productivity',
      name: 'Productivity Hub',
      url: 'https://productivity.com',
      tags: 'productivity,remote-work,tips'
    }
  });

  // Create sample articles
  const article1 = await prisma.article.create({
    data: {
      slug: 'getting-started-with-ai-content',
      niche: 'Technology',
      topic: 'AI Content',
      keyword: 'AI content generation',
      anchor: 'AI content tools',
      backlink_target: 'https://example.com/ai-tools',
      status: 'PUBLISHED',
      domain_id: domain1.id,
      internal_links: true
    }
  });

  const article2 = await prisma.article.create({
    data: {
      slug: 'productivity-tips-remote-work',
      niche: 'Productivity',
      topic: 'Remote Work',
      keyword: 'remote work productivity',
      status: 'DRAFT',
      domain_id: domain2.id
    }
  });

  // Create versions for the first article
  const version1 = await prisma.articleVersion.create({
    data: {
      article_id: article1.id,
      version_num: 1,
      content_md: '# Getting Started with AI Content Generation\n\nThis is a comprehensive guide to using AI for content creation in 2025.'
    }
  });

  const version2 = await prisma.articleVersion.create({
    data: {
      article_id: article1.id,
      version_num: 2,
      content_md: '# Getting Started with AI Content Generation (Updated)\n\nThis is an updated comprehensive guide to using AI for content creation in 2025.'
    }
  });

  // Set the second version as selected
  await prisma.article.update({
    where: { id: article1.id },
    data: { selected_version_id: version2.id }
  });

  // Create a version for the second article
  const version3 = await prisma.articleVersion.create({
    data: {
      article_id: article2.id,
      version_num: 1,
      content_md: '# Top Productivity Tips for Remote Workers\n\nEssential strategies to stay productive while working from home.'
    }
  });

  await prisma.article.update({
    where: { id: article2.id },
    data: { selected_version_id: version3.id }
  });

  console.log('✅ Database seeding completed successfully!');
  console.log(`🏠 Created ${await prisma.domain.count()} domains`);
  console.log(`📄 Created ${await prisma.article.count()} articles`);
  console.log(`📑 Created ${await prisma.articleVersion.count()} article versions`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 