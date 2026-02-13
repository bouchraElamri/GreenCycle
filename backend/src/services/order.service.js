const orderRepo = require('../repositories/order.repository');
const Product = require("../models/product.model");

const createOrder = async ({ userId, items, deliveryAddress }) => {
    if (!userId){
        const error = new Error("Unauthorized");
        error.statusCode = 401;
        throw error;
    }

    if(!Array.isArray(items) || items.length === 0){
        const error = new Error("Invalid items");
        error.statusCode = 400;
        throw error;
    }

    if (!deliveryAddress || typeof deliveryAddress !== 'string') {
        const error = new Error("Invalid delivery address");
        error.statusCode = 400;
        throw error;
    }

    let totalPrice = 0;
    const orderItems = [];


    for (const item of items) {

        // Fetch real product from DB
        const product = await Product.findById(item.product);

        if (!product) {
            const err = new Error("Product not found");
            err.statusCode = 404;
            throw err;
        }
        if (!item.quantity || item.quantity < 1 || item.quantity > product.quantity) {
            const err = new Error("Invalid quantity for product: " + product.name);
            err.statusCode = 400;
            throw err;
        }

        const subtotal = product.price * item.quantity;
        totalPrice += subtotal;

        orderItems.push({
            product: product._id,
            seller: product.seller,
            name: product.name,
            price: product.price,
            quantity: item.quantity,
        });
    }

    const created = await orderRepo.create({
        user: userId,
        items: orderItems,
        deliveryAddress,
        totalPrice,
        status: "confirmed",
    });

    return created;
    
};

const getClientOrders = async ({ userId }) => {
  // userId validation is done by Joi, so here we focus on logic
  console.log("Fetching orders for userId:", userId);
  return orderRepo.findMyOrders(userId);
};

const getSellerOrders = async ({ userId }) => {
  console.log("Fetching orders for seller userId:", userId);
  return orderRepo.findBySellerUser(userId);
};

if (!getClientOrders || !getSellerOrders) {
  throw new Error("Required order service functions are missing");
}

module.exports = { createOrder, getClientOrders, getSellerOrders };