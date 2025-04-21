function unauthenticated(req, res, next) {
    if (req.cookies.token) {
      return res.status(403).json({ error: 'Already authenticated' });
    }
    next();
  }
  
  module.exports = { unauthenticated };