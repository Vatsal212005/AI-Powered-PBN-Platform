const https = require('https');
const fs = require('fs');
const path = require('path');

async function callVllm(content, modelName = 'huihui-ai/Qwen3-14B-abliterated-nf4') {
    return new Promise((resolve, reject) => {
        try {
            const token = process.env.VLLM_TOKEN;
            const host = process.env.VLLM_HOST;
            const model = process.env.VLLM_MODEL;
            console.log(token, host, model);
            if (!token || !host || !model) {
                throw new Error('VLLM_TOKEN, VLLM_HOST, and VLLM_MODEL environment variables are required');
            }

            const prompt = "Please start your actual response with `<<<START>>>` and end with `<<<END>>>`" + content;

            // Use default DNS lookup - the custom lookup was causing issues
            const agent = new https.Agent();

            // Parse the host URL properly
            let hostname, port;
            if (host.startsWith('http://') || host.startsWith('https://')) {
                const url = new URL(host);
                hostname = url.hostname;
                port = url.port || (url.protocol === 'https:' ? 443 : 80);
            } else {
                // If host is just a hostname, assume HTTPS
                hostname = host;
                port = 443;
            }

            console.log('Parsed hostname:', hostname, 'port:', port);

            const apiPath = '/v1/completions';
            const options = {
                hostname: hostname,
                port: port,
                path: apiPath,
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                agent
            };

            console.log(`Connecting to ${host.startsWith('http') ? host : `https://${host}`}${path}...`);

            let fullResponse = '';
            let filteredResponse = '';
            let insideStartTag = false;
            let insideEndTag = false;
            let startTagFound = false;
            let endTagFound = false;

            const req = https.request(options, (res) => {
                const startTime = Date.now();
                let buffer = '';

                res.setEncoding('utf8');

                res.on('data', chunk => {
                    buffer += chunk;
                    const lines = buffer.split('\n');
                    buffer = lines.pop(); // keep unfinished line

                    lines.forEach(line => {
                        if (line.startsWith('data:')) {
                            const jsonStr = line.slice(5).trim();

                            if (jsonStr === '[DONE]') {
                                console.log('\n[Stream finished]');
                                return;  // Skip parsing
                            }

                            try {
                                const data = JSON.parse(jsonStr);
                                const text = data.choices?.[0]?.text || '';

                                // Save the entire response
                                fullResponse += text;

                                // Improved parsing logic for start/end tags
                                if (!startTagFound && fullResponse.includes('<<<START>>>')) {
                                    startTagFound = true;
                                    insideStartTag = true;
                                    // Find the start tag in the full response
                                    const startIndex = fullResponse.indexOf('<<<START>>>');
                                    if (startIndex !== -1) {
                                        // Get everything after the start tag
                                        filteredResponse = fullResponse.substring(startIndex + '<<<START>>>'.length);
                                    }
                                } else if (startTagFound && !endTagFound && fullResponse.includes('<<<END>>>')) {
                                    endTagFound = true;
                                    insideEndTag = true;
                                    // Find the end tag in the full response
                                    const endIndex = fullResponse.indexOf('<<<END>>>');
                                    if (endIndex !== -1) {
                                        // Get everything between start and end tags
                                        const startIndex = fullResponse.indexOf('<<<START>>>');
                                        if (startIndex !== -1) {
                                            filteredResponse = fullResponse.substring(startIndex + '<<<START>>>'.length, endIndex);
                                        }
                                    }
                                    // Exit early when end tag is found
                                    console.log('\n[End tag found, stopping stream]');
                                    req.destroy();
                                    return;
                                } else if (insideStartTag && !insideEndTag) {
                                    // Continue building filtered response
                                    filteredResponse += text;
                                }

                                process.stdout.write(text);
                            } catch (e) {
                                console.error('JSON parse error:', e.message);
                            }
                        }
                    });
                });

                res.on('end', () => {
                    const elapsedSeconds = (Date.now() - startTime) / 1000;
                    console.log('\n[Stream ended]');
                    console.log(`Total time: ${elapsedSeconds.toFixed(2)} seconds`);
                    console.log(`Full response length: ${fullResponse.length} characters`);
                    console.log(`Filtered response length: ${filteredResponse.length} characters`);

                    // Save full response to file
                    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                    const filename = `vllm_response_${timestamp}.txt`;
                    const filepath = path.join(__dirname, '..', '..', filename);

                    try {
                        fs.writeFileSync(filepath, fullResponse, 'utf8');
                        console.log(`\nFull response saved to: ${filepath}`);
                    } catch (writeError) {
                        console.error('Error saving response to file:', writeError);
                    }

                    // Log the filtered response
                    console.log('\n=== FILTERED RESPONSE ===');
                    console.log(filteredResponse);
                    console.log('=== END FILTERED RESPONSE ===\n');

                    resolve(filteredResponse);
                });

                res.on('close', () => {
                    if (endTagFound) {
                        console.log('\n[Stream closed after early exit]');
                        resolve(filteredResponse);
                    }
                });
            });

            req.on('error', (e) => {
                console.error('Request error:', e);
                reject(e);
            });

            req.write(JSON.stringify({
                model: model,
                prompt: prompt,
                max_tokens: 2400,
                temperature: 0.6,
                stream: true
            }));

            req.end();
        } catch (error) {
            console.error('vLLM API call failed:', error);
            reject(error);
        }
    });
}

module.exports = { callVllm };
