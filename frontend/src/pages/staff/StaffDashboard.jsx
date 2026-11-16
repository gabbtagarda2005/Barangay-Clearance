import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { CheckCircle, Clock, FileText, XCircle, DollarSign, Users, AlertCircle } from "lucide-react";

const getStatusColor = (status) => {
  if (status === "Pending" || status === "For Payment") return "pending";
  if (status === "Approved" || status === "Released") return "approved";
  if (status === "Rejected") return "rejected";
  return "secondary";
};

export default function StaffDashboard() {
  const { user, logout } = useContext(AuthContext);
  const [clearances, setClearances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("Pending");
  const [actionModal, setActionModal] = useState({ isOpen: false, clearance: null, action: null });
  const [remarks, setRemarks] = useState("");
  const [amountPaid, setAmountPaid] = useState("");

  useEffect(() => {
    fetchClearances();
  }, [filter]);

  const fetchClearances = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/clearances/staff?status=${encodeURIComponent(filter)}`);
      setClearances(response.data);
    } catch (err) {
      console.error("Failed to fetch clearances");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (clearance, action) => {
    setActionModal({ isOpen: true, clearance, action });
    setRemarks("");
    setAmountPaid("");
  };

  const executeAction = async () => {
    try {
      setLoading(true);
      const { clearance, action } = actionModal;

      switch (action) {
        case "approve":
          await api.put(`/clearances/${clearance._id}/approve`, { remarks });
          break;
        case "reject":
          await api.put(`/clearances/${clearance._id}/reject`, { remarks });
          break;
        case "payment":
          await api.put(`/clearances/${clearance._id}/payment`, { amountPaid: parseFloat(amountPaid) });
          break;
        case "release":
          await api.put(`/clearances/${clearance._id}/release`);
          break;
      }

      setActionModal({ isOpen: false, clearance: null, action: null });
      fetchClearances();
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    } finally {
      setLoading(false);
    }
  };

  const getActionTitle = (action) => {
    const titles = {
      approve: "Approve Clearance",
      reject: "Reject Clearance",
      payment: "Record Payment",
      release: "Release Clearance",
    };
    return titles[action];
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-3xl font-bold">Staff Dashboard</CardTitle>
              <CardDescription className="text-primary-foreground/80">Review and process clearance applications</CardDescription>
            </div>
            <Button
              variant="secondary"
              onClick={logout}
              className="hover:bg-primary-foreground/10"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filter Buttons */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {["Pending", "For Payment", "Approved", "Released", "Rejected"].map((status) => (
            <Button
              key={status}
              variant={filter === status ? "default" : "outline"}
              onClick={() => setFilter(status)}
            >
              {status}
            </Button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clearances.filter((c) => c.status === "Pending").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">For Payment</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {clearances.filter((c) => c.status === "For Payment").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {clearances.filter((c) => c.status === "Approved").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Released</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {clearances.filter((c) => c.status === "Released").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Clearances Table */}
        {loading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading clearances...</p>
              </div>
            </CardContent>
          </Card>
        ) : clearances.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No clearances to display</h3>
              <p className="text-muted-foreground">All caught up! No applications match the current filter.</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Clearance Applications</CardTitle>
              <CardDescription>Review and process resident applications</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Control #</TableHead>
                    <TableHead>Resident</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clearances.map((clearance) => (
                    <TableRow key={clearance._id}>
                      <TableCell className="font-medium">{clearance.controlNumber}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{clearance.residentId?.fullName}</p>
                          <p className="text-sm text-muted-foreground">{clearance.residentId?.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{clearance.purpose}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(clearance.status)}>
                          {clearance.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 flex-wrap">
                          {["Pending", "For Payment"].includes(clearance.status) && (
                            <>
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => handleAction(clearance, "approve")}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleAction(clearance, "reject")}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                          {clearance.status === "Approved" && (
                            <Button
                              size="sm"
                              onClick={() => handleAction(clearance, "release")}
                            >
                              <FileText className="w-4 h-4 mr-1" />
                              Release
                            </Button>
                          )}
                          {clearance.status === "Pending" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAction(clearance, "payment")}
                            >
                              <DollarSign className="w-4 h-4 mr-1" />
                              Payment
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Action Modal */}
      <Dialog open={actionModal.isOpen} onOpenChange={(open) => !open && setActionModal({ isOpen: false, clearance: null, action: null })}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{getActionTitle(actionModal.action)}</DialogTitle>
            <DialogDescription>
              {actionModal.action === "approve" && "Approve this clearance application"}
              {actionModal.action === "reject" && "Provide a reason for rejection"}
              {actionModal.action === "payment" && "Record the payment amount"}
              {actionModal.action === "release" && "Release this clearance to the resident"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {actionModal.action === "approve" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="remarks" className="text-right">
                  Remarks
                </Label>
                <Input
                  id="remarks"
                  placeholder="Add any remarks (optional)"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="col-span-3"
                />
              </div>
            )}

            {actionModal.action === "reject" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reason" className="text-right">
                  Reason
                </Label>
                <Input
                  id="reason"
                  placeholder="Why is this being rejected?"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  required
                  className="col-span-3"
                />
              </div>
            )}

            {actionModal.action === "payment" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount in pesos"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  required
                  className="col-span-3"
                />
              </div>
            )}

            {actionModal.action === "release" && (
              <div className="text-center py-4">
                <p className="text-muted-foreground">
                  Are you sure you want to release this clearance to the resident?
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setActionModal({ isOpen: false, clearance: null, action: null })}
            >
              Cancel
            </Button>
            <Button
              onClick={executeAction}
              disabled={loading || (actionModal.action === "reject" && !remarks) || (actionModal.action === "payment" && !amountPaid)}
              variant={
                actionModal.action === "reject" ? "destructive" :
                actionModal.action === "approve" ? "default" : "default"
              }
            >
              {loading ? "Processing..." :
               actionModal.action === "approve" ? "Approve" :
               actionModal.action === "reject" ? "Reject" :
               actionModal.action === "payment" ? "Record Payment" :
               "Release"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
