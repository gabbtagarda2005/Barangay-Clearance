import { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminApplicationsTable() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      const res = await api.get("/api/applications");
      setApps(res.data);
    } catch (error) {
      alert(error.response?.data || "Failed to load applications");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/api/applications/decision/${id}`, {
        decision: status,
      });
      fetchApps();
    } catch (error) {
      alert(error.response?.data || "Failed to update decision");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Admin Approval Panel</h2>

      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {apps.map((app) => (
            <tr key={app._id}>
              <td>{app.fullName}</td>
              <td>{app.status}</td>
              <td>
                <button
                  className="btn btn-success btn-sm me-2"
                  onClick={() => updateStatus(app._id, "APPROVED")}
                >
                  Approve
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => updateStatus(app._id, "DENIED")}
                >
                  Deny
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
