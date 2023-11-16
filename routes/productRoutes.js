const express = require("express");
const router = express();

const {
  createProduct,
  getAllProducts,
  getAProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { isAuth } = require("../middleware/isAuth");

router.post("/", isAuth, createProduct);
router.get("/", getAllProducts);
router.get("/:id", getAProducts);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
