const { createDomainFolder, getAvailableTemplates, listDomains } = require('./services/domain/staticGen');

async function testDomainAPI() {
    console.log('🧪 Testing Domain API Functions...\n');
    
    try {
        // Test 1: Get Available Templates
        console.log('1️⃣ Testing getAvailableTemplates...');
        const templates = await getAvailableTemplates();
        console.log('✅ Available templates:', templates);
        console.log();

        // Test 2: List existing domains
        console.log('2️⃣ Testing listDomains...');
        const domains = await listDomains();
        console.log('✅ Existing domains:', domains);
        console.log();

        // Test 3: Create a test domain folder
        console.log('3️⃣ Testing createDomainFolder...');
        const testDomainName = 'test-domain-' + Date.now();
        const domainPath = await createDomainFolder(testDomainName);
        console.log(`✅ Created domain folder: ${domainPath}`);
        console.log();

        // Test 4: List domains again to see the new one
        console.log('4️⃣ Testing listDomains after creation...');
        const domainsAfter = await listDomains();
        console.log('✅ Domains after creation:', domainsAfter);

    } catch (error) {
        console.error('❌ Error during testing:', error.message);
        console.error('Stack trace:', error.stack);
    }
}

// Run the test
testDomainAPI();
