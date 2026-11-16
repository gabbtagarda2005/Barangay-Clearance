import { useEffect, useState } from "react";
import api from "../services/api";

export default function StaffReviewPanel() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await api.get("/api/applications");
      setApps(res.data);
    } catch (error) {
      alert(error.response?.data || "Failed to load applications");
    }
  };

  const flagApp = async (id, flag) => {
    try {
      await api.put(`/api/applications/review/${id}`, {
        barangayFlag: flag,
      });
      load();
    } catch (error) {
      alert(error.response?.data || "Failed to update review");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Staff Review Panel</h2>

      {apps.map((app) => (
        <div key={app._id} className="card p-3 mt-2">
          <h5>{app.fullName}</h5>
          <p className="mb-2">Status: {app.status}</p>

          <div>
            <button className="btn btn-warning me-2" onClick={() => flagApp(app._id, true)}>
              Flag Issue
            </button>

            <button className="btn btn-success" onClick={() => flagApp(app._id, false)}>
              Mark Clean
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
