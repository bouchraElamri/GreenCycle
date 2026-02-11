const mongoose = require("mongoose");
const categoryRepository = require("../repositories/category.repository");
const Product = require("../models/product.model");

const createHttpError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const createCategory = async (payload) => {
  const name = payload.name?.trim();

  const existing = await categoryRepository.findByName(name);
  if (existing) {
    throw createHttpError("Cette categorie existe deja", 409);
  }

  return categoryRepository.create({
    name,
    description: payload.description || "",
  });
};

const getAllCategories = async (name) => {
  if (name && name.trim()) {
    return categoryRepository.searchByName(escapeRegex(name.trim()));
  }
  return categoryRepository.findAll();
};

const getCategoryById = async (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw createHttpError("ID categorie invalide", 400);
  }

  const category = await categoryRepository.findById(id);
  if (!category) {
    throw createHttpError("Categorie introuvable", 404);
  }

  return category;
};

const updateCategory = async (id, payload) => {
  if (!mongoose.isValidObjectId(id)) {
    throw createHttpError("ID categorie invalide", 400);
  }

  const category = await categoryRepository.findById(id);
  if (!category) {
    throw createHttpError("Categorie introuvable", 404);
  }

  if (payload.name) {
    const name = payload.name.trim();
    const existing = await categoryRepository.findByName(name);

    if (existing && existing._id.toString() !== id) {
      throw createHttpError("Une autre categorie porte deja ce nom", 409);
    }

    payload.name = name;
  }

  const updated = await categoryRepository.updateById(id, payload);
  return updated;
};

const deleteCategory = async (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw createHttpError("ID categorie invalide", 400);
  }

  const category = await categoryRepository.findById(id);
  if (!category) {
    throw createHttpError("Categorie introuvable", 404);
  }

  const linkedProductsCount = await Product.countDocuments({ category: id });
  if (linkedProductsCount > 0) {
    throw createHttpError(
      "Suppression impossible: des produits sont associes a cette categorie",
      409
    );
  }

  await categoryRepository.deleteById(id);

  return { message: "Categorie supprimee avec succes" };
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
