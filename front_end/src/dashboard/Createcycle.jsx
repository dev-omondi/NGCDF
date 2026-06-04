
import { useState } from "react";
import { CalendarDays, Wallet, Loader2 } from "lucide-react";
import { useCreatecycleMutation } from "@/cycleRedux/cycleBase.js";
import { toast } from "react-hot-toast";

const Createcycle = () => {
  const [createCycle, { isLoading }] = useCreatecycleMutation();

  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState({
    financialYear:"",
    openningDate: "",
    closingDate: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.financialYear ||
      !formData.openningDate ||
      !formData.closingDate
    ) {
      return toast.error("All fields are required");
    }

    if (
      new Date(formData.openningDate) >=
      new Date(formData.closingDate)
    ) {
      return toast.error(
        "Closing date must be after opening date"
      );
    }

    try {
      await createCycle(formData).unwrap();

      toast.success("Application cycle created successfully");

      setFormData({
        financialYear:"",
        openningDate: "",
        closingDate: "",
      });
    } catch (error) {
      toast.error(
        error?.data?.message || "Failed to create cycle"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 ">
      <div className="max-w-4xl mx-auto ">
        {/* Header */}
        <div className="mb-8 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold text-slate-900">
            Create Application Cycle
          </h1>
          <p className="mt-2 text-slate-600">
            Configure a new bursary application period for a
            financial year.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800">
              Cycle Information
            </h2>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-6 space-y-6"
          >
            {/* Financial Year */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Financial Year
              </label>

              <div className="relative">
                <Wallet
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  name="financialYear"
                  value={formData.financialYear}
                  onChange={handleChange}
                  placeholder="2027"
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Opening */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Opening Date
                </label>

                <div className="relative">
                  <CalendarDays
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="datetime-local"
                    name="openningDate"
                    value={formData.openningDate}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Closing */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Closing Date
                </label>
                <div className="relative">
                  <CalendarDays
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="datetime-local"
                    name="closingDate"
                    value={formData.closingDate}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm text-blue-700">
                Only one application cycle can remain open at a
                time. Creating a new cycle will fail if another
                active cycle already exists.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row justify-center gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                className="px-5 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Creating...
                  </>
                ) : (
                  "Create Cycle"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Createcycle;