function requireStaffRole(req, res, next) {
  if (req.user?.role !== "STAFF") return res.status(403).json("Access denied");
  return next();
}

module.exports = {
  requireStaffRole,
};
