const { artsyGet } = require('../utils/artsyApi');

console.log('[SEARCH CONTROLLER] Loaded');

async function searchArtists(req, res) {
  try {
    const q = req.query.q;
    console.log('[SEARCH] Endpoint hit');
    console.log('[SEARCH] Searching for artists with query:', q);
    const response = await artsyGet(`https://api.artsy.net/api/search?q=${encodeURIComponent(q)}&type=artist`);
    res.json(response.data);
    console.log('[SEARCH] Results returned successfully');
  } catch (err) {
    console.error('[SEARCH] Error fetching search results:', err);
    res.status(500).json({ error: 'Error fetching search results' });
  }
}

module.exports = { searchArtists };