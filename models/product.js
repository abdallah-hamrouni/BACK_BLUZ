const mongoose = require('mongoose');

const produitSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
        trim: true
    },
    prix: {
        type: Number,
        required: true
    },
    image: {
        type: String
    },
    categorie: {
        type: String,
        required: true,
        trim: true
    }
});

const Produit = mongoose.model('Produit', produitSchema);

module.exports = Produit;