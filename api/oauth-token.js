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

        if (!code || !codeVerifier || !clientId || !redirectUri) {
            res.status(400).json({ error: 'Missing required parameters' });
            return;
        }

        // Utiliser le client secret depuis les variables d'environnement
        const clientSecret = process.env.AIRTABLE_CLIENT_SECRET;
        
        if (!clientSecret) {
            res.status(500).json({ error: 'Server configuration error' });
            return;
        }

        const response = await fetch('https://airtable.com/oauth2/v1/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                code_verifier: codeVerifier
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Airtable error:', errorText);
            res.status(response.status).json({ 
                error: 'Token exchange failed', 
                details: errorText 
            });
            return;
        }

        const tokenData = await response.json();
        res.status(200).json(tokenData);

    } catch (error) {
        console.error('OAuth token exchange error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
