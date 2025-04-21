const express = require('express');
const router = express.Router();
const { artsyGet } = require('../utils/artsyApi');

router.get('/', async (req, res) => {
    try {
        const q = req.query.q;
        const response = await artsyGet(`https://api.artsy.net/api/search?q=${encodeURIComponent(q)}&type=artist`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching search results' });
    }
});

module.exports = router;