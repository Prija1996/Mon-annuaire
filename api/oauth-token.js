// Fonction compatible Node.js et Vercel
async function handler(req, res) {
    // Activer CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    try {
        const { code, codeVerifier, clientId, redirectUri } = req.body;

        console.log('🔄 [OAUTH] Token exchange request received');
        console.log('Code:', code?.substring(0, 10) + '...');
        console.log('Client ID:', clientId);
        console.log('Redirect URI:', redirectUri);

        if (!code || !codeVerifier || !clientId || !redirectUri) {
            console.log('❌ Missing required parameters');
            res.status(400).json({ error: 'Missing required parameters' });
            return;
        }

        // Utiliser le client secret depuis les variables d'environnement
        const clientSecret = process.env.AIRTABLE_CLIENT_SECRET;
        
        console.log('🔑 Client secret available:', !!clientSecret);
        console.log('🔑 Client secret length:', clientSecret?.length);
        
        if (!clientSecret) {
            console.log('❌ Missing client secret in environment');
            res.status(500).json({ error: 'Server configuration error - missing client secret' });
            return;
        }

        // Airtable utilise HTTP Basic Authentication pour les credentials
        const tokenParams = {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirectUri,
            code_verifier: codeVerifier
        };

        console.log('🚀 Sending request to Airtable...');
        console.log('🔍 Token params:', JSON.stringify(tokenParams, null, 2));

        // Utiliser https.request au lieu de fetch pour contourner les problèmes SSL
        const https = require('https');
        const querystring = require('querystring');

        const postData = querystring.stringify(tokenParams);

        // Créer l'en-tête Authorization avec Basic Auth
        const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

        const options = {
            hostname: 'airtable.com',
            port: 443,
            path: '/oauth2/v1/token',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData),
                'Authorization': `Basic ${basicAuth}`
            },
            rejectUnauthorized: false // Contourner la vérification SSL
        };

        console.log('🔧 Using HTTPS request with Basic Auth...');
        console.log('🔐 Basic Auth header created');
        console.log('📤 POST Data:', postData);

        const response = await new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let data = '';

                console.log('📡 Airtable response status:', res.statusCode);

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    try {
                        const jsonData = JSON.parse(data);
                        resolve({
                            ok: res.statusCode >= 200 && res.statusCode < 300,
                            status: res.statusCode,
                            json: () => Promise.resolve(jsonData),
                            text: () => Promise.resolve(data)
                        });
                    } catch (error) {
                        reject(new Error(`Failed to parse response: ${data}`));
                    }
                });
            });

            req.on('error', (error) => {
                console.error('❌ HTTPS request error:', error);
                reject(error);
            });

            req.write(postData);
            req.end();
        });

        console.log('📡 Airtable response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Airtable error response:', errorText);
            res.status(response.status).json({ 
                error: 'Token exchange failed', 
                details: errorText,
                airtableStatus: response.status
            });
            return;
        }

        const tokenData = await response.json();
        console.log('✅ Token exchange successful');
        console.log('Token type:', tokenData.token_type);
        res.status(200).json(tokenData);

    } catch (error) {
        console.error('💥 OAuth token exchange error:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}

// Export pour Node.js (CommonJS)
module.exports = handler;
