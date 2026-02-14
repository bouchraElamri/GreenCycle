const Category = require("../models/category.model");

const create = (payload) => Category.create(payload);

const findAll = () => Category.find().sort({ createdAt: -1 });
const searchByName = (name) =>
  Category.find({
    name: { $regex: name, $options: "i" },
  }).sort({ createdAt: -1 });

const findById = (id) => Category.findById(id);

const findByName = (name) => Category.findOne({ name });

const updateById = (id, payload) =>
  Category.findByIdAndUpdate(id, payload, { new: true, runValidators: true });

const deleteById = (id) => Category.findByIdAndDelete(id);

module.exports = {
  create,
  findAll,
  searchByName,
  findById,
  findByName,
  updateById,
  deleteById,
};
