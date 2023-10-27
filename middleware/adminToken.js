const jwt = require('jsonwebtoken');

const checkAdminRole = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        return next();
    } else {
        res.status(403).redirect('/dashboard');
    }
};

module.exports = checkAdminRole;
