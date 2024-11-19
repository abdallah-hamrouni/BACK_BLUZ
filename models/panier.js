// models/panier.js
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    panel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Panel', 
        required: true
    },
    nom: {
        type: String,
        required: true
    },
    prix: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    categorie: {
        type: String,
        required: true
    },
    quantite: {
        type: Number,
        required: true,
        min: 1
    }
});

const panierSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  
        required: true
    },
    items: [itemSchema]
});

const Panier = mongoose.model('Panier', panierSchema);
module.exports = Panier;
