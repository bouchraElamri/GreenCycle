const authService = require("../services/auth.service");
const jwt = require("jsonwebtoken");
const userRepo = require("../repositories/user.repository");

const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password, extraData } = req.body;
    const createdBy = req.user?._id || null; // si admin crée admin/seller
    await authService.register({ firstName, lastName, email, phone, password, extraData, createdBy });
    res.status(201).json({ message: "Compte créé. Vérifiez votre email pour l'activation." });
  } catch (err) {
    if (typeof next === "function") return next(err);
    res.status(err.statusCode || 500).json({ error: err.message || "Erreur serveur" });
  }
};

const requestEmailChange = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { newEmail } = req.body;

    await authService.requestEmailChange({ userId, newEmail });
    res.json({ message: "Code de confirmation envoyé à votre ancien email." });
  } catch (err) {
    if (typeof next === "function") return next(err);
    res.status(err.statusCode || 500).json({ error: err.message || "Erreur serveur" });
  }
};

const confirmEmailChange = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { confirmationCode } = req.body;

    await authService.confirmEmailChange({ userId, confirmationCode });
    res.json({ message: "Email mis a jour avec succes." });
  } catch (err) {
    if (typeof next === "function") return next(err);
    res.status(err.statusCode || 500).json({ error: err.message || "Erreur serveur" });
  }
};

const activateAccount = async (req, res, next) => {
  try {
    await authService.activateAccount(req.params.token);
    res.json({ message: "Compte activé !" });
  } catch (err) {
    if (typeof next === "function") return next(err);
    res.status(err.statusCode || 500).json({ error: err.message || "Erreur serveur" });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password } );
    res.json(result);
  } catch (err) {
    if (typeof next === "function") return next(err);
    res.status(err.statusCode || 500).json({ error: err.message || "Erreur serveur" });
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    await authService.forgotPassword(req.body.email);
    res.json({ message: "Email de réinitialisation envoyé !" });
  } catch (err) {
    if (typeof next === "function") return next(err);
    res.status(err.statusCode || 500).json({ error: err.message || "Erreur serveur" });
  }
};

const resetPassword = async (req, res, next) => {
  try {
    await authService.resetPassword(req.params.token, req.body.password);
    res.json({ message: "Mot de passe réinitialisé !" });
  } catch (err) {
    if (typeof next === "function") return next(err);
    res.status(err.statusCode || 500).json({ error: err.message || "Erreur serveur" });
  }
};

const verifyToken = async (req, res, next) => {
  res.json({ message: "Token valide", user: req.user });
};

const getCurrentUser = async (req, res, next) => {
  res.json({ user: req.user });
};

const changePassword = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { oldPassword, newPassword } = req.body;
    await authService.changePassword({ userId, oldPassword, newPassword });
    res.json({ message: "Mot de passe mis a jour avec succes." });
  } catch (err) {
    if (typeof next === "function") return next(err);
    res.status(err.statusCode || 500).json({ error: err.message || "Erreur serveur" });
  }
};

module.exports = {
  register,
  requestEmailChange,
  confirmEmailChange,
  activateAccount,
  login,
  forgotPassword,
  resetPassword,
  verifyToken,
  getCurrentUser,
  changePassword,
};
