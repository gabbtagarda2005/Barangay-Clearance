import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { lazy, Suspense, useContext, useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import { AuthContext } from "./context/AuthContext.jsx";
import api from "./services/api.js";

const Login = lazy(() => import("./pages/Login.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));
const ResidentDashboard = lazy(() => import("./pages/resident/ResidentDashboard.jsx"));
const StaffDashboard = lazy(() => import("./pages/staff/StaffDashboard.jsx"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.jsx"));
const SysAdminDashboard = lazy(() => import("./pages/sysadmin/SysAdminDashboard.jsx"));

function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeRole, setActiveRole] = useState("Resident");
  const [monthlyProcessed, setMonthlyProcessed] = useState(null);

  useEffect(() => {
    if (user) {
      navigate(`/${user.role.toLowerCase()}`);
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await api.get("/clearances/summary");
        if (response.data?.monthlyProcessed != null) {
          setMonthlyProcessed(response.data.monthlyProcessed);
        }
      } catch (error) {
        console.warn("Landing page summary fetch failed", error.message || error);
      }
    };

    fetchSummary();
  }, []);

  const roleTabs = [
    {
      name: "Resident",
      title: "Apply in 2 minutes. Track in real-time.",
      description: "Residents submit clearance requests, upload documents, and receive real-time status updates without visiting the office.",
    },
    {
      name: "Staff",
      title: "Zero manual typing. Automated control numbers.",
      description: "Staff manage approvals, verify payments, and release clearances with one clean workflow and built-in audit tracking.",
    },
    {
      name: "Admin",
      title: "Financial transparency. Instant revenue reports.",
      description: "Admins review approvals, monitor fees collected, and export reports with a single click for better governance.",
    },
  ];

  const roleContent = roleTabs.find((tab) => tab.name === activeRole);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="sticky top-4 z-30 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="rounded-[32px] border border-slate-200/70 bg-white/80 px-6 py-4 shadow-sm backdrop-blur-md transition-all duration-300">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="font-serif text-2xl font-semibold tracking-tight text-slate-900">
              Barangay<span className="text-indigo-600">Portal</span>
            </div>
            <div className="flex flex-wrap items-center gap-6 font-sans text-sm text-slate-700">
              <button onClick={() => navigate("/")} className="transition hover:text-slate-900">Home</button>
              <button onClick={() => navigate("/login")} className="transition hover:text-slate-900">Login</button>
              <button onClick={() => navigate("/register")} className="transition hover:text-slate-900">Register</button>
            </div>
          </div>
        </header>
      </div>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="grid gap-10 py-20 lg:grid-cols-2 lg:items-center">
          <div className="space-y-8">
            <div className="max-w-xl">
              <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">Barangay Clearance System</p>
              <h1 className="mt-6 text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">Modern government services</span> for every resident.
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                A premium digital portal for clearance requests, staff approvals, and admin reporting—designed for transparency, speed, and community trust.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                onClick={() => navigate("/register")}
                className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <button
                onClick={() => navigate("/login")}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-8 py-3 text-base font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                View Demo
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/80">
                <p className="text-sm text-slate-500">Live clearances this month</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">
                  {monthlyProcessed == null ? "—" : monthlyProcessed.toLocaleString()}
                </p>
              </div>
              <div className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/80">
                <p className="text-sm text-slate-500">A single portal for</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">Residents &amp; staff</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-blue-200/70 via-transparent to-indigo-200/70 blur-3xl" />
            <div className="relative overflow-hidden rounded-[40px] border border-slate-200 bg-white shadow-[0_40px_120px_-72px_rgba(79,70,229,0.6)]">
              <div className="bg-slate-950 px-6 py-5 text-white">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Barangay Clearance Preview</p>
                <h2 className="mt-3 text-2xl font-semibold">Clearance snippet</h2>
              </div>
              <div className="space-y-4 p-6">
                <div className="rounded-3xl bg-slate-50 p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">CONTROL NO.</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">BRGY-2026-0124</p>
                </div>
                <div className="space-y-3 rounded-[32px] bg-white p-5 shadow-sm">
                  <div className="h-2 w-24 rounded-full bg-indigo-100" />
                  <div className="h-2 w-32 rounded-full bg-slate-200" />
                  <div className="h-2 w-20 rounded-full bg-slate-200" />
                </div>
                <div className="rounded-[32px] border border-slate-200 bg-slate-50 p-5 shadow-sm">
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>Paid</span>
                    <span className="font-semibold text-slate-900">₱150.00</span>
                  </div>
                  <div className="mt-4 h-2 w-full rounded-full bg-indigo-100" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">Premium advantages</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">Designed for modern barangay operations</h2>
            <p className="mt-4 text-slate-600">
              A polished, government-grade interface that helps residents, staff, and administrators work faster with full transparency.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {[
              {
                title: "Faster Processing",
                description: "Automated workflow removes manual tracking and speeds approvals.",
                icon: "🕒",
                color: "bg-blue-50 text-blue-600",
              },
              {
                title: "Secure Records",
                description: "Every action is logged and traceable for full accountability.",
                icon: "🔒",
                color: "bg-indigo-50 text-indigo-600",
              },
              {
                title: "Instant Reporting",
                description: "Admins get real-time revenue and clearance metrics at a glance.",
                icon: "📈",
                color: "bg-sky-50 text-sky-600",
              },
            ].map((item) => (
              <div key={item.title} className="group rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className={`inline-flex h-14 w-14 items-center justify-center rounded-3xl ${item.color}`}>
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-3 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">Who this is for</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">Role-based benefits with clean navigation</h2>
            <p className="mt-4 text-slate-600">
              Focused messaging for residents, staff, and administrators, so every role can find what it needs.
            </p>
          </div>

          <div className="mt-12 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap gap-3">
              {roleTabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveRole(tab.name)}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition ${activeRole === tab.name ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                >
                  {tab.name}
                </button>
              ))}
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-indigo-600">{roleContent.name} experience</p>
                <h3 className="mt-4 text-3xl font-semibold text-slate-900">{roleContent.title}</h3>
                <p className="mt-4 text-slate-600">{roleContent.description}</p>
              </div>
              <div className="space-y-4">
                <div className="rounded-3xl bg-slate-50 p-6 shadow-sm">
                  <p className="text-sm font-semibold text-slate-900">Fast responses</p>
                  <p className="mt-2 text-slate-600">Reduce manual approvals and keep requests moving.</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-6 shadow-sm">
                  <p className="text-sm font-semibold text-slate-900">Clear accountability</p>
                  <p className="mt-2 text-slate-600">Clear audit trails for every action taken in the system.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm font-medium text-slate-600">
            Loading Barangay Portal…
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/resident"
            element={
              <ProtectedRoute role="RESIDENT">
                <ResidentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/staff"
            element={
              <ProtectedRoute role="STAFF">
                <StaffDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute role="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/sysadmin"
            element={
              <ProtectedRoute role="SYSADMIN">
                <SysAdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
