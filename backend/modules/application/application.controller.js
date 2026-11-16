const mongoose = require("mongoose");
const Application = require("./application.model");

const ALLOWED_DECISIONS = ["APPROVED", "DENIED"];
const ALLOWED_POLICE_STATUS = ["CLEAR", "WITH_WARRANT"];

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

async function apply(req, res) {
  try {
    const { fullName, birthdate, address } = req.body;

    if (!isNonEmptyString(fullName) || !isNonEmptyString(address) || !birthdate) {
      return res.status(400).json("fullName, birthdate, and address are required");
    }

    if (Number.isNaN(new Date(birthdate).getTime())) {
      return res.status(400).json("Invalid birthdate");
    }

    const app = await Application.create({
      userId: req.user.id,
      fullName: fullName.trim(),
      birthdate,
      address: address.trim(),
    });

    return res.json(app);
  } catch (error) {
    return res.status(500).json("Server error");
  }
}

async function review(req, res) {
  try {
    const { barangayFlag } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json("Invalid application id");
    }

    if (typeof barangayFlag !== "boolean") {
      return res.status(400).json("barangayFlag must be boolean");
    }

    const app = await Application.findByIdAndUpdate(
      req.params.id,
      {
        barangayFlag,
        status: barangayFlag ? "REVIEW" : "PENDING",
      },
      { new: true }
    );

    if (!app) return res.status(404).json("Application not found");

    return res.json(app);
  } catch (error) {
    return res.status(500).json("Server error");
  }
}

async function decision(req, res) {
  try {
    const { decision } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json("Invalid application id");
    }

    if (!ALLOWED_DECISIONS.includes(decision)) {
      return res.status(400).json("Decision must be APPROVED or DENIED");
    }

    const app = await Application.findByIdAndUpdate(
      req.params.id,
      {
        status: decision,
      },
      { new: true }
    );

    if (!app) return res.status(404).json("Application not found");

    return res.json(app);
  } catch (error) {
    return res.status(500).json("Server error");
  }
}

async function policeResponse(req, res) {
  try {
    const { policeStatus } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json("Invalid application id");
    }

    if (!ALLOWED_POLICE_STATUS.includes(policeStatus)) {
      return res.status(400).json("policeStatus must be CLEAR or WITH_WARRANT");
    }

    let status = "REVIEW";
    if (policeStatus === "WITH_WARRANT") status = "DENIED";
    if (policeStatus === "CLEAR") status = "PENDING";

    const app = await Application.findByIdAndUpdate(
      req.params.id,
      {
        policeStatus,
        status,
      },
      { new: true }
    );

    if (!app) return res.status(404).json("Application not found");

    return res.json(app);
  } catch (error) {
    return res.status(500).json("Server error");
  }
}

async function getAll(req, res) {
  try {
    const apps = await Application.find().populate("userId", "-password");
    return res.json(apps);
  } catch (error) {
    return res.status(500).json("Server error");
  }
}

module.exports = {
  apply,
  review,
  decision,
  policeResponse,
  getAll,
};
