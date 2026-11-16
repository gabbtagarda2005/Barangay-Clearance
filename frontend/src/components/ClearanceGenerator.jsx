import jsPDF from "jspdf";
import { QRCodeSVG } from "qrcode.react";

export default function ClearanceGenerator({ data }) {
  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("BARANGAY CLEARANCE", 20, 20);
    doc.setFontSize(12);
    doc.text(`Name: ${data.fullName}`, 20, 40);
    doc.text("Status: APPROVED", 20, 60);

    doc.save("clearance.pdf");
  };

  return (
    <div className="container mt-4">
      <h2>Clearance Approved</h2>
      <QRCodeSVG value={`${data.fullName}-APPROVED`} size={160} />

      <div>
        <button className="btn btn-primary mt-3" onClick={generatePDF}>
          Download PDF Clearance
        </button>
      </div>
    </div>
  );
}
