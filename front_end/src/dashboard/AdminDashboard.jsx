import { useState, useEffect, useCallback } from "react";
import {
  LayoutDashboard, FileText, Users, Clock, CheckCircle, XCircle,
  Wallet, BarChart2, Bell, Settings, LogOut, Search, ChevronDown,
  Menu, X, TrendingUp, TrendingDown, Download, Send, UserPlus, Eye,
  ChevronRight, Shield, Globe, GraduationCap, Banknote,
  CheckCircle2, AlertTriangle, Info, MapPin, RefreshCw
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { useApplicantsQuery } from "@/applicationRedux/baseAppslice";
// ─── API Service Layer ────────────────────────────────────────────────────────
// Set BASE_URL to your actual backend (e.g. https://api.muhoroni-bursary.go.ke)
// Uncomment the real fetch block and remove the mock block when backend is ready.
const BASE_URL = "/api/admin";
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const apiService = {
  async get(endpoint) {
    // ── REAL FETCH (uncomment when backend is live) ──────────────────────────
    // const token = localStorage.getItem("token");
    // const res = await fetch(endpoint, {
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${token}`,
    //   },
    // });
    // if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
    // return res.json();
    // ────────────────────────────────────────────────────────────────────────

    // ── MOCK DATA (remove when backend is live) ──────────────────────────────
    await delay(700 + Math.random() * 500);

    // Muhoroni Constituency has 6 wards:
    // Muhoroni/Koru, Miwani, Omugel/East Kano, Chemelil/Chemase, Fort Ternan, Songhor/Soba
    const mockData = {
      // GET /api/admin/profile
      [`${BASE_URL}/profile`]: {
        name: "Hon. Peter Odhiambo",
        role: "Bursary Fund Administrator",
        email: "p.odhiambo@muhoroni.go.ke",
        county: "Kisumu County",
        constituency: "Muhoroni Constituency",
      },

      // GET /api/admin/notifications
      [`${BASE_URL}/notifications`]: {
        unread: 5,
        items: [
          { id: 1, type: "new",      message: "New application from Grace Achieng – Miwani Ward",              time: "3m ago",  read: false },
          { id: 2, type: "approved", message: "Application #MHR-2024-0341 approved – Fort Ternan Ward",        time: "20m ago", read: false },
          { id: 3, type: "alert",    message: "Flagged: Incomplete transcripts for Kevin Otieno – Chemelil",   time: "2h ago",  read: false },
          { id: 4, type: "system",   message: "Q3 disbursement report is ready for download",                  time: "5h ago",  read: true  },
          { id: 5, type: "new",      message: "Batch upload: 23 new applications from Songhor/Soba Ward",      time: "1d ago",  read: true  },
        ],
      },

      // GET /api/admin/dashboard/stats
      [`${BASE_URL}/dashboard/stats`]: {
        totalApplications:    { value: 1_284, trend: +9.2  },
        pendingReviews:       { value: 218,   trend: -4.5  },
        approvedApplications: { value: 847,   trend: +11.3 },
        rejectedApplications: { value: 219,   trend: +2.1  },
        fundsDisbursed:       { value: 12_680_000, trend: +14.7 },
      },

      // GET /api/admin/analytics
      // shape: { wards: [{name,applicants,approved,rejected,underReview}], statusBreakdown: [...] }
      [`${BASE_URL}/analytics`]: {
        wards: [
          { name: "Muhoroni/Koru",      applicants: 287, approved: 198, rejected: 54, underReview: 35 },
          { name: "Miwani",             applicants: 213, approved: 141, rejected: 42, underReview: 30 },
          { name: "Omugel/East Kano",   applicants: 176, approved: 112, rejected: 38, underReview: 26 },
          { name: "Chemelil/Chemase",   applicants: 248, approved: 167, rejected: 49, underReview: 32 },
          { name: "Fort Ternan",        applicants: 194, approved: 134, rejected: 35, underReview: 25 },
          { name: "Songhor/Soba",       applicants: 166, approved: 95,  rejected: 31, underReview: 40 },
        ],
        statusBreakdown: [
          { name: "Approved",     value: 847, color: "#1d4ed8" },
          { name: "Pending",      value: 218, color: "#f59e0b" },
          { name: "Rejected",     value: 219, color: "#ef4444" },
          { name: "Under Review", value: 188, color: "#8b5cf6" },
        ],
      },
    };

    const result = mockData[endpoint];
    if (!result) throw new Error(`Endpoint not found: ${endpoint}`);
    return result;
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatCurrency = (v) =>
  v >= 1_000_000 ? `KES ${(v / 1_000_000).toFixed(2)}M` : `KES ${v?.toLocaleString()}`;

const notifTypeConfig = {
  new:     { icon: <FileText size={13} />,      bg: "bg-blue-100",  text: "text-blue-600"  },
  approved:{ icon: <CheckCircle2 size={13} />,  bg: "bg-green-100", text: "text-green-600" },
  alert:   { icon: <AlertTriangle size={13} />, bg: "bg-red-100",   text: "text-red-600"   },
  system:  { icon: <Info size={13} />,          bg: "bg-slate-100", text: "text-slate-600" },
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const Skeleton = ({ className = "" }) => (
  <div className={`rounded-xl ${className}`}
    style={{
      background: "linear-gradient(90deg,#eff6ff 25%,#dbeafe 50%,#eff6ff 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.8s ease-in-out infinite",
    }} />
);

// ─── Color map ────────────────────────────────────────────────────────────────
const colorMap = {
  blue:   { light: "bg-blue-50",    text: "text-blue-600",    border: "border-blue-100"    },
  amber:  { light: "bg-amber-50",   text: "text-amber-600",   border: "border-amber-100"   },
  green:  { light: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" },
  red:    { light: "bg-red-50",     text: "text-red-600",     border: "border-red-100"     },
  purple: { light: "bg-purple-50",  text: "text-purple-600",  border: "border-purple-100"  },
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, title, value, trend, color = "blue", loading, formatter }) => {
  const c  = colorMap[color];
  const up = trend >= 0;
  if (loading) return <Skeleton className="h-36" />;
  return (
    <div className={`bg-white rounded-2xl border ${c.border} p-5 hover:shadow-lg hover:shadow-blue-100/50 hover:-translate-y-0.5 transition-all duration-200 group`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${c.light} ${c.text} group-hover:scale-110 transition-transform duration-200`}>
          <Icon size={20} />
        </div>
        <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full
          ${up ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
          {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {Math.abs(trend)}%
        </span>
      </div>
      <p className="text-2xl font-extrabold text-slate-800 mb-1 tracking-tight">
        {formatter ? formatter(value) : value?.toLocaleString()}
      </p>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
    </div>
  );
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const navItems = [
  { icon: LayoutDashboard, label: "Dashboard"                         },
  { icon: FileText,        label: "Applications",  badge: 1284        },
  { icon: Users,           label: "Applicants"                        },
  { icon: Clock,           label: "Pending Reviews", badge: 218       },
  { icon: CheckCircle,     label: "Approved"                          },
  { icon: XCircle,         label: "Rejected"                          },
  { icon: Wallet,          label: "Disbursements"                     },
  { icon: BarChart2,       label: "Reports"                           },
  { icon: Bell,            label: "Notifications", badge: 5           },
  { icon: Settings,        label: "Settings"                          },
];

const Sidebar = ({ open, onClose, activeNav, setActiveNav }) => (
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
          <p className="text-blue-400 text-[9px] leading-tight">Kisumu County · 6 Wards</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        <p className="text-blue-500 text-[9px] font-bold uppercase tracking-widest px-3 mb-3">Main Menu</p>
        {navItems.map(({ icon: Icon, label, badge }) => {
          const isActive = activeNav === label;
          return (
            <button key={label}
              onClick={() => { setActiveNav(label); onClose(); }}
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
        <div className="pt-4 mt-3 border-t border-blue-800/60">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-blue-300 hover:bg-red-500/15 hover:text-red-300 transition-all">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      {/* System status */}
      <div className="px-4 pb-5">
        <div className="bg-blue-800/40 rounded-xl p-3 border border-blue-700/40">
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-emerald-400 text-xs font-semibold">System Online</span>
          </div>
          <p className="text-blue-400 text-[10px]">v2.4.1 · Muhoroni Bursary Fund</p>
        </div>
      </div>
    </aside>
  </>
);

// ─── Navbar ───────────────────────────────────────────────────────────────────
const Navbar = ({ onMenuClick, profile, notifications, profileLoading, notifLoading }) => {
  const [notifOpen,   setNotifOpen]   = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [search,      setSearch]      = useState("");

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

        {/* Search → GET /api/admin/search?q={search} */}
        <div className="hidden sm:flex flex-1 max-w-md items-center gap-2 bg-slate-50 border border-blue-100 rounded-xl px-4 py-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <Search size={15} className="text-slate-400 shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search applicants, wards, ref IDs…"
            className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none" />
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          {/* Bell → GET /api/admin/notifications */}
          <div className="relative">
            <button onClick={() => { setNotifOpen(v => !v); setProfileOpen(false); }}
              className="relative p-2.5 rounded-xl text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors">
              <Bell size={18} />
              {!notifLoading && notifications?.unread > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {notifications.unread}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-blue-100 rounded-2xl shadow-xl overflow-hidden z-50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                  <span className="font-bold text-slate-800 text-sm">Notifications</span>
                  <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full">
                    {notifications?.unread} unread
                  </span>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
                  {notifLoading
                    ? [...Array(3)].map((_, i) => (
                        <div key={i} className="p-4"><Skeleton className="h-10" /></div>
                      ))
                    : notifications?.items.map(n => {
                        const cfg = notifTypeConfig[n.type] || notifTypeConfig.system;
                        return (
                          <div key={n.id}
                            className={`flex gap-3 px-4 py-3 hover:bg-blue-50/50 cursor-pointer transition-colors ${!n.read ? "bg-blue-50/25" : ""}`}>
                            <div className={`shrink-0 p-1.5 rounded-lg ${cfg.bg} ${cfg.text} mt-0.5`}>{cfg.icon}</div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-slate-700 leading-relaxed line-clamp-2">{n.message}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">{n.time}</p>
                            </div>
                            {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5" />}
                          </div>
                        );
                      })}
                </div>
                <div className="px-4 py-2.5 border-t border-slate-100">
                  <button className="text-xs text-blue-600 font-semibold hover:text-blue-800 transition-colors">View all →</button>
                </div>
              </div>
            )}
          </div>

          {/* Profile → GET /api/admin/profile */}
          <div className="relative">
            <button onClick={() => { setProfileOpen(v => !v); setNotifOpen(false); }}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-blue-50 transition-colors">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-800 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {profileLoading ? "?" : profile?.name?.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-tight">
                  {profileLoading ? "Loading…" : profile?.name?.split(" ").slice(0, 2).join(" ")}
                </p>
                <p className="text-[10px] text-slate-400 leading-tight">
                  {profileLoading ? "" : profile?.role?.split(" ").slice(0, 2).join(" ")}
                </p>
              </div>
              <ChevronDown size={13} className="text-slate-400 hidden md:block" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-blue-100 rounded-2xl shadow-xl overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="font-bold text-slate-800 text-sm">{profile?.name}</p>
                  <p className="text-xs text-slate-500 truncate">{profile?.email}</p>
                  <p className="text-[10px] text-blue-500 font-semibold mt-0.5">{profile?.constituency}</p>
                </div>
                {[
                  { icon: Shield,   label: "My Profile"         },
                  { icon: Settings, label: "Settings"            },
                  { icon: Globe,    label: "Kisumu County Portal" },
                ].map(({ icon: Icon, label }) => (
                  <button key={label}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                    <Icon size={14} /> {label}
                  </button>
                ))}
                <div className="border-t border-slate-100">
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// ─── Ward Bar Chart ───────────────────────────────────────────────────────────
// Fetched from GET /api/admin/analytics → data.wards
// Each ward: { name, applicants, approved, rejected, underReview }
const WardBarChart = ({ data, loading }) => {
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
            Muhoroni Constituency · 6 Wards · Kisumu County · FY 2024/2025
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
// Fetched from GET /api/admin/analytics → data.statusBreakdown
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
      <p className="text-xs text-slate-500 mb-5">All 6 wards · ranked by applicants</p>

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

// ─── Quick Actions ────────────────────────────────────────────────────────────
const QuickActions = () => {
  const actions = [
    { icon: Eye,       label: "Review Applications", desc: "Process pending queue",   color: "blue"   },
    { icon: Download,  label: "Export Reports",       desc: "Download CSV or PDF",     color: "green"  },
    { icon: Send,      label: "Send Notifications",   desc: "Alert applicants",         color: "purple" },
    { icon: UserPlus,  label: "Add Administrator",    desc: "Manage system access",     color: "amber"  },
    { icon: RefreshCw, label: "Sync Data",            desc: "Pull latest backend data", color: "teal"   },
    { icon: BarChart2, label: "Full Analytics",       desc: "Detailed ward reports",    color: "indigo" },
  ];
  const btnColor = {
    blue:   "bg-blue-600   hover:bg-blue-700   shadow-blue-200",
    green:  "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200",
    purple: "bg-purple-600 hover:bg-purple-700 shadow-purple-200",
    amber:  "bg-amber-500  hover:bg-amber-600  shadow-amber-200",
    teal:   "bg-teal-600   hover:bg-teal-700   shadow-teal-200",
    indigo: "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200",
  };
  return (
    <div className="bg-white rounded-2xl border border-blue-100 p-5 shadow-sm">
      <h3 className="font-bold text-slate-800 text-base mb-0.5">Quick Actions</h3>
      <p className="text-xs text-slate-500 mb-4">Frequently used administrative operations</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {actions.map(({ icon: Icon, label, desc, color }) => (
          <button key={label}
            className={`flex flex-col items-start gap-2.5 p-4 rounded-xl text-white shadow-lg ${btnColor[color]} transition-all hover:scale-[1.03] hover:shadow-xl active:scale-100 duration-150`}>
            <Icon size={18} />
            <div>
              <p className="text-xs font-bold leading-tight">{label}</p>
              <p className="text-[10px] opacity-70 leading-tight mt-0.5">{desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function BursaryDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav,   setActiveNav]   = useState("Dashboard");

  const [profile,       setProfile]   = useState(null);
  const [notifications, setNotifs]    = useState(null);
  const [stats,         setStats]     = useState(null);
  const [analytics,     setAnalytics] = useState(null);

  const [loading, setLoading] = useState({
    profile: true, notifications: true, stats: true, analytics: true,
  });
  const [errors, setErrors] = useState({});

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

  useEffect(() => {
    fetchData("profile",       `${BASE_URL}/profile`,         setProfile);
    fetchData("notifications", `${BASE_URL}/notifications`,   setNotifs);
    fetchData("stats",         `${BASE_URL}/dashboard/stats`, setStats);
    fetchData("analytics",     `${BASE_URL}/analytics`,       setAnalytics);
  }, [fetchData]);

  const statCards = [
    { key: "totalApplications",    icon: FileText,    title: "Total Applications",    color: "blue",   formatter: null          },
    { key: "pendingReviews",       icon: Clock,       title: "Pending Reviews",       color: "amber",  formatter: null          },
    { key: "approvedApplications", icon: CheckCircle, title: "Approved Applications", color: "green",  formatter: null          },
    { key: "rejectedApplications", icon: XCircle,     title: "Rejected Applications", color: "red",    formatter: null          },
    { key: "fundsDisbursed",       icon: Banknote,    title: "Funds Disbursed",       color: "purple", formatter: formatCurrency },
  ];

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
          profile={profile}
          notifications={notifications}
          profileLoading={loading.profile}
          notifLoading={loading.notifications}
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
                Welcome back, {loading.profile ? "Admin" : profile?.name?.split(" ").slice(0, 2).join(" ")} 👋
              </h1>
              <p className="text-blue-200 text-sm mt-1">
                Manage bursary applications across all 6 wards of Muhoroni Constituency.
              </p>
            </div>

            <div className="relative flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 shrink-0">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <div className="text-xs">
                <span className="text-white font-semibold">Live · FY 2024/2025</span>
                <span className="text-blue-300 mx-1.5">·</span>
                <span className="text-blue-200">Muhoroni Constituency</span>
                <span className="text-blue-300 mx-1.5">·</span>
                <span className="text-blue-200">Kisumu County</span>
              </div>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {statCards.map(({ key, icon, title, color, formatter }) => (
              <StatCard key={key} icon={icon} title={title} color={color}
                formatter={formatter} loading={loading.stats}
                value={stats?.[key]?.value} trend={stats?.[key]?.trend} />
            ))}
          </div>

          {/* Ward Bar Chart – full width */}
          <WardBarChart data={analytics?.wards} loading={loading.analytics} />

          {/* Status Pie + Ward Leaderboard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <StatusPieChart data={analytics?.statusBreakdown} loading={loading.analytics} />
            <WardLeaderboard data={analytics?.wards}          loading={loading.analytics} />
          </div>

          {/* Quick Actions */}
          <QuickActions />

          {/* Footer */}
          <div className="text-center pb-4 pt-2 text-xs text-slate-400 border-t border-slate-200/60">
            © 2024 Muhoroni Constituency Bursary Fund · Kisumu County Government · Ministry of Education Kenya · v2.4.1
          </div>
        </main>
      </div>
    </div>
  );
}
