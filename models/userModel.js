const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "Username is required!"],
  },
  phone: {
    type: Number,
    unique: true,
    required: [true, "Phone is required!"],
    minlength: [10, "Please enter valid phone number!"],
    maxlength: [10, "Please enter valid phone number!"],
    validate: {
      validator: function (phone) {
        const regex = /^[0-9]*$/;
        return regex.test(phone);
      },
      message: "Please enter valid phone number!",
    },
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, "Email is required!"],
    validate: [validator.isEmail, "Please enter valid email!"],
  },
  password: {
    type: String,
    required: [true, "Password is required!"],
    validate: {
      validator: function (password) {
        const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
        return regex.test(password);
      },
      message:
        "Password must be contain uppercase,special characters and numbers!",
    },
  },
  confirmPassword: {
    type: String,
    required: [true, "Confirm password is required!"],
    validate: {
      validator: function (confirmPassword) {
        return confirmPassword === this.password;
      },
      message: "Confirm password doesn't match with password!",
    },
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
});

UserSchema.set("timestamps", true);

UserSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
});

UserSchema.methods.comparePassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

UserSchema.methods.userUpdatedAt = function (jwtTimeStamp) {
  const updatedAt = new Date(this.updatedAt).getTime() / 1000;
  return updatedAt > jwtTimeStamp;
};

UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetToken = hashedToken;

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return hashedToken;
};

const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;
