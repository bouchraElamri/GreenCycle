const express = require('express');
const { getProducts, findProductById , filterByPrice , getNewstProducts , productSortedByPrice } = require('../controllers/product.controller');
const router = express.Router();

// Public routes placeholder
router.get('/', (req, res) => res.json({ message: 'Public API root' }));
router.get('/getProducts', getProducts);
router.get('/getProductById/:id', findProductById);
router.get('/filterByPrice', filterByPrice);
router.get('/getNewstProducts', getNewstProducts);
router.get('/productSortedByPrice', productSortedByPrice);

module.exports = router;
