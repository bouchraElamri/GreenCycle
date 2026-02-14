const productServ = require("../services/product.service");
const sellerRepo = require("../repositories/seller.repository");

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

    const sellerProfile = await sellerRepo.findByUserId(req.user.id);
    if (!sellerProfile) return res.status(403).json({ message: "User is not a seller" });

    if (product.seller.toString() !== sellerProfile._id.toString()) {
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

      const sellerProfile = await sellerRepo.findByUserId(req.user.id);
      if (!sellerProfile) return res.status(403).json({ message: "User is not a seller" });

      if (productBefore.seller.toString() !== sellerProfile._id.toString()) {
        return res.status(403).json({ message: "Not authorized to edit this product" });
      }

      const product = await productServ.updateProduct(req.params.id, data);
      res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};
const filterByPrice = async (req , res , next ) => {
  try{
    const {minP , maxP}= req.body;
    const products = await productServ.filterByPrice(minP , maxP);
    res.status(200).json(products);
  }
  catch (error){
    next(error);
  }
};

const getNewstProducts = async (req, res, next) => {
  try{
    const products = await productServ.getNewstProducts();
    res.status(200).json(products);
  }
  catch (error){
    next(error);
  }
}

const productSortedByPrice = async (req, res, next)=> {
  try{
    const products = await productServ.productSortedByPrice(req.body.order);
    res.status(200).json(products);
  }
  catch(error){
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

module.exports = {
  getProducts, 
  createProduct, 
  findProductById, 
  updateProduct , 
  filterByPrice , 
  deleteProduct , 
  getNewstProducts , 
  productSortedByPrice, 
  searchByCategory,
};