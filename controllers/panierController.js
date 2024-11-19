
const Panel = require('../models/panel'); 
const Panier = require('../models/panier');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

exports.ajouterAuPanier = async (req, res) => {
    const { panelId, nom, prix, image, categorie, quantite } = req.body;
    const userId = req.userId; // ID de l'utilisateur récupéré via le middleware d'authentification

    console.log("Données reçues : ", req.body);
    console.log("ID utilisateur : ", userId);

    try {
        // Chercher le panier existant pour l'utilisateur
        let panier = await Panier.findOne({ userId });

        // Si aucun panier n'existe pour cet utilisateur, en créer un nouveau
        if (!panier) {
            panier = new Panier({ userId, items: [] });
        }

        // Chercher si le produit existe déjà dans le panier
        const existingItemIndex = panier.items.findIndex(item => item.panel.toString() === panelId.toString());

        if (existingItemIndex !== -1) {
            // Si le produit existe déjà, on incrémente la quantité
            panier.items[existingItemIndex].quantite += quantite;
        } else {
            // Sinon, on ajoute le produit avec la quantité initiale
            panier.items.push({
                panel: panelId,
                nom,
                prix,
                image,
                categorie,
                quantite
            });
        }

        // Sauvegarder le panier après modification
        await panier.save();
        res.status(200).json({ message: "Article ajouté au panier", panier });
    } catch (error) {
        console.error("Erreur lors de l'ajout au panier:", error);
        res.status(500).json({ message: "Erreur lors de l'ajout au panier", error });
    }
};





exports.afficherPanier = async (req, res) => {
    const userId = req.userId; // ID de l'utilisateur récupéré via le middleware d'authentification

    try {
        // Récupérer le panier de l'utilisateur
        const panier = await Panier.findOne({ userId });

        // Vérifier si le panier existe
        if (!panier || panier.items.length === 0) {
            return res.status(404).json({ message: "Le panier est vide." });
        }

        // Formater les données des articles pour la réponse
        const items = panier.items.map(item => ({
            panelId: item.panel,
            nom: item.nom,
            prix: item.prix,
            image: item.image,
            categorie: item.categorie,
            quantite: item.quantite,
            total: item.prix * item.quantite // Calculer le total pour cet article
        }));

        res.status(200).json({ panier: { items } }); // Retourner les articles du panier
    } catch (error) {
        console.error("Erreur lors de la récupération du panier:", error);
        res.status(500).json({ message: "Erreur lors de la récupération du panier", error });
    }
};

exports.supprimerDuPanier = async (req, res) => {
    const { id } = req.params; // ID du produit à supprimer

    try {
        
        const result = await Panier.updateOne(
            { 'items.panel': id }, // On cherche dans le tableau des items
            { $pull: { items: { panel: id } } } // On utilise $pull pour supprimer l'élément
        );

        // Vérifiez si un produit a été supprimé
        if (result.modifiedCount > 0) {
            return res.status(200).json({ message: 'Produit supprimé avec succès' });
        } else {
            return res.status(404).json({ message: 'Produit non trouvé dans le panier' });
        }
    } catch (error) {
        console.error("Erreur lors de la suppression du produit :", error);
        return res.status(500).json({ message: 'Erreur lors de la suppression du produit', error });
    }
};
