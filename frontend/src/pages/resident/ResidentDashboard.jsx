import { useState, useEffect, useContext } from "react";
import { CheckCircle } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";

const purposes = [
  { value: "Local Employment", label: "Local Employment" },
  { value: "Postal ID", label: "Postal ID" },
  { value: "Bank Requirement", label: "Bank Requirement" },
  { value: "Travel Abroad", label: "Travel Abroad" },
  { value: "Business Permit", label: "Business Permit" },
  { value: "Other", label: "Other" },
];

const statusSteps = ["Pending", "For Payment", "Approved", "Released"];

function ProgressStepper({ currentStatus }) {
  const currentIndex = statusSteps.indexOf(currentStatus);

  return (
    <div className="flex items-center justify-between mb-8">
      {statusSteps.map((step, index) => (
        <div key={step} className="flex items-center flex-1">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
              index <= currentIndex ? "bg-primary" : "bg-muted"
            }`}
          >
            {index <= currentIndex ? <CheckCircle className="w-5 h-5" /> : index + 1}
          </div>
          {index < statusSteps.length - 1 && (
            <div
              className={`flex-1 h-1 mx-2 ${
                index < currentIndex ? "bg-primary" : "bg-muted"
              }`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function ResidentDashboard() {
  const { user, logout } = useContext(AuthContext);
  const [clearances, setClearances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClearance, setSelectedClearance] = useState(null);
  const [newRequest, setNewRequest] = useState({ purpose: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchClearances();
  }, []);

  const fetchClearances = async () => {
    try {
      setLoading(true);
      const response = await api.get("/clearances/my-clearances");
      setClearances(response.data);
    } catch (err) {
      setError("Failed to load clearances");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (clearanceId) => {
    try {
      const response = await api.get(`/clearances/${clearanceId}/pdf`, {
        responseType: 'blob'
      });

      // Create a blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Barangay-Clearance-${clearanceId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Failed to download PDF");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "warning";
      case "For Payment":
        return "info";
      case "Approved":
        return "success";
      case "Released":
        return "success";
      case "Rejected":
        return "danger";
      default:
        return "default";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-900 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Barangay Clearance System</h1>
              <p className="text-white/80">Welcome back, {user?.fullName || "Resident"}!</p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-white text-blue-900 rounded-lg font-medium hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-200 rounded-lg text-red-800">
            {error}
            <button
              onClick={() => setError("")}
              className="float-right text-xl leading-none hover:text-red-600"
            >
              ×
            </button>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold">{clearances.length}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {clearances.filter((c) => c.status === "Pending").length}
                </p>
              </div>
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {clearances.filter((c) => c.status === "Approved").length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Released</p>
                <p className="text-2xl font-bold text-blue-600">
                  {clearances.filter((c) => c.status === "Released").length}
                </p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Request New Clearance */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Clearance Requests</h2>
              <p className="text-gray-600">Manage your barangay clearance applications</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Request New Clearance
            </button>
          </div>
        </div>

        {/* Clearances List */}
        {loading ? (
          <div className="bg-white p-12 rounded-lg shadow-md text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your clearances...</p>
          </div>
        ) : clearances.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow-md text-center">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-semibold mb-2">No clearance requests yet</h3>
            <p className="text-gray-600 mb-4">Get started by requesting your first barangay clearance</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Your First Request
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {clearances.map((clearance) => (
              <div
                key={clearance._id}
                className="bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedClearance(clearance)}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Control #: {clearance.controlNumber}
                      </h3>
                      <p className="text-gray-600">Purpose: {clearance.purpose}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      clearance.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      clearance.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      clearance.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                      clearance.status === 'For Payment' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {clearance.status}
                    </span>
                  </div>
                  {selectedClearance?._id === clearance._id && (
                    <div className="mt-6 pt-6 border-t">
                      <ProgressStepper currentStatus={clearance.status} />
                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <p className="text-gray-600">Created</p>
                          <p className="font-medium">
                            {new Date(clearance.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        {clearance.issuedAt && (
                          <div>
                            <p className="text-gray-600">Issued</p>
                            <p className="font-medium">
                              {new Date(clearance.issuedAt).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>
                      {clearance.remarks && (
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm font-medium text-yellow-800">Remarks:</p>
                          <p className="text-sm text-yellow-700">{clearance.remarks}</p>
                        </div>
                      )}
                      {clearance.status === "Released" && (
                        <button
                          className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
                          onClick={() => handleDownloadPDF(clearance._id)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Download / Print Clearance
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Request New Clearance</h2>
              <p className="text-gray-600">Select the purpose for your barangay clearance application.</p>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Purpose</label>
              <select
                value={newRequest.purpose}
                onChange={(e) => setNewRequest({ purpose: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a purpose</option>
                {purposes.map((purpose) => (
                  <option key={purpose.value} value={purpose.value}>
                    {purpose.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRequest}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
