const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config({ path: `${__dirname}/.env` });

const createBootstrapUser = async () => {
  const { MONGO_URI, BOOTSTRAP_USER_NAME, BOOTSTRAP_USER_EMAIL, BOOTSTRAP_USER_PASSWORD } = process.env;
  const role = process.env.BOOTSTRAP_USER_ROLE || "SYSADMIN";
  const validRoles = ["RESIDENT", "STAFF", "ADMIN", "SYSADMIN"];

  if (!MONGO_URI || !BOOTSTRAP_USER_NAME || !BOOTSTRAP_USER_EMAIL || !BOOTSTRAP_USER_PASSWORD) {
    throw new Error("Set MONGO_URI and all BOOTSTRAP_USER_NAME, BOOTSTRAP_USER_EMAIL, and BOOTSTRAP_USER_PASSWORD values");
  }
  if (!validRoles.includes(role)) {
    throw new Error(`BOOTSTRAP_USER_ROLE must be one of: ${validRoles.join(", ")}`);
  }

  let connected = false;
  try {
    await mongoose.connect(MONGO_URI);
    connected = true;

    const email = BOOTSTRAP_USER_EMAIL.trim().toLowerCase();
    if (await User.exists({ email })) {
      throw new Error(`A user with ${email} already exists; no accounts were changed`);
    }

    await User.create({
      fullName: BOOTSTRAP_USER_NAME.trim(),
      email,
      password: BOOTSTRAP_USER_PASSWORD,
      role,
    });

    console.log(`Created ${role} account for ${email}`);
  } finally {
    if (connected) await mongoose.disconnect();
  }
};

createBootstrapUser().catch((error) => {
  console.error("User provisioning failed:", error.message);
  process.exitCode = 1;
});
