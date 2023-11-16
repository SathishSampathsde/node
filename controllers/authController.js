const UserModel = require("../models/userModel");
const AppError = require("../utils/appError");
const signJwtToken = require("../utils/signJwtToken");
const sendEmail = require("../utils/email");

exports.signUp = async (req, res, next) => {
  try {
    const newUser = await UserModel.create(req.body);
    const token = signJwtToken(newUser._id);
    res.status(201).json({
      success: true,
      token: token,
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // check email and password was given
    if (!email || !password) {
      return next(
        new AppError("Please provide email and password to login!", 400)
      );
    }

    // user is exist on given mail id
    const user = await UserModel.findOne({ email });

    if (!user) {
      return next(new AppError("Email is incorrect!", 400));
    }

    if (!(await user.comparePassword(password, user.password))) {
      return next(new AppError("Password is incorrect!", 400));
    }

    const token = signJwtToken(user._id);

    res.status(200).json({
      success: true,
      token: token,
    });
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return next(new AppError("Email is incorrect!", 404));
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    await sendEmail({
      to: user.email,
      subject: "Reset your password using given below link!",
      message: resetToken,
      html: `<h1>Hai, ${user.username}</h1>`,
    });

    res.status(200).json({
      success: true,
      resetToken: resetToken,
    });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({
      passwordResetToken: req.params.token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(new AppError("Your token is expired or invalid!", 400));
    }

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    const token = signJwtToken(user._id);

    res.status(200).json({
      success: true,
      token: token,
    });
  } catch (error) {
    next(error);
  }
};
