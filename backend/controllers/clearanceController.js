const Clearance = require("../models/Clearance");
const AuditLog = require("../models/AuditLog");
const User = require("../models/User");

// Create Clearance Request
const createClearance = async (req, res) => {
  try {
    const { purpose } = req.body;
    const residentId = req.user.id;

    if (!purpose) {
      return res.status(400).json({ message: "Purpose is required" });
    }

    const clearance = new Clearance({
      residentId,
      purpose,
      status: "Pending",
    });

    await clearance.save();

    // Log the action
    await AuditLog.create({
      action: "CLEARANCE_CREATED",
      performedBy: residentId,
      targetResident: residentId,
      targetClearance: clearance._id,
      details: `Clearance request created for ${purpose}`,
      ipAddress: req.ip,
    });

    res.status(201).json({
      message: "Clearance request created successfully",
      clearance,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get All Pending Clearances (for Staff Dashboard)
const getPendingClearances = async (req, res) => {
  try {
    const pending = await Clearance.find({ status: "Pending" })
      .populate("residentId", "fullName address email contactNumber profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json(pending);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get All Clearances (with filter)
const getAllClearances = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const clearances = await Clearance.find(filter)
      .populate("residentId", "fullName address email contactNumber profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json(clearances);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get User's Clearances
const getUserClearances = async (req, res) => {
  try {
    const clearances = await Clearance.find({ residentId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(clearances);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Approve Clearance
const approveClearance = async (req, res) => {
  try {
    const { id } = req.params;
    const { remarks } = req.body;

    const clearance = await Clearance.findById(id);
    if (!clearance) {
      return res.status(404).json({ message: "Clearance not found" });
    }

    clearance.status = "Approved";
    clearance.issuedAt = new Date();
    clearance.remarks = remarks || "";

    await clearance.save();

    // Log the action
    await AuditLog.create({
      action: "CLEARANCE_APPROVED",
      performedBy: req.user.id,
      targetResident: clearance.residentId,
      targetClearance: clearance._id,
      details: `Control No: ${clearance.controlNumber}, Remarks: ${remarks || "None"}`,
      ipAddress: req.ip,
    });

    res.status(200).json({
      message: "Clearance approved successfully",
      clearance,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Reject Clearance
const rejectClearance = async (req, res) => {
  try {
    const { id } = req.params;
    const { remarks } = req.body;

    if (!remarks) {
      return res.status(400).json({ message: "Rejection remarks are required" });
    }

    const clearance = await Clearance.findById(id);
    if (!clearance) {
      return res.status(404).json({ message: "Clearance not found" });
    }

    clearance.status = "Rejected";
    clearance.remarks = remarks;

    await clearance.save();

    // Log the action
    await AuditLog.create({
      action: "CLEARANCE_REJECTED",
      performedBy: req.user.id,
      targetResident: clearance.residentId,
      targetClearance: clearance._id,
      details: `Rejected Reason: ${remarks}`,
      ipAddress: req.ip,
    });

    res.status(200).json({
      message: "Clearance rejected successfully",
      clearance,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Record Payment
const recordPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { amountPaid } = req.body;

    if (!amountPaid || amountPaid <= 0) {
      return res.status(400).json({ message: "Valid amount is required" });
    }

    const clearance = await Clearance.findById(id);
    if (!clearance) {
      return res.status(404).json({ message: "Clearance not found" });
    }

    clearance.amountPaid = amountPaid;
    clearance.paymentDate = new Date();
    clearance.status = "For Payment";

    await clearance.save();

    // Log the action
    await AuditLog.create({
      action: "PAYMENT_RECORDED",
      performedBy: req.user.id,
      targetResident: clearance.residentId,
      targetClearance: clearance._id,
      details: `Payment of ₱${amountPaid} recorded for Control No: ${clearance.controlNumber}`,
      ipAddress: req.ip,
    });

    res.status(200).json({
      message: "Payment recorded successfully",
      clearance,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Release Clearance
const releaseClearance = async (req, res) => {
  try {
    const { id } = req.params;

    const clearance = await Clearance.findById(id);
    if (!clearance) {
      return res.status(404).json({ message: "Clearance not found" });
    }

    if (clearance.status !== "Approved") {
      return res.status(400).json({ message: "Only approved clearances can be released" });
    }

    clearance.status = "Released";

    await clearance.save();

    // Log the action
    await AuditLog.create({
      action: "CLEARANCE_RELEASED",
      performedBy: req.user.id,
      targetResident: clearance.residentId,
      targetClearance: clearance._id,
      details: `Control No: ${clearance.controlNumber}`,
      ipAddress: req.ip,
    });

    res.status(200).json({
      message: "Clearance released successfully",
      clearance,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Revenue Report
const getRevenueReport = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    const report = await Clearance.aggregate([
      {
        $match: {
          status: { $in: ["Approved", "Released"] },
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalCollection: { $sum: "$amountPaid" },
          totalClearances: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Public clearance summary for landing page analytics
const getClearanceSummary = async (req, res) => {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthlyProcessed = await Clearance.countDocuments({
      status: { $in: ["Approved", "Released"] },
      createdAt: { $gte: monthStart },
    });

    res.status(200).json({
      monthlyProcessed,
      approvedCount: await Clearance.countDocuments({ status: "Approved" }),
      releasedCount: await Clearance.countDocuments({ status: "Released" }),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Generate PDF Clearance
const generateClearancePDF = async (req, res) => {
  try {
    const { id } = req.params;

    const clearance = await Clearance.findById(id).populate(
      "residentId",
      "fullName address email contactNumber"
    );

    if (!clearance) {
      return res.status(404).json({ message: "Clearance not found" });
    }

    if (clearance.status !== "Released") {
      return res.status(400).json({ message: "Clearance must be released to generate PDF" });
    }

    // Create a new PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Barangay-Clearance-${clearance.controlNumber}.pdf`);

    // Pipe the PDF to the response
    doc.pipe(res);

    // Add content to PDF
    // Header
    doc.fontSize(20).font('Helvetica-Bold').text('BARANGAY CLEARANCE', { align: 'center' });
    doc.moveDown();

    // Control Number
    doc.fontSize(12).font('Helvetica').text(`Control Number: ${clearance.controlNumber}`, { align: 'right' });
    doc.moveDown();

    // Resident Information
    doc.fontSize(14).font('Helvetica-Bold').text('RESIDENT INFORMATION');
    doc.moveDown(0.5);

    doc.fontSize(12).font('Helvetica');
    doc.text(`Full Name: ${clearance.residentId.fullName}`);
    doc.text(`Address: ${clearance.residentId.address || 'N/A'}`);
    doc.text(`Contact Number: ${clearance.residentId.contactNumber || 'N/A'}`);
    doc.text(`Email: ${clearance.residentId.email}`);
    doc.moveDown();

    // Clearance Details
    doc.fontSize(14).font('Helvetica-Bold').text('CLEARANCE DETAILS');
    doc.moveDown(0.5);

    doc.fontSize(12).font('Helvetica');
    doc.text(`Purpose: ${clearance.purpose}`);
    doc.text(`Date Issued: ${new Date(clearance.issuedAt).toLocaleDateString()}`);
    doc.text(`Amount Paid: ₱${clearance.amountPaid.toFixed(2)}`);
    doc.moveDown();

    // Certification Text
    doc.fontSize(12).font('Helvetica');
    doc.text('This is to certify that the above-named person has no derogatory record in this Barangay and is eligible for the purpose stated above.');
    doc.moveDown(2);

    // Signature Section
    doc.text('Issued by: _______________________________', { align: 'left' });
    doc.text('Barangay Captain', { align: 'left' });
    doc.moveDown();

    doc.text('Date: _______________________________', { align: 'left' });
    doc.moveDown(2);

    // Footer
    doc.fontSize(10).font('Helvetica');
    doc.text('This document is electronically generated and is valid without signature.', { align: 'center' });
    doc.text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });

    // Finalize the PDF
    doc.end();

  } catch (error) {
    console.error('PDF Generation Error:', error);
    res.status(500).json({ message: "Error generating PDF", error: error.message });
  }
};

// Get Clearance by ID
const getClearanceById = async (req, res) => {
  try {
    const { id } = req.params;
    const clearance = await Clearance.findById(id)
      .populate("residentId", "fullName address email contactNumber profilePicture");

    if (!clearance) {
      return res.status(404).json({ message: "Clearance not found" });
    }

    res.status(200).json(clearance);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createClearance,
  getPendingClearances,
  getAllClearances,
  getUserClearances,
  approveClearance,
  rejectClearance,
  recordPayment,
  releaseClearance,
  getRevenueReport,
  getClearanceSummary,
  getClearanceById,
  generateClearancePDF,
};
