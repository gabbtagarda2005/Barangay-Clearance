function dashboard(req, res) {
  return res.json({ message: "Sysadmin dashboard endpoint", user: req.user });
}

module.exports = {
  dashboard,
};
