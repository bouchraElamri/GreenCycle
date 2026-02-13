const Product = require("../models/product.model.js");

const findAll = () => Product.find().populate("category");

const findById = (id) => Product.findById(id).populate("category");

const createProduct = (data) => new Product(data).save();

const updateProduct = (id, data) => Product.findByIdAndUpdate(id, data, { new: true });

const deleteProduct = (id) => Product.findByIdAndDelete(id);

const filterByPrice = async (minP, maxP) => {
    try{
        const min = minP !== undefined ? Number(minP) : 0;
        const max = maxP !== undefined ? Number(maxP) : Number.MAX_SAFE_INTEGER;

        const result = await  Product.find({ 
            price:{ $gte : min , $lte : max } 
        })
        return result;
    }
    catch(error){
        return error; 
    }
};

const getNewstProducts = async () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate( oneWeekAgo.getDate() - 7 );
    const products = await Product.find({
        createdAt : { $gte: oneWeekAgo }
    }).sort({ createdAt: -1 });
    return products;
};

const productSortedByPrice = async (order) => {
    let sortOrder ;
    if(order === "asc"){
        sortOrder = 1;
    }
    else if(order === "desc"){
        sortOrder = -1;
    }
    const products = await Product.find().sort({ price : sortOrder});
    return products;

};



module.exports = { findAll, findById, createProduct, updateProduct, deleteProduct , filterByPrice , getNewstProducts , productSortedByPrice};
