function requireAdminRole(req, res, next) {
  if (req.user?.role !== "ADMIN") return res.status(403).json("Access denied");
  return next();
}

module.exports = {
  requireAdminRole,
};
