const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const userRepo = require("../repositories/user.repository");
const sendEmail = require("../utils/email");
const User = require("../models/user.model");
const Client = require("../models/client.model");
const Seller = require("../models/seller.model");
const Admin = require("../models/admin.model");

 const register = async ({ firstName, lastName, email, password, phone, role, extraData, createdBy }) => {
  const existing = await userRepo.findByEmail(email);
  if (existing) throw new Error("Email déjà utilisé");

  const phoneExisting = await User.findOne({ phone });
  if (phoneExisting) throw new Error("Ce numéro de téléphone est déjà utilisé");

  const activationToken = crypto.randomBytes(32).toString("hex");

  // Ensure role is stored as an array in the model
  const roles = [role];

  const user = await userRepo.createUser({
    firstName,
    lastName,
    email,
    phone,
    password,
    role: roles,
    activationToken,
    createdBy: createdBy || null,
  });

  // Création du document spécifique selon le rôle
  if (role === "client") {
    await Client.create({ userId: user._id, addresses: extraData?.addresses || [] });
  } else if (role === "seller") {
    await Seller.create({
      userId: user._id,
      description: extraData?.description || "",
      address: extraData?.address || {},
    });
  } else if (role === "admin") {
    await Admin.create({
      userId: user._id,
      permissions: extraData?.permissions || [],
    });
  }

  // Envoi email activation
  const activationLink = `${process.env.FRONTEND_URL}/activate/${activationToken}`;
  await sendEmail(email, "Activation du compte", `Cliquez ici pour activer : ${activationLink}`);

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

    throw new Error("Token invalide ou expiré");
  }

  user.isActive = true;
  user.activationToken = null;
  await user.save();
};


const login = async ({ email, password }) => {
  const user = await userRepo.findByEmail(email);
  if (!user) throw new Error("Utilisateur non trouvé");
  if (!user.isActive) throw new Error("Compte non activé");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error("Mot de passe incorrect");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
  return { token, user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role } };
};

const forgotPassword = async (email) => {
  const user = await userRepo.findByEmail(email);
  if (!user) throw new Error("Utilisateur non trouvé");

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600 * 1000; // 1h
  await user.save();

  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  await sendEmail(email, "Réinitialisation mot de passe", `Cliquez ici pour réinitialiser : ${resetLink}`);
};

const resetPassword = async (token, newPassword) => {
  const user = await userRepo.findByResetToken(token);
  if (!user) throw new Error("Token invalide ou expiré");
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
