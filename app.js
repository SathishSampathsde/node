const express = require("express");
const app = express();
const cors = require("cors");

const globalError = require("./controllers/errorController");

const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");

// middleware
app.use(express.json());
app.use(cors());

// all routes
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/auth", authRoutes);

// unhandled routes
app.all("*", (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `can't find any path:${req.originalUrl} on this server!`,
  });
});

// global error handler
app.use(globalError);

module.exports = app;
