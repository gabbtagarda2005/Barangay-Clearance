function dashboard(req, res) {
  return res.json({ message: "Admin dashboard endpoint", user: req.user });
}

module.exports = {
  dashboard,
};
