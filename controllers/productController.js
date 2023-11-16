const ProductModel = require("../models/productModel");
const AppError = require("../utils/appError");

exports.createProduct = async (req, res, next) => {
  try {
    const newProduct = await ProductModel.create({
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      category: req.body.category,
      image: req.body.image,
      createdBy:req.user
    });
    res.status(201).json({
      success: true,
      data: newProduct,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await ProductModel.find();
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAProducts = async (req, res, next) => {
  try {
    const product = await ProductModel.findById(req.params.id);

    if (!product) {
      return next(new AppError("Product was not found!", 404));
    }
    
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await ProductModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!product) {
      return next(new AppError("Product was not found!", 404));
    }
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await ProductModel.findByIdAndDelete(req.params.id);
    if (!product) {
      return next(new AppError("Product was not found!", 404));
    }
    res.status(202).json({
      success: true,
      message: "Product was deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};
