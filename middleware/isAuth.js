const UserModel = require("../models/userModel");
const AppError = require("../utils/appError");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");

exports.isAuth = async (req, res, next) => {
  try {
    if (
      !(
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      )
    ) {
      return next(new AppError("Please login or signup!", 401));
    }

    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return next(new AppError("Please login or signup!", 401));
    }

    // decoded token
    const decoded = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET_KEY
    );

    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return next(new AppError("User is doesn't exist on give token!", 401));
    }

    if (user.userUpdatedAt(decoded.iat)) {
      return next(
        new AppError(
          "User recently changed your details! Please log in again.",
          401
        )
      );
    }
    req.user = user._id;
    next();
  } catch (error) {
    next(error);
  }
};
