const Product = require("../models/product.model.js");
const categoryModel = require("../models/category.model");

const findAll = () => Product.find()

const findById = (id) => Product.findById(id).populate("category").populate({
      path: "comments.client",
      select: "profileUrl userId",
      populate: {
        path: "userId",
        select: "firstName lastName profileImage",
      },
    });
const createProduct = (data) => new Product(data).save();

const updateProduct = (id, data) => Product.findByIdAndUpdate(id, data, { new: true , runValidators: true });

const deleteProduct = (id) => Product.findByIdAndDelete(id);


const searchByName = (name) =>
  Product.find({
    name: { $regex: name, $options: "i" },

  }).sort({ createdAt: -1 });

const countByFilter = (filter = {}) => Product.countDocuments(filter);

const findSellerProducts = (sellerId, type = "remaining") => {
    const filter = {
        seller: sellerId,
        isApproved: true,
    };

    if (type === "remaining") {
        filter.isAvailable = true;
    } else if (type === "sold") {
        filter.isAvailable = false;
    }

    return Product.find(filter).sort({ createdAt: -1 });
};



module.exports = { 
    findAll, 
    findById, 
    createProduct, 
    updateProduct, 
    deleteProduct , 
    searchByName, 
    countByFilter,
    findSellerProducts,
};
