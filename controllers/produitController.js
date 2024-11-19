const Produit = require('../models/product');

// Créer un nouveau produit
exports.creerProduit = async (req, res) => {
    try {
        // Les champs texte du form-data (nom, prix, categorie)
        const { nom, prix, categorie } = req.body;

        // Vérifier si un fichier a été uploadé et générer l'URL de l'image
        const imageUrl = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : null;

        // Créer un nouveau produit avec les données envoyées
        const produit = new Produit({
            nom,
            prix,
            categorie,
            image: imageUrl  // Enregistrer l'URL de l'image dans MongoDB
        });

        // Sauvegarder le produit dans la base de données
        await produit.save();

        // Répondre avec le produit créé
        res.status(201).json(produit);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtenir tous les produits
exports.getProduits = async (req, res) => {
    try {
        const produits = await Produit.find();
        res.status(200).json(produits);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir un produit par son ID
exports.getProduitById = async (req, res) => {
    try {
        const produit = await Produit.findById(req.params.id);
        if (!produit) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        res.status(200).json(produit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour un produit
exports.updateProduit = async (req, res) => {
    try {
        const produit = await Produit.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!produit) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        res.status(200).json(produit);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Supprimer un produit
exports.deleteProduit = async (req, res) => {
    try {
        const produit = await Produit.findByIdAndDelete(req.params.id);
        if (!produit) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        res.status(200).json({ message: 'Produit supprimé' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
