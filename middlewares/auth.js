const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: 'Accès refusé, token manquant' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET); // Vérifie le token
        req.user = verified; // Ajoute l'utilisateur vérifié à la requête
        next();
    } catch (err) {
        return res.status(400).json({ message: 'Token invalide' });
    }
};

module.exports = authMiddleware;
