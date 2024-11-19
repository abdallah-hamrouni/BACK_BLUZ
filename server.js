const express = require('express');
const mongoose = require('mongoose');
const { OAuth2Client } = require('google-auth-library');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const ProduitRoutes = require('./routes/produitRoutes');
const panierRoutes = require('./routes/panierRoutes');
const User=require('./models/user');
const cors = require('cors');
dotenv.config();

const app = express();
app.use('/uploads', express.static('uploads'));
const client = new OAuth2Client('891812901211-2ahi02tm34vmtqta2599ipkpoc13ii6u.apps.googleusercontent.com');

app.use(cors({
    origin: 'http://localhost:3000', // Autoriser uniquement le frontend React
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],      // Autoriser uniquement les requêtes GET et POST
    credentials: true                // Autoriser l'envoi de cookies
}));


app.use(express.json()); 
// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
    
})
.then(() => {
    
})
.catch((err) => {
    
});


app.post('/api/auth/google', async (req, res) => {
    const { token } = req.body;  // Récupère le token envoyé par le frontend

    try {
        // Vérifier et décoder le jeton avec la bibliothèque Google
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: '891812901211-2ahi02tm34vmtqta2599ipkpoc13ii6u.apps.googleusercontent.com', // Assurez-vous que c'est le bon client ID
        });

        const payload = ticket.getPayload();
        const { sub, email, name } = payload; // Les informations utilisateur

        // Rechercher l'utilisateur soit par googleId soit par email pour éviter les duplications
        let user = await User.findOne({ $or: [{ googleId: sub }, { email }] });

        if (!user) {
            // Si l'utilisateur n'existe pas, on l'enregistre
            user = new User({
                googleId: sub,
                email,
                name
            });
            await user.save();
        } else {
            console.log("Utilisateur déjà existant avec cet email ou googleId.");
        }

        res.status(200).json({ message: 'Utilisateur enregistré ou existant', user });
    } catch (error) {
        console.error('Erreur d\'authentification Google:', error);
        res.status(400).json({ message: 'Erreur lors de la vérification du jeton' });
    }
});



app.use(authRoutes);
app.use(ProduitRoutes);
app.use(panierRoutes);


// Démarrer le serveur Express
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {

});