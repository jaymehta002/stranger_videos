const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    } else {
        res.redirect('/');
    }
};

module.exports = authenticateToken;
