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

const requestEmailChange = async ({ userId, newEmail }) => {
  if (!userId) throw new Error("Unauthorized");

  const user = await userRepo.findById(userId);
  if (!user) throw new Error("User not found");

  const normalizedNewEmail = String(newEmail || "").trim().toLowerCase();
  const normalizedCurrentEmail = String(user.email || "").trim().toLowerCase();

  if (!normalizedNewEmail) throw new Error("New email is required");
  if (normalizedNewEmail === normalizedCurrentEmail) {
    throw new Error("New email must be different from current email");
  }

  const existing = await userRepo.findByEmail(normalizedNewEmail);
  if (existing && existing._id.toString() !== user._id.toString()) {
    throw new Error("Email already in use");
  }

  const code = crypto.randomInt(100000, 1000000).toString();
  const codeHash = crypto.createHash("sha256").update(code).digest("hex");

  user.emailChangeCodeHash = codeHash;
  user.emailChangeNewEmail = normalizedNewEmail;
  user.emailChangeExpires = Date.now() + 15 * 60 * 1000;
  user.emailChangeAttempts = 0;
  await user.save();

  try {
    await sendEmail(
      user.email,
      "Email change confirmation code",
      `You requested to change your email to ${normalizedNewEmail}. Your confirmation code is: ${code}. This code expires in 15 minutes.`
    );
  } catch (err) {
    user.emailChangeCodeHash = undefined;
    user.emailChangeNewEmail = undefined;
    user.emailChangeExpires = undefined;
    user.emailChangeAttempts = 0;
    await user.save();
    throw new Error("Failed to send confirmation email");
  }
};

const confirmEmailChange = async ({ userId, confirmationCode }) => {
  if (!userId) throw new Error("Unauthorized");

  const user = await userRepo.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  if (!user.emailChangeCodeHash || !user.emailChangeNewEmail || !user.emailChangeExpires) {
    throw new Error("No email change request found");
  }

  if (user.emailChangeExpires.getTime() < Date.now()) {
    user.emailChangeCodeHash = undefined;
    user.emailChangeNewEmail = undefined;
    user.emailChangeExpires = undefined;
    user.emailChangeAttempts = 0;
    await user.save();
    throw new Error("Confirmation code expired");
  }

  const maxAttempts = 5;
  if ((user.emailChangeAttempts || 0) >= maxAttempts) {
    throw new Error("Too many invalid attempts. Please request a new code.");
  }

  const normalizedCode = String(confirmationCode || "").trim();
  const confirmationCodeHash = crypto.createHash("sha256").update(normalizedCode).digest("hex");

  if (confirmationCodeHash !== user.emailChangeCodeHash) {
    user.emailChangeAttempts = (user.emailChangeAttempts || 0) + 1;
    await user.save();
    throw new Error("Invalid confirmation code");
  }

  const newEmail = String(user.emailChangeNewEmail).trim().toLowerCase();
  const existing = await userRepo.findByEmail(newEmail);
  if (existing && existing._id.toString() !== user._id.toString()) {
    throw new Error("Email already in use");
  }

  user.email = newEmail;
  user.emailChangeCodeHash = undefined;
  user.emailChangeNewEmail = undefined;
  user.emailChangeExpires = undefined;
  user.emailChangeAttempts = 0;
  await user.save();
};

const changePassword = async ({ userId, oldPassword, newPassword }) => {
  if (!userId) throw new Error("Unauthorized");

  const user = await userRepo.findById(userId);
  if (!user) throw new Error("User not found");

  const isOldPasswordValid = await user.comparePassword(oldPassword);
  if (!isOldPasswordValid) throw new Error("Incorrect current password");

  const isSamePassword = await user.comparePassword(newPassword);
  if (isSamePassword) throw new Error("New password must be different from current password");

  user.password = newPassword;
  await user.save();
};

module.exports = {
  register,
  activateAccount,
  login,
  forgotPassword,
  resetPassword,
  requestEmailChange,
  confirmEmailChange,
  changePassword,
};
