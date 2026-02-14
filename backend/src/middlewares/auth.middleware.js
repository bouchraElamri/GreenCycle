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
  const roles = Array.isArray(req.user.role) ? req.user.role : [req.user.role];
  if (!roles.includes("admin")) {
    return res.status(403).json({ error: "Denied Access" });
  }
  next();
};

module.exports = { authenticate, isAdmin };
