const express = require('express');
const router = express.Router();
const produitController = require('../controllers/produitController');
const upload = require('../middlewares/multerConfig');
// Routes pour les produits
router.post('/produits', upload.single('image'), produitController.creerProduit);
router.get('/produits', produitController.getProduits);
router.get('/produits/:id', produitController.getProduitById);
router.patch('/produits/:id', produitController.updateProduit);
router.delete('/produits/:id', produitController.deleteProduit);

module.exports = router;
