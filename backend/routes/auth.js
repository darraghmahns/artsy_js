const express = require('express');
const router = express.Router();

const { register, login, logout, deleteAccount, getProfile, checkEmail } = require('../controllers/authController');
const { authenticated } = require('../middleware/auth');
const { unauthenticated } = require('../middleware/unauth');

router.post('/register', unauthenticated, register);
router.post('/login', unauthenticated, login);
router.post('/logout', authenticated, logout);
router.delete('/delete-account', authenticated, deleteAccount);
router.get('/me', authenticated, getProfile);
router.get('/check-email', unauthenticated, checkEmail);

module.exports = router;