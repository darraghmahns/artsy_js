const express = require('express');
const router = express.Router();
const controller = require('../controllers/artistController');

// Route definitions now use controller functions
router.get('/artworks', controller.getArtworks);
router.get('/categories', controller.getCategories);
router.get('/similar-artists', controller.getSimilarArtists);
router.get('/:id', controller.getArtist);

module.exports = router;