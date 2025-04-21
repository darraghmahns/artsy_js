const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getGravatarUrl } = require('../utils/gravatar');

const SECRET = process.env.JWT_SECRET;

async function register(req, res) {
  console.log('[AUTH] Register endpoint hit:', { email: req.body.email });
  const { fullname, email, password } = req.body;
  console.log('[REGISTER] Received:', req.body);
  try {
    if (!fullname || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hash = await bcrypt.hash(password, 10);
    const gravatarUrl = getGravatarUrl(email);

    const user = await User.create({
      fullname,
      email,
      password: hash,
      profileImageUrl: gravatarUrl,
      favorites: []
    });

    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
    res.json({ fullname: user.fullname, email: user.email, profileImageUrl: user.profileImageUrl });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
}

async function login(req, res) {
  console.log('[AUTH] Login endpoint hit:', { email: req.body.email });
  const { email, password } = req.body;
  console.log('[LOGIN] Received:', { email });
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('[LOGIN] No user found for email:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.log('[LOGIN] Invalid password for user:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: '1h' });
    console.log('[LOGIN] Success for user:', email);
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
    res.json({ fullname: user.fullname, email: user.email, profileImageUrl: user.profileImageUrl });
  } catch (err) {
    console.error('[LOGIN] Unexpected error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
}

function logout(req, res) {
  console.log('[AUTH] Logout endpoint hit');
  res.clearCookie('token');
  res.status(200).send();
}

async function deleteAccount(req, res) {
  console.log('[AUTH] DeleteAccount endpoint hit for user:', req.user?.id);
  try {
    await User.findByIdAndDelete(req.user.id);
    res.clearCookie('token');
    res.status(200).send();
  } catch {
    res.status(500).json({ error: 'Failed to delete account' });
  }
}

async function getProfile(req, res) {
  console.log('[AUTH] GetProfile endpoint hit for user:', req.user?.id);
  try {
    const user = await User.findById(req.user.id);
    res.json({
      fullname: user.fullname, 
      email: user.email, 
      profileImageUrl: user.profileImageUrl,
      favorites: user.favorites
    });
  } catch {
    res.status(500).json({ error: 'Failed to get profile' });
  }
}

async function checkEmail(req, res) {
  const email = req.query.email;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const user = await User.findOne({ email });
    res.json({ exists: !!user });
  } catch (err) {
    console.error('[AUTH] Email check error:', err);
    res.status(500).json({ error: 'Failed to check email' });
  }
}

module.exports = {
  register,
  login,
  logout,
  deleteAccount,
  getProfile,
  checkEmail
};