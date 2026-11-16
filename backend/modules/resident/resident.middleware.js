function validateRegisterInput(req, res, next) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json("name, email, and password are required");
  }

  return next();
}

module.exports = {
  validateRegisterInput,
};
