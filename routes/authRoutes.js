const express = require("express");
const router = express();

const {
  signUp,
  login,
  forgotPassword,
  resetPassword
} = require("../controllers/authController");

router.post("/signup", signUp);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);

module.exports = router;
