const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userRepo = require("../repositories/user.repository");
const sendEmail = require("../utils/email");
const User = require("../models/user.model");
const Client = require("../models/client.model");

const register = async ({ firstName, lastName, email, password, phone, extraData, createdBy }) => {
  const existing = await userRepo.findByEmail(email);
  if (existing) throw new Error("Email already in use");

  const phoneExisting = await User.findOne({ phone });
  if (phoneExisting) throw new Error("This phone number is already in use");

  const activationToken = crypto.randomBytes(32).toString("hex");

  const user = await userRepo.createUser({
    firstName,
    lastName,
    email,
    phone,
    password,
    activationToken,
    createdBy: createdBy || null,
  });

  try {
    await Client.create({
      userId: user._id,
      addresses: Array.isArray(extraData?.addresses) ? extraData.addresses : [],
    });
  } catch (err) {
    console.error("Client creation failed:", err.message);
    throw new Error(`Failed to create client profile: ${err.message}`);
  }

  const activationLink = `${process.env.FRONTEND_URL}/activate/${activationToken}`;
  try {
    await sendEmail(email, "Account activation", `Click here to activate : ${activationLink}`);
  } catch (err) {
    console.warn("Email sending failed:", err.message);
    // Continue registration even if email fails
  }

  return user;
};

const activateAccount = async (token) => {
  const user = await User.findOne({ activationToken: token });
  if (!user) {
    const alreadyActivated = await User.findOne({
      activationToken: null,
      isActive: true,
    });

    if (alreadyActivated) {
      return;
    }

    throw new Error("Invalid or expired token");
  }

  user.isActive = true;
  user.activationToken = null;
  await user.save();
};

const login = async ({ email, password }) => {
  const user = await userRepo.findByEmail(email);
  if (!user) throw new Error("User not found");
  if (!user.isActive) throw new Error("Account not activated");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error("Incorrect password");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
  return { token, user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role } };
};

const forgotPassword = async (email) => {
  const user = await userRepo.findByEmail(email);
  if (!user) throw new Error("User not found");

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600 * 1000;
  await user.save();

  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  await sendEmail(email, "Password reset", `Click here to reset your password : ${resetLink}`);
};

const resetPassword = async (token, newPassword) => {
  const user = await userRepo.findByResetToken(token);
  if (!user) throw new Error("Invalid or expired token");
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
};

module.exports = {
  register,
  activateAccount,
  login,
  forgotPassword,
  resetPassword,
};
