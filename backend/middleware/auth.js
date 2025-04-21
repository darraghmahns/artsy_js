const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET

function authenticated(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.status(401).send({ error: 'Not authenticated' });

    try {
        req.user = jwt.verify(token, SECRET);
        next();
    } catch {
        res.status(401).send({ error: "Invalid token" });
    }
}

module.exports = { authenticated };