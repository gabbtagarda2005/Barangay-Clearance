import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import { Button, Card, Badge, Spinner } from "../../components/ui";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [revenueData, setRevenueData] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [clearancesRes, revenueRes, auditRes] = await Promise.all([
        api.get("/clearances"),
        api.get("/clearances/revenue-report"),
        api.get("/audit-logs"),
      ]);

      const clearances = clearancesRes.data;
      setStats({
        total: clearances.length,
        pending: clearances.filter((c) => c.status === "Pending").length,
        approved: clearances.filter((c) => c.status === "Approved").length,
        rejected: clearances.filter((c) => c.status === "Rejected").length,
      });

      setRevenueData(revenueRes.data);
      setAuditLogs(auditRes.data.slice(0, 10));
    } catch (err) {
      console.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const chartData = revenueData.map((item) => ({
    month: monthNames[item._id - 1],
    revenue: item.totalCollection,
    clearances: item.totalClearances,
  }));

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="dashboard-header">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-blue-100">System overview and reporting</p>
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
        {loading ? (
          <Spinner />
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <h3 className="text-slate-600 text-sm font-medium mb-2">Total Clearances</h3>
                <p className="text-4xl font-bold text-slate-900">{stats.total}</p>
              </Card>
              <Card>
                <h3 className="text-slate-600 text-sm font-medium mb-2">Pending</h3>
                <p className="text-4xl font-bold text-yellow-600">{stats.pending}</p>
              </Card>
              <Card>
                <h3 className="text-slate-600 text-sm font-medium mb-2">Approved</h3>
                <p className="text-4xl font-bold text-green-600">{stats.approved}</p>
              </Card>
              <Card>
                <h3 className="text-slate-600 text-sm font-medium mb-2">Rejected</h3>
                <p className="text-4xl font-bold text-red-600">{stats.rejected}</p>
              </Card>
            </div>

            {/* Revenue Chart */}
            {chartData.length > 0 && (
              <Card className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Monthly Revenue Report</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill="#3182ce" name="Revenue (₱)" />
                    <Bar dataKey="clearances" fill="#48bb78" name="Clearances Issued" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            )}

            {/* Audit Log */}
            <Card>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Recent Activity</h2>
              <div className="space-y-3">
                {auditLogs.length === 0 ? (
                  <p className="text-slate-600 text-center py-8">No activity yet</p>
                ) : (
                  auditLogs.map((log) => (
                    <div
                      key={log._id}
                      className="flex items-start gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{log.action.replace(/_/g, " ")}</p>
                        <p className="text-sm text-slate-600">
                          By: {log.performedBy?.fullName || "Unknown"}
                        </p>
                        {log.details && (
                          <p className="text-sm text-slate-600 mt-1">{log.details}</p>
                        )}
                      </div>
                      <div className="text-right text-xs text-slate-500">
                        {new Date(log.timestamp).toLocaleDateString()}
                        <br />
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
