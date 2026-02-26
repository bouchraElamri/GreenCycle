const express = require('express');
const {updateProductSchema } = require('../validators/updateProduct.validator');
const { GetSellerOrders } = require("../controllers/order.controller");
const upload = require("../middlewares/upload.middleware");
const validate = require("../middlewares/validate.middleware");
const { productSchema } = require("../validators/product.validator");
const { createProduct, updateProduct, deleteProduct, getCurrentSellerProducts } = require("../controllers/product.controller");
const sellerController = require("../controllers/seller.controller");

const { authenticate } = require('../middlewares/auth.middleware');
const router = express.Router();
// Seller routes placeholder
router.use(authenticate); // protège toutes les routes du vendeur
router.get('/', (req, res) => res.json({ message: 'Seller API root' }));
router.get('/profile', sellerController.getProfile);
router.get('/products', getCurrentSellerProducts);
router.post('/addProduct',upload.array('images', 5), validate(productSchema ) ,createProduct );

// Reject attempts to set `isApproved` from seller endpoints (multer has populated req.body at this point)
const forbidIsApprovedField = (req, res, next) => {
	if (req.body && Object.prototype.hasOwnProperty.call(req.body, 'isApproved')) {
		return res.status(403).json({ message: 'Only admins can change product approval status' });
	}
	next();
};

router.patch('/editProduct/:id', upload.array('images', 5), forbidIsApprovedField, validate(updateProductSchema), updateProduct );
router.delete('/deleteProduct/:id' ,deleteProduct );

router.get("/orders/:sellerId", GetSellerOrders);


module.exports = router;
