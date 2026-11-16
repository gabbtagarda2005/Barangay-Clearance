module.exports = (...roles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json("Unauthorized");

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json("Access denied");
    }

    next();
  };
};
