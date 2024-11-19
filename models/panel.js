const mongoose = require('mongoose');


const panelSchema = new mongoose.Schema({
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
    } });

const Panel = mongoose.model('panel', panelSchema);

module.exports = Panel;