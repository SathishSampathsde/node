const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required!"],
  },
  price: {
    type: Number,
    required: [true, "Price is required!"],
  },
  description: {
    type: String,
    required: [true, "Description is required!"],
  },
  category: {
    type: String,
    required: [true, "Category is required!"],
  },
  image: {
    type: String,
    required: [true, "Image is required!"],
  },
  createdBy:{
    type:String,
    required: [true, "User is required!"],
  }
});

ProductSchema.set("timestamps", true);

const ProductModel = mongoose.model("products", ProductSchema);

module.exports = ProductModel;
