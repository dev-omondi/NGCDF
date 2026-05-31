
import { useNavigate } from "react-router-dom";
import { useGetcyclesQuery} from "@/cycleRedux/cycleBase.js";
import { Eye, Calendar, CalendarCheck, CalendarX } from "lucide-react";

const CyclesPage = () => {
  const navigate = useNavigate();
  const { data: cycles, isLoading, isError } =useGetcyclesQuery();
  const getStatusStyle = (status) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-700 border-green-200";
      case "closed":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "open":
        return <CalendarCheck size={16} />;
      case "closed":
        return <CalendarX size={16} />;
      default:
        return <Calendar size={16} />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-40 bg-slate-200 animate-pulse rounded-2xl"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-red-600">
        Failed to load cycles. Try again later.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-10">
      {/* Header */}
      <div className="mb-6 flex flex-col items-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Application Cycles
        </h1>
        <p className="text-slate-600 mt-1">
          Manage bursary application cycles for each financial year.
        </p>
      </div>

      {/* Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cycles?.map((cycle) => (
          <div
            key={cycle._id}
            className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden"
          >
            {/* Top Section */}
            <div className="p-5 space-y-3">
              {/* Status */}
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded border text-xs font-medium ${getStatusStyle(
                  cycle.status
                )}`}
              >
                {getStatusIcon(cycle.status)}
                {cycle.status}
              </div>

              {/* Financial Year */}
              <h2 className="text-xl font-bold text-slate-900">
                {cycle.financialYear}
              </h2>

              {/* Dates */}
              <div className="space-y-2 text-sm text-slate-600">
                <p>
                  <span className="font-medium text-slate-700">
                    Opening:
                  </span>{" "}
                  {new Date(cycle.openningDate).toLocaleDateString()}
                </p>

                <p>
                  <span className="font-medium text-slate-700">
                    Closing:
                  </span>{" "}
                  {new Date(cycle.closingDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 p-4 flex justify-center items-center">
              <button
                onClick={() =>
                  navigate(`/cycle/${cycle._id}`)
                }
                className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                <Eye size={16} />
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {cycles?.length === 0 && (
        <div className="text-center py-20 text-slate-500">
          No application cycles found.
        </div>
      )}
    </div>
  );
};

export default CyclesPage;