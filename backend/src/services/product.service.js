const productRepo = require("../repositories/product.repository");
const categoryModel = require("../models/category.model");
const { default: mongoose } = require("mongoose");

const getAllProducts = (name) => {
  if (name) 
    return productRepo.searchByName(name); 
  return productRepo.findAll()
};

const getProductById =(id) => productRepo.findById(id);

const deleteProduct = (id) => productRepo.deleteProduct(id);

const createProduct = async (data) => {
    
    if (!mongoose.Types.ObjectId.isValid(data.category)){
        const error = new Error ("the category must be a valid one.");
        error.status = 400;
        throw error;
    }
    const category = await categoryModel.findById(data.category);
    if(!category){
        new Error ("choose an existing category.");
        error.status = 400;
        throw error;
    }
    return productRepo.createProduct(data);
};

const updateProduct = async (id, data) => {
  // Vérifier la catégorie si elle est modifiée
  if (data.category) {
      if (!mongoose.Types.ObjectId.isValid(data.category)) {
    const error = new Error("the specified category is not valid.");
    error.status = 400;
    throw error;
  }
    const category = await categoryModel.findById(data.category);
    if (!category) {
      const error = new Error("the specified category does not exist");
      error.status = 400;
      throw error;
    }
  }

  return productRepo.updateProduct(id, data);
};

const filterByPrice = async (minP, maxP) => productRepo.filterByPrice(minP, maxP);

const getNewstProducts = async () => productRepo.getNewstProducts();

const productSortedByPrice = async (order) => productRepo.productSortedByPrice(order);

const searchByCategory = async (categoryName) => productRepo.searchByCategory(categoryName);

module.exports = { 
  getAllProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  filterByPrice , 
  deleteProduct , 
  getNewstProducts , 
  productSortedByPrice, 
  searchByCategory,
};