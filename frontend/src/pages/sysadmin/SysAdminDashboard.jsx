import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import { Button, Card, Badge, Spinner, Modal, TextField } from "../../components/ui";

export default function SysAdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState("All");
  const [filterModal, setFilterModal] = useState({ isOpen: false, startDate: "", endDate: "" });

  useEffect(() => {
    fetchAuditLogs();
  }, [filterAction]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const response = await api.get("/audit-logs");
      setAuditLogs(response.data);
    } catch (err) {
      console.error("Failed to fetch audit logs");
    } finally {
      setLoading(false);
    }
  };

  const handleDateFilter = async () => {
    try {
      setLoading(true);
      const response = await api.get("/audit-logs/date-range", {
        params: {
          startDate: filterModal.startDate,
          endDate: filterModal.endDate,
        },
      });
      setAuditLogs(response.data);
      setFilterModal({ isOpen: false, startDate: "", endDate: "" });
    } catch (err) {
      alert("Failed to filter logs");
    } finally {
      setLoading(false);
    }
  };

  const getActionBadgeColor = (action) => {
    if (action.includes("APPROVED")) return "success";
    if (action.includes("REJECTED")) return "danger";
    if (action.includes("CREATED")) return "info";
    if (action.includes("RELEASED")) return "success";
    return "default";
  };

  const filteredLogs = auditLogs;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="dashboard-header">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-2">System Admin Dashboard</h1>
              <p className="text-blue-100">Audit logs and system monitoring</p>
            </div>
            <button
              onClick={logout}
              className="px-6 py-2 bg-white text-slate-900 rounded-lg font-medium hover:bg-opacity-90"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <h3 className="text-slate-600 text-sm font-medium mb-2">Total Actions Logged</h3>
            <p className="text-4xl font-bold text-slate-900">{filteredLogs.length}</p>
          </Card>
          <Card>
            <h3 className="text-slate-600 text-sm font-medium mb-2">Approvals</h3>
            <p className="text-4xl font-bold text-green-600">
              {filteredLogs.filter((l) => l.action.includes("APPROVED")).length}
            </p>
          </Card>
          <Card>
            <h3 className="text-slate-600 text-sm font-medium mb-2">Rejections</h3>
            <p className="text-4xl font-bold text-red-600">
              {filteredLogs.filter((l) => l.action.includes("REJECTED")).length}
            </p>
          </Card>
        </div>

        {/* Action Buttons */}
        <Card className="mb-8">
          <div className="flex gap-2 flex-wrap">
            <Button variant="primary" onClick={() => fetchAuditLogs()}>
              Refresh Logs
            </Button>
            <Button
              variant="secondary"
              onClick={() => setFilterModal({ ...filterModal, isOpen: true })}
            >
              Filter by Date Range
            </Button>
            <Button
              variant="secondary"
              onClick={() => setAuditLogs([])}
            >
              Clear Filters
            </Button>
          </div>
        </Card>

        {/* Audit Log Timeline */}
        {loading ? (
          <Spinner />
        ) : filteredLogs.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-slate-600">No audit logs to display</p>
          </Card>
        ) : (
          <Card>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">System Activity Log</h2>
            <div className="space-y-4">
              {filteredLogs.map((log, index) => (
                <div
                  key={log._id}
                  className="flex gap-4 p-4 border-l-4 border-indigo-600 bg-slate-50 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant={getActionBadgeColor(log.action)}>
                        {log.action.replace(/_/g, " ")}
                      </Badge>
                      <span className="text-xs text-slate-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-600 font-medium">Performed By</p>
                        <p className="text-slate-900">{log.performedBy?.fullName || "System"}</p>
                      </div>
                      {log.targetResident && (
                        <div>
                          <p className="text-slate-600 font-medium">Target Resident</p>
                          <p className="text-slate-900">{log.targetResident?.fullName}</p>
                        </div>
                      )}
                    </div>

                    {log.details && (
                      <div className="mt-3 p-3 bg-white rounded border border-slate-200">
                        <p className="text-sm text-slate-700"><strong>Details:</strong> {log.details}</p>
                      </div>
                    )}

                    {log.ipAddress && (
                      <p className="text-xs text-slate-500 mt-2">IP Address: {log.ipAddress}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Date Filter Modal */}
      <Modal
        isOpen={filterModal.isOpen}
        onClose={() => setFilterModal({ isOpen: false, startDate: "", endDate: "" })}
        title="Filter by Date Range"
      >
        <TextField
          label="Start Date"
          type="date"
          value={filterModal.startDate}
          onChange={(e) => setFilterModal({ ...filterModal, startDate: e.target.value })}
        />
        <TextField
          label="End Date"
          type="date"
          value={filterModal.endDate}
          onChange={(e) => setFilterModal({ ...filterModal, endDate: e.target.value })}
        />
        <div className="flex gap-2 mt-6">
          <Button
            variant="secondary"
            onClick={() => setFilterModal({ isOpen: false, startDate: "", endDate: "" })}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleDateFilter}
            className="flex-1"
            disabled={!filterModal.startDate || !filterModal.endDate}
          >
            Filter
          </Button>
        </div>
      </Modal>
    </div>
  );
}
