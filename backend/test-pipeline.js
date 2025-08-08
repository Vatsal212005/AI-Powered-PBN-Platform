const { runBlogPipeline } = require('./services/articles/pipelineService');

async function testPipeline() {
    try {
        console.log('🧪 Testing Blog Generation Pipeline...\n');

        const testParams = {
            domain_id: 'test-domain-id', // You'll need to replace with actual domain ID
            status: 'draft',
            user: 'test-user',
            niche: 'Technology',
            keyword: 'productivity tools',
            topic: 'Top 10 Productivity Tools for 2025',
            n: 3,
            targetURL: 'https://example.com/productivity',
            anchorText: 'productivity tools',
            model: 'gemini-2.5-flash',
            provider: 'gemini',
            userPrompt: 'Write a comprehensive blog post about the top productivity tools for 2025. Include detailed reviews and comparisons.',
            internalLinks: true
        };

        console.log('📝 Test Parameters:');
        console.log(JSON.stringify(testParams, null, 2));
        console.log('\n🚀 Starting pipeline...\n');

        const result = await runBlogPipeline(testParams, 2);

        console.log('✅ Pipeline completed successfully!');
        console.log('\n📊 Results:');
        console.log(`- Article ID: ${result.articleId}`);
        console.log(`- Version ID: ${result.versionId}`);
        console.log(`- Word Count: ${result.metadata.wordCount}`);
        console.log(`- Internal Links: ${result.metadata.internalLinksCount}`);
        console.log(`- QC Status: ${result.qcResult.status}`);
        console.log(`- Attempts: ${result.attempts}`);

        if (result.fileResult?.success) {
            console.log(`- File: ${result.fileResult.fileName}`);
        }

        console.log('\n📄 Content Preview:');
        console.log(result.content.substring(0, 500) + '...');

    } catch (error) {
        console.error('❌ Pipeline test failed:', error.message);
        console.error(error.stack);
    }
}

// Run the test if this file is executed directly
if (require.main === module) {
    testPipeline();
}

module.exports = { testPipeline }; 