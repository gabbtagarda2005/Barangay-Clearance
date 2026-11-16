import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { Button, TextField, Card } from "../components/ui";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactNumber: "",
    address: "",
    profilePicture: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profilePicture: file });
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("fullName", formData.fullName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("confirmPassword", formData.confirmPassword);
      formDataToSend.append("contactNumber", formData.contactNumber);
      formDataToSend.append("address", formData.address);
      if (formData.profilePicture) {
        formDataToSend.append("profilePicture", formData.profilePicture);
      }

      await api.post("/auth/register", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-600 to-blue-600 flex items-center justify-center p-4 py-8">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h1>
          <p className="text-slate-600">Join Barangay Clearance System</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {imagePreview && (
            <div className="mb-4 text-center">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-indigo-600"
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <TextField
            label="Full Name"
            name="fullName"
            placeholder="Juan Dela Cruz"
            value={formData.fullName}
            onChange={handleChange}
            required
          />

          <TextField
            label="Email"
            type="email"
            name="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <TextField
            label="Contact Number"
            name="contactNumber"
            placeholder="+63 9XX XXXX XXX"
            value={formData.contactNumber}
            onChange={handleChange}
          />

          <TextField
            label="Address"
            name="address"
            placeholder="Your barangay address"
            value={formData.address}
            onChange={handleChange}
          />

          <TextField
            label="Password"
            type="password"
            name="password"
            placeholder="Create a strong password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <TextField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mb-4"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <div className="text-center border-t border-slate-200 pt-4">
          <p className="text-slate-600 text-sm mb-3">Already have an account?</p>
          <Link to="/login">
            <Button variant="secondary" size="lg" className="w-full">
              Login Here
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
