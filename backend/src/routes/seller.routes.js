const express = require('express');
const { createProduct , updateProduct , deleteProduct } = require('../controllers/product.controller');
const upload = require('../middlewares/upload.middleware');
const {productSchema } = require('../validators/product.validator');
const {updateProductSchema } = require('../validators/updateProduct.validator');
const validate = require('../middlewares/validate.middleware');

const { authenticate } = require('../middlewares/auth.middleware');
const router = express.Router();


// Seller routes placeholder
router.use(authenticate); // protège toutes les routes du vendeur
router.get('/', (req, res) => res.json({ message: 'Seller API root' }));
router.post('/addProduct',upload.array('images', 5), validate(productSchema ) ,createProduct );

// Reject attempts to set `isApproved` from seller endpoints (multer has populated req.body at this point)
const forbidIsApprovedField = (req, res, next) => {
	if (req.body && Object.prototype.hasOwnProperty.call(req.body, 'isApproved')) {
		return res.status(403).json({ message: 'Only admins can change product approval status' });
	}
	next();
};

router.put('/editProduct/:id', upload.array('images', 5), forbidIsApprovedField, validate(updateProductSchema), updateProduct );
router.delete('/deleteProduct/:id' ,deleteProduct );


module.exports = router;