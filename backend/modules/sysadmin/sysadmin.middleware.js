function requireSysadminRole(req, res, next) {
  if (req.user?.role !== "SYSADMIN") return res.status(403).json("Access denied");
  return next();
}

module.exports = {
  requireSysadminRole,
};
