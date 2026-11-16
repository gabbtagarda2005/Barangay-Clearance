import { useState } from "react";
import api from "../services/api";

export default function ResidentApplyForm() {
  const [form, setForm] = useState({
    fullName: "",
    birthdate: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitApplication = async () => {
    try {
      setLoading(true);
      await api.post("/api/applications", form);
      alert("Application Submitted!");
      setForm({ fullName: "", birthdate: "", address: "" });
    } catch (error) {
      const message = error.response?.data || "Failed to submit application";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Barangay Clearance Application</h2>

      <input
        className="form-control mt-2"
        name="fullName"
        placeholder="Full Name"
        value={form.fullName}
        onChange={handleChange}
      />

      <input
        className="form-control mt-2"
        type="date"
        name="birthdate"
        value={form.birthdate}
        onChange={handleChange}
      />

      <textarea
        className="form-control mt-2"
        name="address"
        placeholder="Address"
        value={form.address}
        onChange={handleChange}
      />

      <button className="btn btn-primary mt-3" onClick={submitApplication} disabled={loading}>
        {loading ? "Submitting..." : "Submit Application"}
      </button>
    </div>
  );
}
