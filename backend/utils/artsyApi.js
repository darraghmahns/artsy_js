const axios = require('axios');

let tokenCache = { token: null, expiresAt: 0 };

async function getToken() {
    if (tokenCache.token && Date.now() < tokenCache.expiresAt) return tokenCache.token;
    const res = await axios.post('https://api.artsy.net/api/tokens/xapp_token', {
        client_id: process.env.ARTSY_CLIENT_ID,
        client_secret: process.env.ARTSY_CLIENT_SECRET
    });
    tokenCache.token = res.data.token;
    tokenCache.expiresAt = Date.now() + 3600 * 1000;
    return tokenCache.token;
}

async function artsyGet(url) {
    const token = await getToken();

    // 🔧 Normalize relative URL
    const fullUrl = url.startsWith('http') ? url : `https://api.artsy.net/api/${url}`;

    try {
        console.log('[ARTSY API] Fetching URL:', fullUrl); // helpful log
        const response = await axios.get(fullUrl, {
            headers: { 'X-XAPP-Token': token }
        });
        return response;
    } catch (error) {
        console.error('[ARTSY API] Error fetching URL:', fullUrl);
        if (error.response) {
            console.error('[ARTSY API] Status:', error.response.status);
            console.error('[ARTSY API] Data:', error.response.data);
        } else {
            console.error('[ARTSY API] Error:', error.message);
        }
        throw error;
    }
}

module.exports = { artsyGet };