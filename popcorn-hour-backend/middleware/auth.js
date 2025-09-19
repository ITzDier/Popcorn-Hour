const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Extrae el token del header "x-auth-token" o "Authorization"
    let token = req.header('x-auth-token');
    if (!token) {
        // Si no está en x-auth-token, busca en Authorization (formato Bearer)
        token = req.header('Authorization')?.replace('Bearer ', '');
    }

    if (!token) {
        return res.status(401).json({ msg: 'No token, autorización denegada' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // El objeto decoded tendrá {id, role}
        next();
    } catch (err) {
        return res.status(401).json({ msg: 'Token no válido' });
    }
};