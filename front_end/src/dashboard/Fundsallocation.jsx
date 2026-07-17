import { useState } from "react";
import {
  useApplicantsQuery,
  useUpdateAmountMutation,
} from "@/applicationRedux/baseAppslice";
import { useNavigate } from "react-router-dom";
import { NumericFormat } from "react-number-format";

import {
  Search,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Wallet,
  Filter,
} from "lucide-react";

const Fundsallocation = () => {
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [search, setSearch] = useState("");
  const [cycleName, setCycleName] = useState("all");
  const [page, setPage] = useState(1);

  const [selectedApp, setSelectedApp] = useState(null);
  const [amount, setAmount] = useState(null);
  const [financialYear, setFinancialYear] = useState("all");
  const navigate = useNavigate();

  const { data, isLoading, isError,refetch } = useApplicantsQuery({
    status,
    page,
    financialYear,
    limit: 40,
  });

  const [updateAmount] = useUpdateAmountMutation();
 
  const applicants = data?.data || [];
  const financialYears = [
    "all",
    ...new Set(applicants.map((app) => app.financialYear).filter(Boolean))
  ];
    
  const cycleNames=[
  "all",
  ...new Set(applicants.map((app)=>app.cycleName).filter(Boolean))
  ]

  // FILTER LOGIC
  const filtered = applicants?.filter((app) => {
    const q = search.toLowerCase();

    const matchesSearch =
      app.fullName?.toLowerCase().includes(q) ||
      app.idNo?.toLowerCase().includes(q) ||
      app.institutionName?.toLowerCase().includes(q)
    const matchesStatus =
      status === "all" ? true : app.status?.toLowerCase() === status;

    const matchesType =
      type === "all"
        ? true
        : app.burSaryType?.toLowerCase() === type;

    const matchesYear =
     financialYear === "all"
    ? true
    : app.financialYear === financialYear;

    const matchesCycle =
    cycleName === "all"
    ? true
    : app.cycleName === cycleName;
    

    return matchesSearch && matchesStatus && matchesType&&matchesYear&&matchesCycle;
  });

  // OPEN MODAL
  const openEditModal = (app) => {
    setSelectedApp(app);
    setAmount(app.ApprovedAmount || 0);
  };

  // UPDATES
  const handleUpdate = async () => {
    if (!selectedApp) return;
    
    await updateAmount({
      id:selectedApp._id,
      ApprovedAmount:Number(amount)
    }).unwrap();

    await refetch()
    setSelectedApp(null);
  };

  const tabs = [
    { key: "all", label: "All", icon: Users },
    { key: "pending", label: "Pending", icon: Clock },
    { key: "approved", label: "Approved", icon: CheckCircle },
    { key: "rejected", label: "Rejected", icon: XCircle },
  ];
  const sortedApplicants = [...filtered].sort((a, b) => {
  return (a.ApprovedAmount || 0) - (b.ApprovedAmount || 0);
});

  return (
    <div className="min-h-screen bg-slate-100">
      {/* HEADER */}
      <div className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-5">
          {/* TITLE */}
          <div className="flex flex-col lg:flex-row justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Funds Allocation Dashboard
              </h1>
              <p className="text-sm text-slate-500">
                Manage bursary & scholarship allocations efficiently
              </p>
            </div>

            {/* SEARCH */}
            <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl w-full lg:w-[320px]">
              <Search size={18} className="text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search applicants..."
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>
          </div>

          {/* FILTERS */}
          <div className="mt-5 flex flex-col items-center gap-4">

            {/* STATUS FILTER */}
            <div className="flex flex-wrap justify-center gap-2">
              {tabs.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.key}
                    onClick={() => setStatus(t.key)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition cursor-pointer
                      ${
                        status === t.key
                          ? "bg-blue-600 text-white"
                          : "bg-white hover:bg-slate-50"
                      }
                    `}
                  >
                    <Icon size={16} />
                    {t.label}
                  </button>
                );
              })}
            </div>

            {/* TYPE FILTER */}
          <div className="flex gap-8">
            <div className="flex items-center gap-2">
  <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
    <Filter size={16} />
    Type
  </div>

  <select
    value={type}
    onChange={(e) => setType(e.target.value)}
    className="
      px-4 py-2 rounded-xl border text-sm font-medium
      bg-white text-slate-700
      hover:bg-slate-50
      outline-none
      cursor-pointer
    "
  >
    <option value="all">All Types</option>
    <option value="bursary">Bursary</option>
    <option value="scholarship">Scholarship</option>
  </select>
</div>
                          {/* YEAR FILTER */}
              <div className="flex flex-wrap justify-center items-center gap-2">
                <Filter size={16} className="text-slate-500" />

                <select
                  value={financialYear}
                  onChange={(e) => setFinancialYear(e.target.value)}
                  className="px-4 py-2 rounded-xl border text-sm bg-white text-slate-700 cursor-pointer
                   hover:bg-slate-50 outline-none"
                >
                  {financialYears.map((year) => (
                    <option key={year} value={year}>
                      {year === "all" ? "All Years" : year}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                  <Filter size={16} />
                  Cycle
                </div>
              
                <select
                  value={cycleName}
                  onChange={(e) => setCycleName(e.target.value)}
                  className="
                    px-4 py-2 rounded-xl border text-sm font-medium
                    bg-white text-slate-700
                    hover:bg-slate-100
                    outline-none
                    cursor-pointer
                  "
                >
                  {cycleNames.map((cycle) => (
                    <option key={cycle} value={cycle}>
                      {cycle === "all" ? "All Cycles" : cycle}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto p-4 lg:p-6">

        {/* LOADING */}
        {isLoading && (
          <div className="bg-white p-6 rounded-xl">
            Loading applicants...
          </div>
        )}

        {/* ERROR */}
        {isError && (
          <div className="bg-red-100 text-red-600 p-6 rounded-xl">
            Failed to load applicants
          </div>
        )}

        {/* DATA */}
        {!isLoading && !isError && (
          <div className="bg-white rounded-2xl border overflow-hidden shadow-sm">

            {/* DESKTOP TABLE */}
            <div className="w-full overflow-x-auto">
            <div className="min-w-[1000px]">
              <table className="w-full text-sm border-collapse">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">#</th>
                  <th className="p-4 text-left w-[18%]">Name</th>
                  <th className="p-4 text-left w-[20%]">Institution</th>
                  <th className="p-4 text-left w-[12%]">Type</th>
                  <th className="p-4 text-left w-[12%]">Status</th>
                  <th className="p-4 text-left w-[16%]">Allocation</th>
                  <th className="p-4 text-left w-[10%]">Action</th>
                </tr>
              </thead>

                  <tbody>
  {sortedApplicants?.map((app, index) => (
    <tr key={app._id} className="border-t hover:bg-slate-50 align-middle">
      <td className="p-2">{index + 1}</td>
      <td className="p-2 truncate">{app.fullName}</td>
      <td className="p-2 truncate">{app.institutionName}</td>
      <td className="p-2 capitalize">{app.burSaryType}</td>
      <td className="p-2">{app.status}</td>
      <td className="p-2 font-semibold whitespace-nowrap">
        KES {app.ApprovedAmount?.toLocaleString() || 0}
      </td>
      <td className="p-2">
        <button
          onClick={() => openEditModal(app)}
          className="bg-green-600 text-white px-3 py-1 rounded-lg"
        >
          <Wallet size={24} />
        </button>
      </td>
    </tr>
  ))}
</tbody>
        </table>
            </div>
          </div>
          </div>
        )}
      </div>

      {/* MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/60 flex pt-10 justify-center  z-50">
        <div className="bg-white w-full max-w-3xl h-[60dvh] p-2  sm:h-[95vh] flex flex-col rounded sm:rounded-2xl shadow-xl overflow-hidden">
      {/* HEADER */}
      <div className="p-4 border-b bg-slate-50">
        <h2 className="text-xl font-bold text-slate-800">
          Review & Update Allocation
        </h2>
        <p className="text-sm text-slate-500">
          {selectedApp.fullName}
        </p>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">

        {/* REMARKS SECTION (TOP PRIORITY) */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">
            Applicant Remarks
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            {selectedApp.remarks || "No remarks provided by applicant."}
          </p>
        </div>

        {/* CURRENT DETAILS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="bg-slate-100 p-3 rounded-xl">
            <p className="text-slate-500">Institution</p>
            <p className="font-medium">{selectedApp.institutionName}</p>
          </div>
          <div className="bg-slate-100 p-3 rounded-xl">
            <p className="text-slate-500">Type</p>
            <p className="font-medium capitalize">
              {selectedApp.burSaryType}
            </p>
          </div>
        </div>
        {/* UPDATE INPUT */}
        <div>
          <label className="text-sm font-medium text-slate-700">
            Update Approved Amount
          </label>
          <NumericFormat
            value={amount}
            onValueChange={(values) => setAmount(values.floatValue || 0)}
            thousandSeparator
            prefix="KES "
            allowNegative={false}
            className="w-full border rounded-xl p-4 mt-2 focus:ring-2 focus:ring-blue-500 outline-none text-lg"
            placeholder="Enter approved amount"
          />
        </div>
      </div>
      {/* FOOTER */}
     <div className="p-4 border-t bg-white flex flex-col sm:flex-row gap-3 justify-end sticky bottom-0 z-10">
        <button
          onClick={() => setSelectedApp(null)}
          className="px-4 py-3 bg-slate-200 rounded-xl  sm:w-auto"
        >
          Cancel
        </button>

        <button
          onClick={handleUpdate}
          className="px-4 py-3 bg-blue-600 text-white rounded-xl w sm:w-auto"
        >
          Save Changes
        </button>
      </div>
    </div>
    </div>
          )}
    </div>
  );
};

export default Fundsallocation;