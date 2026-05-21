import { useState } from "react";
import { useApplicantsQuery } from "@/applicationRedux/baseAppslice";
import {
  Search,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Wallet,
  ClipboardCheck,
} from "lucide-react";

const ApplicantsPage = () => {
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [page,setPage]=useState(1)

  // BACKEND FILTER
  const { data, isLoading, isError } =
    useApplicantsQuery({status,page,limit:20});
    console.log(data)

    const applicants=data?.data||[]

    console.log("applicants",applicants)

  // SEARCH FILTER
  const filtered = applicants?.filter((app) => {
    const q = search.toLowerCase();

    return (
      app.fullName?.toLowerCase().includes(q) ||
      app.idNo?.toLowerCase().includes(q) ||
      app.institutionName?.toLowerCase().includes(q) ||
      app.ward?.toLowerCase().includes(q)
    );
  });

  // TOP NAVIGATION
  const navLinks = [
    {
      label: "Funds Allocation",
      icon: Wallet,
    },
    {
      label: "Evaluate Applicants",
      icon: ClipboardCheck,
    },
  ];

  // STATUS FILTERS
  const tabs = [
    {
      key: "all",
      label: "All Applicants",
      icon: Users,
    },
    {
      key: "pending",
      label: "Pending",
      icon: Clock,
    },
    {
      key: "approved",
      label: "Approved",
      icon: CheckCircle,
    },
    {
      key: "rejected",
      label: "Rejected",
      icon: XCircle,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100">

      {/* HEADER */}
      <div className="bg-white border-b sticky top-0 z-20 shadow-sm">

        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-5">

          {/* TOP SECTION */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            {/* TITLE */}
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">
                Applicants Management
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                Manage evaluations, approvals and bursary allocations
              </p>
            </div>

            {/* SEARCH */}
            <div className="w-full lg:w-[420px]">
              <div className="flex items-center gap-3 bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3">
                <Search size={18} className="text-slate-500 shrink-0" />

                <input
                  type="text"
                  placeholder="Search applicants..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent outline-none w-full text-sm"
                />
              </div>
            </div>
          </div>

          {/* CENTER NAVIGATION + FILTERS */}
          <div className="flex justify-center mt-6">

            <div className="flex flex-wrap items-center justify-center gap-3">

              {/* NAVIGATION */}
              {navLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <button
                    key={link.label}
                    className="
                      flex items-center gap-2
                      px-5 py-2.5
                      rounded-xl
                      bg-white
                      border
                      text-slate-700
                      hover:bg-slate-100
                      transition
                      text-sm
                      font-medium
                    "
                  >
                    <Icon size={16} />
                    {link.label}
                  </button>
                );
              })}

              {/* STATUS FILTERS */}
              {tabs.map((tab) => {
                const Icon = tab.icon;

                return (
                  <button
                    key={tab.key}
                    onClick={() => setStatus(tab.key)}
                    className={`
                      flex items-center gap-2
                      px-5 py-2.5
                      rounded-xl
                      border
                      text-sm
                      font-medium
                      transition
                      ${
                        status === tab.key
                          ? "bg-blue-600 text-white border-blue-600 shadow-md"
                          : "bg-white text-slate-700 hover:bg-slate-100"
                      }
                    `}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* PAGE CONTENT */}
      <div className="max-w-7xl mx-auto p-4 lg:p-6">

        {/* LOADING */}
        {isLoading && (
          <div className="bg-white rounded-2xl border p-6 text-slate-500 shadow-sm">
            Loading applicants...
          </div>
        )}

        {/* ERROR */}
        {isError && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-6">
            Failed to load applicants
          </div>
        )}

        {/* TABLE */}
        {!isLoading && !isError && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

            {/* TABLE HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-5 border-b bg-slate-50">

              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Applicants Records
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Total Applicants: {filtered?.length || 0}
                </p>
              </div>

              <div className="text-sm text-slate-400">
                Muhoroni Bursary Management System
              </div>
            </div>

            {/* RESPONSIVE TABLE */}
            <div className="overflow-x-auto">

              <table className="min-w-full text-sm">

                {/* TABLE HEADER */}
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">#</th>

                    <th className="px-6 py-4 text-left font-semibold">
                      Applicant
                    </th>

                    <th className="px-6 py-4 text-left font-semibold">
                      ID Number
                    </th>

                    <th className="px-6 py-4 text-left font-semibold">
                      Institution
                    </th>

                    <th className="px-6 py-4 text-left font-semibold">
                      Ward
                    </th>

                    <th className="px-6 py-4 text-left font-semibold">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left font-semibold">
                      Allocation
                    </th>
                  </tr>
                </thead>

                {/* TABLE BODY */}
                <tbody>

                  {filtered?.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-16 text-slate-400"
                      >
                        No applicants found
                      </td>
                    </tr>
                  )}

                  {filtered?.map((app, index) => (
                    <tr
                      key={app._id}
                      className="
                        border-t
                        hover:bg-slate-50
                        transition
                      "
                    >
                      {/* NUMBER */}
                      <td className="px-6 py-5 text-slate-500 font-medium">
                        {index + 1}
                      </td>

                      {/* NAME */}
                      <td className="px-6 py-5">
                        <div className="font-semibold text-slate-800">
                          {app.fullName}
                        </div>
                      </td>

                      {/* ID */}
                      <td className="px-6 py-5 text-slate-600">
                        {app.idNo}
                      </td>

                      {/* INSTITUTION */}
                      <td className="px-6 py-5 text-slate-600">
                        {app.institutionName}
                      </td>

                      {/* WARD */}
                      <td className="px-6 py-5 text-slate-600">
                        {app.ward}
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-5">
                        <span
                          className={`
                            px-3 py-1.5
                            rounded-full
                            text-xs
                            font-semibold
                            ${
                              app.status === "approved"
                                ? "bg-green-100 text-green-700"
                                : app.status === "rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }
                          `}
                        >
                          {app.status || "pending"}
                        </span>
                      </td>

                      {/* ALLOCATION */}
                      <td className="px-6 py-5 font-semibold text-slate-700">
                        {app.allocatedAmount
                          ? `KES ${app.allocatedAmount.toLocaleString()}`
                          : "KES 0"}
                      </td>
                    </tr>
                  ))}

                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantsPage;