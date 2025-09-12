module.exports = function(requiredRole) {
    return function(req, res, next) {
        if (req.user && req.user.role === requiredRole) {
            next();
        } else {
            res.status(403).json({ msg: 'Acceso denegado: solo moderadores' });
        }
    };
};