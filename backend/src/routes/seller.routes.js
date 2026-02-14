const express = require('express');
const { authenticate } = require('../middlewares/auth.middleware');
const router = express.Router();
const { GetSellerOrders } = require("../controllers/order.controller");
const upload = require("../middlewares/upload.middleware");
const validate = require("../middlewares/validate.middleware");
const { productSchema } = require("../validators/product.validator");
const { createProduct, updateProduct, deleteProduct } = require("../controllers/product.controller");

// Seller routes placeholder
router.use(authenticate); // protège toutes les routes du vendeur
router.get('/', (req, res) => res.json({ message: 'Seller API root' }));
router.post('/addProduct',upload.array('images', 5), validate(productSchema ) ,createProduct );
router.put('/editProduct/:id' ,upload.array('images', 5) ,validate(productSchema) ,updateProduct );
router.delete('/deleteProduct/:id' ,deleteProduct );

router.get("/orders/:sellerId", GetSellerOrders); // use req.user.id inside controller/service


module.exports = router;
