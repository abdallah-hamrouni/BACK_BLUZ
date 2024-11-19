const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); 
const authMiddleware = require('../middlewares/auth'); 
const router = express.Router();

// Route POST pour l'enregistrement d'un utilisateur
router.post('/register', async (req, res) => {
    const { name, email, password, pass, phone } = req.body;

    // Vérification si l'utilisateur existe déjà
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Vérification du champ "pass"
    if (!pass) {
        return res.status(400).json({ message: 'Le champ "pass" n\'est pas présent dans la requête' });
    }

    // Comparaison des mots de passe
    if (password !== pass) {
        console.log(password);
        console.log(pass);
        return res.status(400).json({ message: 'Les mots de passe ne correspondent pas' });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur
    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        pass,
        phone
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json({ message: 'Utilisateur créé avec succès', user: savedUser });
    } catch (err) {
        res.status(500).json({ message: 'Erreur serveur', error: err });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
        message: 'Connexion réussie',
        token: token
    });
});


router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); 
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

module.exports = router;
