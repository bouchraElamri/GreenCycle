const jwt = require("jsonwebtoken");
const userRepo = require("../repositories/user.repository");

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userRepo.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });
    req.user = { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role };
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

const isAdmin = (req, res, next) => {
  const roles = req.user?.role;

  if (!Array.isArray(roles) || !roles.includes("admin")) {
    return res.status(403).json({ error: "Denied Access" });
  }

  next();
};

const isSeller = async (req, res, next) => {
  // Prefer reading roles from the authenticated request (set by authenticate middleware)
  const roles = req.user?.role;

  if (Array.isArray(roles) && roles.includes("seller")) {
    return next();
  }

  // Fallback: fetch fresh user from DB in case req.user is stale
  try {
    const user = await userRepo.findById(req.user?.id);
    if (user && Array.isArray(user.role) && user.role.includes("seller")) {
      return next();
    }
  } catch (err) {
    // ignore DB error and fall through to deny access
  }

  return res.status(403).json({ error: "Denied Access: sellers only" });
};

module.exports = { authenticate, isAdmin, isSeller };
