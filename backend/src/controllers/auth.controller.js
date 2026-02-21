const authService = require("../services/auth.service");
const jwt = require("jsonwebtoken");
const userRepo = require("../repositories/user.repository");

const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password, extraData } = req.body;
    const createdBy = req.user?._id || null; // si admin crée admin/seller
    await authService.register({ firstName, lastName, email, phone, password, extraData, createdBy });
    res.status(201).json({ message: "Account created, verify your email to activate your account" });
  } catch (err) {
    if (typeof next === "function") return next(err);
    res.status(err.statusCode || 500).json({ error: err.message || "Server error" });
  }
};

const requestEmailChange = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { newEmail } = req.body;

    await authService.requestEmailChange({ userId, newEmail });
    res.json({ message: "CConfirmation code sent to your old email." });
  } catch (err) {
    if (typeof next === "function") return next(err);
    res.status(err.statusCode || 500).json({ error: err.message || "Server error" });
  }
};

const confirmEmailChange = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { confirmationCode } = req.body;

    await authService.confirmEmailChange({ userId, confirmationCode });
    res.json({ message: "Email updated successfully." });
  } catch (err) {
    if (typeof next === "function") return next(err);
    res.status(err.statusCode || 500).json({ error: err.message || "Server error" });
  }
};

const activateAccount = async (req, res, next) => {
  try {
    await authService.activateAccount(req.params.token);
    res.json({ message: "Account activated !" });
  } catch (err) {
    if (typeof next === "function") return next(err);
    res.status(err.statusCode || 500).json({ error: err.message || "Server error" });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password } );
    res.json(result);
  } catch (err) {
    if (typeof next === "function") return next(err);
    res.status(err.statusCode || 500).json({ error: err.message || "Server error" });
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    await authService.forgotPassword(req.body.email);
    res.json({ message: "Password reset email sent!" });
  } catch (err) {
    if (typeof next === "function") return next(err);
    res.status(err.statusCode || 500).json({ error: err.message || "Server error" });
  }
};

const resetPassword = async (req, res, next) => {
  try {
    await authService.resetPassword(req.params.token, req.body.password);
    res.json({ message: "Password reset successfully!" });
  } catch (err) {
    if (typeof next === "function") return next(err);
    res.status(err.statusCode || 500).json({ error: err.message || "Server error" });
  }
};

const verifyToken = async (req, res, next) => {
  res.json({ message: "Token valide", user: req.user });
};

const getCurrentUser = async (req, res, next) => {
  res.json({ user: req.user });
};

const uploadProfilePicture = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // Store a web path (not local filesystem path) to avoid OS-specific separators issues.
    const filePath = `/uploads/profiles/${req.file.filename}`;
    const updated = await userRepo.updateUser(req.user.id, { profileImage: filePath });

    res.json({ message: "Profile image updated", user: updated });
  } catch (err) {
    if (typeof next === "function") return next(err);
    res.status(err.statusCode || 500).json({ error: err.message || "Erreur serveur" });
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, q = "" } = req.query;

    const users = await userRepo.findAllUsers({ page, limit, q });
    const total = await userRepo.countUsers({ q });

    return res.status(200).json({
      data: users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    return next(err);
  }
};
const changePassword = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { oldPassword, newPassword } = req.body;
    await authService.changePassword({ userId, oldPassword, newPassword });
    res.json({ message: "Password updated successfully." });
  } catch (err) {
    if (typeof next === "function") return next(err);
    res.status(err.statusCode || 500).json({ error: err.message || "Server error" });
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { firstName, lastName, phone } = req.body;
    const updated = await userRepo.updateUser(userId, { firstName, lastName, phone });
    res.json({
      message: "Profile updated successfully.",
      user: {
        id: updated._id,
        firstName: updated.firstName,
        lastName: updated.lastName,
        email: updated.email,
        phone: updated.phone,
        profileImage: updated.profileImage,
        role: updated.role,
      },
    });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ error: "This phone number is already in use" });
    }
    if (typeof next === "function") return next(err);
    res.status(err.statusCode || 500).json({ error: err.message || "Server error" });
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
  uploadProfilePicture,
  getAllUsers,
  changePassword,
  updateProfile,
};
