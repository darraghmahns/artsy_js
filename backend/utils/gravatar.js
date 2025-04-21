const crypto = require('crypto');

function getGravatarUrl(email) {
    const hash = crypto.createHash('sha256').update(email.trim().toLowerCase()).digest('hex');
    return `https://www.gravatar.com/avatar/${hash}`;
}

module.exports = { getGravatarUrl };