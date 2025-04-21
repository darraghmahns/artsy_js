const { artsyGet } = require('../utils/artsyApi');

async function getArtist(req, res) {
  const artistId = req.params.id;
  console.log('[ARTIST] Get artist by ID:', artistId);
  try {
    const response = await artsyGet(`https://api.artsy.net/api/artists/${artistId}`);
    res.json(response.data);
  } catch (err) {
    console.error('[ARTIST] Error fetching artist by ID:', artistId);
    if (err.response) {
      console.error('[ARTIST] Error details:', err.response.status, err.response.data);
    } else {
      console.error('[ARTIST] General error:', err.message);
    }
    res.status(500).json({ error: 'Error fetching artist info' });
  }
}

async function getArtworks(req, res) {
  const artistId = req.query.artist_id;
  console.log('[ARTIST] Get artworks for artist_id:', artistId);

  if (!artistId) {
    console.error('[ARTIST] Missing artist_id in query params');
    return res.status(400).json({ error: 'Missing artist_id' });
  }

  const url = `https://api.artsy.net/api/artworks?artist_id=${artistId}`;

  console.log('[ARTIST] Fetching from Artsy URL:', url);

  try {
    const response = await artsyGet(url);
    console.log('[ARTIST] Fetched artworks:', response.data);
    res.json(response.data);
  } catch (err) {
    console.error('[ARTIST] Error fetching artworks for:', artistId);
    if (err.response) {
      console.error('[ARTIST] Error details:', err.response.status, err.response.data);
    } else {
      console.error('[ARTIST] General error:', err.message);
    }
    res.status(500).json({ error: 'Error fetching artworks' });
  }
}

async function getCategories(req, res) {
  console.log('[ARTIST] Get categories for artwork_id:', req.query.artwork_id);
  try {
    const response = await artsyGet(`https://api.artsy.net/api/genes?artwork_id=${req.query.artwork_id}`);
    res.json(response.data);
  } catch (err) {
    console.error('[ARTIST] Error fetching categories:', err);
    res.status(500).json({ error: 'Error fetching categories' });
  }
}

async function getSimilarArtists(req, res) {
  const artistId = req.query.artist_id;

  if (!artistId) {
    console.error('[ARTIST] Missing artist_id in query params for getting similar artists');
    return res.status(400).json({ error: 'Missing artist_id' });
  }

  console.log('[ARTIST] Get similar artists for artist_id:', artistId);
  try {
    const response = await artsyGet(`https://api.artsy.net/api/artists?similar_to_artist_id=${encodeURIComponent(artistId)}`);
    res.json(response.data);
  } catch (err) {
    console.error('[ARTIST] Error fetching similar artists for artist_id:', artistId);
    if (err.response) {
      console.error('[ARTIST] Error details:', err.response.status, err.response.data);
    } else {
      console.error('[ARTIST] General error:', err.message);
    }
    res.status(500).json({ error: 'Error fetching similar artists' });
  }
}

module.exports = {
  getArtist,
  getArtworks,
  getCategories,
  getSimilarArtists
};