import { useState, useEffect, useCallback ,useMemo} from "react";
import {
  LayoutDashboard, Users,
  Wallet, BarChart2, Bell, CalendarPlus,  Search, 
  Menu, X, File,
  ChevronRight, GraduationCap,
  MapPin,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { useNavigate } from "react-router-dom";
import { useApplicantsQuery } from "@/applicationRedux/baseAppslice";
import { useSelector } from "react-redux";


//Helpers 
const formatCurrency = (v) =>
  v >= 1_000_000 ? `KES ${(v / 1_000_000).toFixed(2)}M` : `KES ${v?.toLocaleString()}`;

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const Skeleton = ({ className = "" }) => (
  <div className={`rounded-xl ${className}`}
    style={{
      background: "linear-gradient(90deg,#eff6ff 25%,#dbeafe 50%,#eff6ff 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.8s ease-in-out infinite",
    }} />
);

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const navItems = [
  { icon: LayoutDashboard, label: "Dashboard"                         },
  { icon: Users,label: "Users",path:"/users"},
  { icon: BarChart2,       label: "Reports"                           },
  { icon: CalendarPlus, label: "Create Cycle", path:"/cycle/create" },
  {icon:File, label:"Cycle List", path:"/cycles"}
];

const Sidebar = ({ open, onClose, activeNav, setActiveNav }) =>{
  
  const navigate=useNavigate()
  return (
  
  <>
    {open && (
      <div className="fixed inset-0 bg-slate-900/50 z-30 lg:hidden backdrop-blur-sm" onClick={onClose} />
    )}
    <aside className={`fixed top-0 left-0 h-full z-40 w-64 flex flex-col
      bg-gradient-to-b from-blue-950 via-blue-900 to-blue-950 shadow-2xl
      transition-transform duration-300 ease-in-out
      ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>

      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-blue-800/60">
        <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center shrink-0">
          <GraduationCap size={20} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm leading-tight truncate">Muhoroni Bursary</p>
          <p className="text-blue-400 text-[10px] font-medium">Admin Portal</p>
        </div>
        <button onClick={onClose} className="lg:hidden text-blue-400 hover:text-white transition-colors shrink-0">
          <X size={17} />
        </button>
      </div>

      {/* Location badge */}
      <div className="mx-3 mt-3 px-3 py-2 bg-blue-800/40 rounded-xl border border-blue-700/40 flex items-center gap-2">
        <MapPin size={11} className="text-blue-300 shrink-0" />
        <div className="min-w-0">
          <p className="text-blue-200 text-[10px] font-semibold leading-tight truncate">Muhoroni Constituency</p>
          <p className="text-blue-400 text-[9px] leading-tight">Kisumu County · 5 Wards</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        <p className="text-blue-500 text-[9px] font-bold uppercase tracking-widest px-3 mb-3">Main Menu</p>
        {navItems.map(({ icon: Icon, label, badge,path }) => {
          const isActive = activeNav === label;
          return (
            <button key={label}
              onClick={() => { setActiveNav(label); navigate(path); onClose(); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                ${isActive
                  ? "bg-blue-600/70 text-white shadow-lg shadow-blue-900/40"
                  : "text-blue-200 hover:bg-white/10 hover:text-white"}`}>
              <Icon size={16} className={isActive ? "text-blue-200" : "text-blue-400"} />
              <span className="flex-1 text-left">{label}</span>
              {badge != null && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full
                  ${isActive ? "bg-blue-400/30 text-blue-100" : "bg-blue-800 text-blue-300"}`}>
                  {badge >= 1000 ? `${(badge / 1000).toFixed(1)}k` : badge}
                </span>
              )}
              {isActive && <ChevronRight size={13} className="text-blue-300 shrink-0" />}
            </button>
          );
        })}
      </nav>

      {/* System status */}
      <div className="px-4 pb-5">
        <div className="bg-blue-800/40 rounded-xl p-3 border border-blue-700/40">
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-emerald-400 text-xs font-semibold">System Online</span>
          </div>
          <p className="text-blue-400 text-[10px]">v2.4.1 · Muhoroni NGCDF Fund</p>
        </div>
      </div>
    </aside>
  </>
)};

// ─── Navbar ───────────────────────────────────────────────────────────────────
const Navbar = ({  onMenuClick,
  selectedYear,
  setSelectedYear,
  financialYears,}) => {
  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-sm">
      <div className="flex items-center gap-3 px-4 lg:px-6 h-16">
        <button onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors">
          <Menu size={20} />
        </button>

        <div className="lg:hidden flex items-center gap-2">
          <GraduationCap size={17} className="text-blue-700" />
          <span className="font-bold text-blue-900 text-sm">Muhoroni Bursary</span>
        </div>
          <div className="hidden sm:flex flex-1 justify-center items-center gap-6">
            <p className="text-blue-600 font-bold">Select Finacial Year</p>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-white border border-blue-200 rounded-xl px-4 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-200"
          >
            {financialYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
};

// ─── Ward Bar Chart 
// Each ward: { name, applicants, approved, rejected, underReview }
const WardBarChart = ({ data, loading,financialYear }) => {
  const [metric, setMetric] = useState("applicants");

  const metricConfig = {
    applicants:  { color: "#1d4ed8", label: "Total Applicants" },
    approved:    { color: "#10b981", label: "Approved"         },
    rejected:    { color: "#ef4444", label: "Rejected"         },
    underReview: { color: "#8b5cf6", label: "Under Review"     },
  };

  if (loading) return <Skeleton className="h-96" />;

  return (
    <div className="bg-white rounded-2xl border border-blue-100 p-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
        <div>
          <h3 className="font-bold text-slate-800 text-base">Applications by Ward</h3>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
            <MapPin size={11} className="text-blue-500" />
            Muhoroni Constituency · 5 Wards · Kisumu County ·{financialYear}
          </p>
        </div>
        {/* Metric toggle */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-100 rounded-xl p-1 shrink-0">
          {Object.entries(metricConfig).map(([key, cfg]) => (
            <button key={key} onClick={() => setMetric(key)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-150
                ${metric === key ? "bg-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              style={metric === key ? { color: cfg.color } : {}}>
              {cfg.label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 15, left: -10, bottom: 55 }} barCategoryGap="35%">
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="name"
            tick={{ fontSize: 11, fill: "#475569", fontWeight: 600 }}
            axisLine={false} tickLine={false}
            angle={-35} textAnchor="end" interval={0} />
          <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: "#eff6ff", radius: 6 }}
            contentStyle={{
              borderRadius: 12, border: "1px solid #e2e8f0",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)", fontSize: 12, padding: "10px 14px",
            }}
            formatter={(v) => [v.toLocaleString(), metricConfig[metric]?.label]}
          />
          <Bar dataKey={metric} fill={metricConfig[metric].color}
            radius={[7, 7, 0, 0]} maxBarSize={56}>
            {data?.map((_, i) => (
              <Cell key={i} fill={metricConfig[metric].color}
                fillOpacity={0.75 + (i % 3) * 0.08} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Summary totals */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-100">
        {[
          { label: "Total Applicants", value: data?.reduce((s, r) => s + r.applicants,  0), color: "text-blue-700",    bg: "bg-blue-50"    },
          { label: "Approved",         value: data?.reduce((s, r) => s + r.approved,    0), color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Rejected",         value: data?.reduce((s, r) => s + r.rejected,    0), color: "text-red-500",     bg: "bg-red-50"     },
          { label: "Under Review",     value: data?.reduce((s, r) => s + r.underReview, 0), color: "text-purple-600",  bg: "bg-purple-50"  },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`text-center py-3 px-2 rounded-xl ${bg}`}>
            <p className={`text-xl font-extrabold ${color}`}>{value?.toLocaleString()}</p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Status Pie Chart ─────────────────────────────────────────────────────────

const StatusPieChart = ({ data, loading }) => {
  if (loading) return <Skeleton className="h-72" />;

  const filtered = data?.filter(d => d.value > 0) || [];
  const total    = filtered.reduce((s, d) => s + d.value, 0) || 1;
  const RADIAN   = Math.PI / 180;

  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null;
    const r = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + r * Math.cos(-midAngle * RADIAN);
    const y = cy + r * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
        fontSize={11} fontWeight="700">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-blue-100 p-5 shadow-sm">
      <h3 className="font-bold text-slate-800 text-base mb-0.5">Status Distribution</h3>
      <p className="text-xs text-slate-500 mb-4">Overall application portfolio breakdown</p>

      <ResponsiveContainer width="100%" height={210}>
        <PieChart>
          <Pie data={filtered} cx="50%" cy="50%"
            innerRadius={55} outerRadius={90}
            dataKey="value" labelLine={false} label={renderLabel}>
            {filtered.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }}
            formatter={(v) => [v.toLocaleString(), "Applications"]}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-4 space-y-2.5 border-t border-slate-100 pt-4">
        {filtered.map(s => (
          <div key={s.name} className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
            <span className="text-xs text-slate-600 font-medium flex-1">{s.name}</span>
            <span className="text-xs font-bold text-slate-800">{s.value.toLocaleString()}</span>
            <span className="text-[10px] text-slate-400 w-10 text-right font-medium">
              {((s.value / total) * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Ward Leaderboard ─────────────────────────────────────────────────────────
// Fetched from GET /api/admin/analytics → data.wards
const WardLeaderboard = ({ data, loading }) => {
  if (loading) return <Skeleton className="h-72" />;

  const sorted = [...(data || [])].sort((a, b) => b.applicants - a.applicants);
  const max    = sorted[0]?.applicants || 1;

  return (
    <div className="bg-white rounded-2xl border border-blue-100 p-5 shadow-sm">
      <h3 className="font-bold text-slate-800 text-base mb-0.5">Ward Rankings</h3>
      <p className="text-xs text-slate-500 mb-5">All 5 wards · ranked by applicants</p>

      <div className="space-y-4">
        {sorted.map((w, i) => {
          const pct          = Math.round((w.applicants / max) * 100);
          const approvalRate = Math.round((w.approved / w.applicants) * 100);
          return (
            <div key={w.name}>
              <div className="flex items-center justify-between mb-1.5 gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0
                    ${i === 0 ? "bg-blue-600 text-white"
                      : i === 1 ? "bg-blue-300 text-blue-900"
                      : i === 2 ? "bg-blue-100 text-blue-700"
                      : "bg-slate-100 text-slate-400"}`}>
                    {i + 1}
                  </span>
                  <span className="text-sm font-semibold text-slate-700 truncate">{w.name}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold shrink-0">
                  <span className="text-blue-700">{w.applicants}</span>
                  <span className="text-emerald-600">{w.approved}</span>
                  <span className="text-red-500">{w.rejected}</span>
                  <span className="text-slate-400 font-medium text-[10px]">{approvalRate}%</span>
                </div>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${pct}%`,
                    background: i === 0
                      ? "linear-gradient(90deg,#1d4ed8,#3b82f6)"
                      : i === 1
                      ? "linear-gradient(90deg,#2563eb,#60a5fa)"
                      : i === 2
                      ? "linear-gradient(90deg,#3b82f6,#93c5fd)"
                      : "linear-gradient(90deg,#60a5fa,#bfdbfe)",
                  }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end gap-4 mt-5 pt-3 border-t border-slate-100">
        {[
          { color: "bg-blue-600",    label: "Total"    },
          { color: "bg-emerald-500", label: "Approved" },
          { color: "bg-red-500",     label: "Rejected" },
          { color: "bg-slate-300",   label: "Rate"     },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${color}`} />
            <span className="text-[10px] text-slate-500 font-medium">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// @description amount quick stats
const AllocationStats = ({ applicants}) => {
  const stats = useMemo(() => {
    const wardTotals = {};
    let totalAllocated = 0;

      applicants.forEach((app) => {
      const ward = app.ward || "Unknown Ward";
      const amount = Number(app.ApprovedAmount) || 0;

      totalAllocated += amount;

      wardTotals[ward] = (wardTotals[ward] || 0) + amount;
    });

    return {
      totalAllocated,
      wardTotals,
    };
  }, [applicants]);

  const wardStats = Object.entries(stats.wardTotals);

  const colors = [
    "from-blue-600 to-blue-800",
    "from-emerald-600 to-emerald-800",
    "from-purple-600 to-purple-800",
    "from-amber-500 to-orange-600",
    "from-rose-500 to-red-700",
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="mb-5">
        <h3 className="text-lg font-bold text-slate-800">
          Allocation Statistics
        </h3>
        <p className="text-sm text-slate-500">
          Funds distributed across wards
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">

        {/* TOTAL ALLOCATION */}
        <div className="lg:col-span-2 bg-gradient-to-br from-blue-700 to-blue-900 text-white rounded-2xl p-5 shadow-lg">
          <p className="text-blue-100 text-sm font-medium">
            Total Allocated
          </p>

          <h2 className="text-3xl font-extrabold mt-2">
            KES {stats.totalAllocated.toLocaleString()}
          </h2>

          <p className="text-blue-200 text-xs mt-2">
            Total bursary funds allocated
          </p>
        </div>

        {/* WARD ALLOCATIONS */}
        {wardStats.map(([ward, amount], index) => (
          <div
            key={ward}
            className={`bg-gradient-to-br ${
              colors[index % colors.length]
            } text-white rounded-2xl p-4 shadow-md hover:scale-[1.02] transition`}
          >
            <p className="text-xs opacity-80 truncate">
              {ward}
            </p>

            <h3 className="text-xl font-bold mt-2">
              KES {amount.toLocaleString()}
            </h3>

            <p className="text-[11px] opacity-70 mt-1">
              Ward Allocation
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// @description .....................................this the main function that is rendered
export default function BursaryDashboard() {
  //data from rtk query and back_end
  const userInfor=useSelector((state)=>state.auth.userInfor)
  const {data:applicantsData,isLoading:applicantsLoading,isError:applicantsError}=useApplicantsQuery()
  const applicants=applicantsData?.data||[]

  const [selectedYear, setSelectedYear] = useState("All");
  const financialYears = useMemo(() => {
  const years = [
    ...new Set(
      applicants
        .map(app => app.financialYear?.trim())
        .filter(Boolean)
    ),
  ];

  return ["All", ...years];
}, [applicants]);

const filteredApplicants = useMemo(() => {
  if (selectedYear === "All") return applicants;

  return applicants.filter(
    app => app.financialYear === selectedYear
  );
}, [applicants, selectedYear]);

  console.log("applicants",applicants)

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav,   setActiveNav]   = useState("Dashboard");

  //live stats from the back_end
    const stats = useMemo(() => {
      const total = filteredApplicants.length;

      const approved = filteredApplicants.filter(a => a.status === "Approved").length;
      const rejected = filteredApplicants.filter(a => a.status === "Rejected").length;
      const pending = filteredApplicants.filter(a =>
        a.status === "Pending" || a.status === "Under-Review"
      ).length;

      return {
        totalApplications: { value: total, trend: 0 },
        pendingReviews: { value: pending, trend: 0 },
        approvedApplications: { value: approved, trend: 0 },
        rejectedApplications: { value: rejected, trend: 0 },
        fundsDisbursed: { value: approved * 15000, trend: 0 },
      };
    }, [filteredApplicants]);
      //live data for the words
     const analytics = useMemo(() => {
        const wardMap = {};

        filteredApplicants.forEach((app) => {
          const ward = app.ward || "Unknown";

          if (!wardMap[ward]) {
            wardMap[ward] = {
              name: ward,
              applicants: 0,
              approved: 0,
              rejected: 0,
              underReview: 0,
            };
          }

          wardMap[ward].applicants++;

          switch (app.status) {
            case "Approved":
              wardMap[ward].approved++;
              break;
            case "Rejected":
              wardMap[ward].rejected++;
              break;
            default:
              wardMap[ward].underReview++;
          }
        });

        const wards = Object.values(wardMap);

        return {
          wards,
          statusBreakdown: [
            { name: "Approved", value: wards.reduce((a,b)=>a+b.approved,0), color:"#1d4ed8" },
            { name: "Pending", value: wards.reduce((a,b)=>a+b.underReview,0), color:"#f59e0b" },
            { name: "Rejected", value: wards.reduce((a,b)=>a+b.rejected,0), color:"#ef4444" },
          ],
        };
      }, [filteredApplicants]);

  const fetchData = useCallback(async (key, endpoint, setter) => {
    setLoading(p => ({ ...p, [key]: true }));
    setErrors(p  => ({ ...p,  [key]: null }));
    try {
      const data = await apiService.get(endpoint);
      setter(data);
    } catch (e) {
      setErrors(p => ({ ...p, [key]: e.message }));
    } finally {
      setLoading(p => ({ ...p, [key]: false }));
    }
  }, []);
  //place holders
  const loading = {
  profile: false,
  notifications: false,
};

const financialYear =
  selectedYear === "All"
    ? "All Financial Years Included"
    : selectedYear;
  
  return (
    <div className="min-h-screen bg-[#f4f6fb] font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)}
        activeNav={activeNav} setActiveNav={setActiveNav} />

      <div className="lg:pl-64 flex flex-col min-h-screen">
       <Navbar
            onMenuClick={() => setSidebarOpen(true)}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            financialYears={financialYears}
          />

        <main className="flex-1 p-4 lg:p-6 space-y-5 max-w-screen-2xl mx-auto w-full">

          {/* Welcome Banner */}
          <div className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4
            bg-gradient-to-r from-blue-800 via-blue-700 to-blue-900 rounded-2xl px-6 py-5 shadow-lg shadow-blue-300/30">
            {/* Decorative blobs */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/5 rounded-full" />
            <div className="absolute bottom-0 right-20 w-20 h-20 bg-white/5 rounded-full" />

            <div className="relative">
              <h1 className="text-xl font-extrabold text-white leading-tight">
                Welcome back, {loading.profile ? "Admin" :userInfor.firstName} 👋
              </h1>
              <p className="text-blue-200 text-sm mt-1">
                Manage bursary applications across all 5 wards of Muhoroni Constituency.
              </p>
            </div>

            <div className="relative flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 shrink-0">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <div className="text-xs">
                <span className="text-white font-semibold">Live · {financialYear}</span>
                <span className="text-blue-300 mx-1.5">·</span>
                <span className="text-blue-200">Muhoroni Constituency</span>
                <span className="text-blue-300 mx-1.5">·</span>
                <span className="text-blue-200">Kisumu County</span>
              </div>
            </div>
          </div>

          {/* Ward Bar Chart – full width */}
          <WardBarChart data={analytics?.wards} loading={loading.analytics} financialYear={financialYear} />

          {/* Status Pie + Ward Leaderboard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <StatusPieChart data={analytics?.statusBreakdown} loading={loading.analytics} />
            <WardLeaderboard data={analytics?.wards}          loading={loading.analytics} />
          </div>

          {/* Allocated amount stats */}
           <AllocationStats applicants={filteredApplicants} />

          {/* Footer */}
          <div className="text-center pb-4 pt-2 text-xs text-slate-400 border-t border-slate-200/60">
            © 2026 Muhoroni Constituency Bursary Fund · Kisumu County Government .version 2.4.1
          </div>
        </main>
      </div>
    </div>
  );
}
