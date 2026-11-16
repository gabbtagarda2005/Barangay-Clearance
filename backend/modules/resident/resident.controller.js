const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./resident.model");

const ALLOWED_ROLES = ["RESIDENT", "STAFF", "ADMIN", "POLICE", "SYSADMIN"];

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;

    if (!isNonEmptyString(name) || !isNonEmptyString(email) || !isNonEmptyString(password)) {
      return res.status(400).json("Name, email, and password are required");
    }

    if (role && !ALLOWED_ROLES.includes(role)) {
      return res.status(400).json("Invalid role");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) return res.status(400).json("Email already exists");

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashed,
      role,
    });

    const safeUser = user.toObject();
    delete safeUser.password;

    return res.json(safeUser);
  } catch (error) {
    return res.status(500).json("Server error");
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!isNonEmptyString(email) || !isNonEmptyString(password)) {
      return res.status(400).json("Email and password are required");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) return res.status(400).json("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json("Wrong password");

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

    const safeUser = user.toObject();
    delete safeUser.password;

    return res.json({ token, user: safeUser });
  } catch (error) {
    return res.status(500).json("Server error");
  }
}

module.exports = {
  register,
  login,
};
