function dashboard(req, res) {
  return res.json({ message: "Staff dashboard endpoint", user: req.user });
}

module.exports = {
  dashboard,
};
