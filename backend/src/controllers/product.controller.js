const productServ = require("../services/product.service");
const sellerRepo = require("../repositories/seller.repository");
const sellerModule = require("../models/seller.model");
const userModel = require("../models/user.model");
const sendEmail = require("../utils/email");

const formatPrice = (value) => Number(value || 0).toFixed(2);

const getSellerContact = async (sellerId) => {
  if (!sellerId) return null;
  const seller = await sellerModule
    .findById(sellerId)
    .populate("userId", "firstName lastName email")
    .lean();
  if (!seller?.userId?.email) return null;
  return {
    fullName: `${seller.userId.firstName || ""} ${seller.userId.lastName || ""}`.trim(),
    email: seller.userId.email,
  };
};

const sendApprovalEmailToSeller = async (sellerContact, product) => {
  if (!sellerContact?.email) return;

  const lines = [
    `Hello ${sellerContact.fullName || "Seller"},`,
    "",
    "Good news: your product has been approved by the GreenCycle admin team and is now available on the platform.",
    "",
    "Approved product details:",
    `- Product name: ${product?.name || "-"}`,
    `- Category: ${product?.category?.name || "-"}`,
    `- Price: ${formatPrice(product?.price)} DH`,
    `- Quantity: ${product?.quantity ?? "-"}`,
    `- Description: ${product?.description || "-"}`,
    "",
    "You can now manage this product from your seller space.",
    "",
    "GreenCycle Team",
  ];

  await sendEmail(
    sellerContact.email,
    "Product approved and published on GreenCycle",
    lines.join("\n")
  );
};

const sendRejectionEmailToSeller = async (sellerContact, product) => {
  if (!sellerContact?.email) return;

  const lines = [
    `Hello ${sellerContact.fullName || "Seller"},`,
    "",
    "Your product submission was reviewed by our admin team and was not accepted at this stage.",
    "",
    "Product details:",
    `- Product name: ${product?.name || "-"}`,
    `- Category: ${product?.category?.name || "-"}`,
    `- Price: ${formatPrice(product?.price)} DH`,
    `- Quantity: ${product?.quantity ?? "-"}`,
    `- Description: ${product?.description || "-"}`,
    "",
    "Reason: the product does not currently meet GreenCycle publication requirements.",
    "Please review your product information and submit an updated version.",
    "",
    "GreenCycle Team",
  ];

  await sendEmail(
    sellerContact.email,
    "Product not approved on GreenCycle",
    lines.join("\n")
  );
};

const getProducts = async (req, res, next)=>{
    try{
    const products = await productServ.getAllProducts(req.query.name);
    res.status(200).json(products);
    }
    catch(error){
        next(error);
    }
} 
const createProduct = async (req, res, next) => {
  try {
    const images = (req.files || []).map(
      (file) => `/uploads/products/${file.filename}`
    );

    // Ensure user has a seller profile
    const sellerProfile = await sellerRepo.findByUserId(req.user.id);
    if (!sellerProfile) {
      return res.status(403).json({ message: "User is not a seller" });
    }

    const product = await productServ.createProduct({
      ...req.body,
      seller: sellerProfile._id,
      images,
    });

    return res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

const findProductById = async (req, res, next) => {
    try{
        const product = await productServ.getProductById(req.params.id);
        res.status(200).json(product);
    }
    catch(error){
        next(error);
    }
};

const deleteProduct = async (req, res, next) => {
    try{
    // Authorization: ensure the requester owns the product
    const product = await productServ.getProductById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    const adminUser = await userModel.findById(req.user.id);
    const adminRoles = Array.isArray(adminUser?.role) ? adminUser.role : [adminUser?.role];
    const isAdminUser = adminRoles.map((r) => String(r).toLowerCase()).includes("admin");
    if (adminUser && isAdminUser) {
      const sellerContact = await getSellerContact(product.seller);
      if (sellerContact) {
        await sendRejectionEmailToSeller(sellerContact, product).catch((err) => {
          console.warn("Failed to send product rejection email:", err?.message);
        });
      }
      await productServ.deleteProduct(req.params.id);
      return res.status(204).send();
    }
    const sellerProfile = await sellerRepo.findByUserId(req.user.id);
    if (!sellerProfile) return res.status(403).json({ message: "User is not a seller" });

    if (!product.seller) {
      console.error('Product has no seller field:', req.params.id);
      return res.status(400).json({ message: "Product seller not set" });
    }

    if (String(product.seller) !== String(sellerProfile._id)) {
      return res.status(403).json({ message: "Not authorized to delete this product" });
    }

    await productServ.deleteProduct(req.params.id);
    res.status(204).send();
    } 
    catch(error){
        next(error);
    }
}

const updateProduct = async (req, res, next) => {
  try {
    const newImages = (req.files || []).map(
      (file) => `/uploads/products/${file.filename}`
    );

    const data = { ...(req.body || {}) };
    if (newImages.length) data.images = newImages;

      // Authorization: ensure the requester owns the product
      const productBefore = await productServ.getProductById(req.params.id);
      if (!productBefore) return res.status(404).json({ message: "Product not found" });
      const sellerProfile = await sellerModule.findOne({ userId: req.user.id });
      if (!sellerProfile) return res.status(403).json({ message: "User is not a seller" });
      if (!productBefore.seller) {
        console.error('Product before update has no seller field:', req.params.id);
        return res.status(400).json({ message: 'Product seller not set' });
      }

      if (String(productBefore.seller) !== String(sellerProfile._id)) {
        return res.status(403).json({ message: "Not authorized to edit this product" });
      }

      // Prevent sellers from changing approval status. Only admins may approve products.
      if (Object.prototype.hasOwnProperty.call(data, 'isApproved')) {
        return res.status(403).json({ message: 'Only admins can change product approval status' });
      }

      const product = await productServ.updateProduct(req.params.id, data);
      res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// Admin-only: approve or unapprove a product
const approveProduct = async (req, res, next) => {
  try {
    const { isApproved } = req.body;

    if (typeof isApproved !== 'boolean') {
      return res.status(400).json({ message: 'isApproved must be a boolean' });
    }

    const product = await productServ.updateProduct(req.params.id, { isApproved });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (isApproved) {
      const fullProduct = await productServ.getProductById(req.params.id);
      const sellerContact = await getSellerContact(fullProduct?.seller);
      if (sellerContact) {
        await sendApprovalEmailToSeller(sellerContact, fullProduct).catch((err) => {
          console.warn("Failed to send product approval email:", err?.message);
        });
      }
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

const searchByCategory = async (req, res, next) => {
  try {
    if(req.body){
      const products = await productServ.searchByCategory(req.body.categoryName);
      return res.status(200).json(products);
    }
    const products = await productServ.searchByCategory(req.query.categoryName);
    res.status(200).json(products);
  }
  catch(error){
    next(error);
  }
};

const getCurrentSellerProducts = async (req, res, next) => {
  try {
    const sellerProfile = await sellerRepo.findByUserId(req.user.id);
    if (!sellerProfile) {
      return res.status(403).json({ message: "User is not a seller" });
    }
    const products = await productServ.getSellerProductsAll(sellerProfile._id);
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts, 
  createProduct, 
  findProductById, 
  updateProduct , 
  approveProduct,
  deleteProduct ,  
  searchByCategory,
  getCurrentSellerProducts,
};
