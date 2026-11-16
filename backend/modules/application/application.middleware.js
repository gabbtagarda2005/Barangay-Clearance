function validateApplyPayload(req, res, next) {
  const { fullName, birthdate, address } = req.body;

  if (!fullName || !birthdate || !address) {
    return res.status(400).json("fullName, birthdate, and address are required");
  }

  return next();
}

module.exports = {
  validateApplyPayload,
};
