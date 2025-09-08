export default async function handler(req, res) {
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

        console.log('Received request:', { code: code?.substring(0, 10) + '...', clientId, redirectUri });

        if (!code || !codeVerifier || !clientId || !redirectUri) {
            res.status(400).json({ error: 'Missing required parameters' });
            return;
        }

        // Utiliser le client secret depuis les variables d'environnement
        const clientSecret = process.env.AIRTABLE_CLIENT_SECRET;
        
        console.log('Client secret available:', !!clientSecret);
        console.log('Client secret length:', clientSecret?.length);
        
        if (!clientSecret) {
            res.status(500).json({ error: 'Server configuration error - missing client secret' });
            return;
        }

        const tokenParams = {
            grant_type: 'authorization_code',
            code: code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            code_verifier: codeVerifier
        };

        console.log('Token request params:', {
            ...tokenParams,
            client_secret: '***hidden***',
            code: code.substring(0, 10) + '...',
            code_verifier: codeVerifier.substring(0, 10) + '...'
        });

        const response = await fetch('https://airtable.com/oauth2/v1/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(tokenParams)
        });

        console.log('Airtable response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Airtable error response:', errorText);
            res.status(response.status).json({ 
                error: 'Token exchange failed', 
                details: errorText,
                airtableStatus: response.status
            });
            return;
        }

        const tokenData = await response.json();
        console.log('Token exchange successful');
        res.status(200).json(tokenData);

    } catch (error) {
        console.error('OAuth token exchange error:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}
