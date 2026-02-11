const categoryService = require("../services/category.service");

const createCategory = async (req, res, next) => {
  try {
    const category = await categoryService.createCategory(req.body);
    return res.status(201).json(category);
  } catch (err) {
    return next(err);
  }
};

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getAllCategories();
    return res.status(200).json(categories);
  } catch (err) {
    return next(err);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    return res.status(200).json(category);
  } catch (err) {
    return next(err);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    return res.status(200).json(category);
  } catch (err) {
    return next(err);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const result = await categoryService.deleteCategory(req.params.id);
    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
