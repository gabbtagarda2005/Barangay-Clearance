const mongoose = require("mongoose");

async function connectDB() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be configured before starting the server");
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB Connected");
}

module.exports = connectDB;
