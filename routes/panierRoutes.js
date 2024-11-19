
const express = require('express');
const router = express.Router();
const panierController = require('../controllers/panierController');
const { supprimerDuPanier } = require('../controllers/panierController');
const authenticateUser = require('../middlewares/authenticateUser');
router.post('/panier',authenticateUser, panierController.ajouterAuPanier);
 router.get('/panier',authenticateUser, panierController.afficherPanier);
 router.delete('/panier/:id', supprimerDuPanier);
module.exports = router;