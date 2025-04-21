const express = require('express');
const router = express.Router();
const { authenticated } = require('../middleware/auth');
const { getFavorites, addFavorite, removeFavorite } = require('../controllers/favoritesController');

router.get('/', authenticated, getFavorites);
router.post('/', authenticated, addFavorite);
router.delete('/:artistId', authenticated, removeFavorite);

module.exports = router;