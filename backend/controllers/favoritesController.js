const User = require('../models/User');

async function getFavorites(req, res) {
  console.log('[FAVORITES] Get favorites for user:', req.user?.id);
  try {
    const user = await User.findById(req.user.id);
    res.json(user.favorites
      .sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt))
      .map(fav => ({ artistId: fav.artistId, addedAt: fav.addedAt})));
  } catch (err) {
    console.error('[FAVORITES] Error in getFavorites:', err);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
}

async function addFavorite(req, res) {
  console.log('[FAVORITES] Add favorite for user:', req.user?.id, 'artistId:', req.body.artistId);
  try {
    const { artistId } = req.body;
    const user = await User.findById(req.user.id);
    const alreadyFavorited = user.favorites.some(fav => fav.artistId === artistId);
    if (!alreadyFavorited) {
      user.favorites.push({ artistId, addedAt: new Date() });
      await user.save();
    }
    res.status(200).send();
  } catch (err) {
    console.error('[FAVORITES] Error in addFavorite:', err);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
}

async function removeFavorite(req, res) {
  console.log('[FAVORITES] Remove favorite for user:', req.user?.id, 'artistId:', req.params.artistId);
  try {
    const { artistId } = req.params;
    const user = await User.findById(req.user.id);
    user.favorites = user.favorites.filter(fav => fav.artistId !== artistId);
    await user.save();
    res.status(200).send();
  } catch (err) {
    console.error('[FAVORITES] Error in removeFavorite:', err);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
}

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite
};