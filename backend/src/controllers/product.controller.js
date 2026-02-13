const productServ = require("../services/product.service");

const getProducts = async (req, res, next)=>{
    try{
    const products = await productServ.getAllProducts();
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

    const product = await productServ.createProduct({
      ...req.body,
      seller: req.user.id ,
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

module.exports = {getProducts, createProduct, findProductById, updateProduct , filterByPrice , deleteProduct , getNewstProducts , productSortedByPrice};