
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetCycleQuery,
  useUpdateCycleMutation,
  useDeleteCycleMutation,
} from "@/cycleRedux/cycleBase.js";

import { Loader2, Save, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";

const Cyclepage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: cycle, isLoading, isError } = useGetCycleQuery(id);

  const [updateCycle, { isLoading: isUpdating }] =
    useUpdateCycleMutation();

  const [deleteCycle, { isLoading: isDeleting }] =
    useDeleteCycleMutation();

  const [formData, setFormData] = useState({
    financialYear: "",
    openningDate: "",
    closingDate: "",
    status: "",
  });

  // Load data into form
  useEffect(() => {
    if (cycle) {
      setFormData({
        financialYear: cycle.financialYear || "",
        openningDate: cycle.openningDate
          ? cycle.openningDate.split("T")[0]
          : "",
        closingDate: cycle.closingDate
          ? cycle.closingDate.split("T")[0]
          : "",
        status: cycle.status || "upcoming",
      });
    }
  }, [cycle]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // UPDATE
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (
      new Date(formData.openningDate) >=
      new Date(formData.closingDate)
    ) {
      return toast.error("Closing date must be after opening date");
    }

    try {
      await updateCycle({ id,data:formData }).unwrap();
      toast.success("Cycle updated successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Update failed");
    }
  };

  // DELETE
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this cycle? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      await deleteCycle(id).unwrap();
      toast.success("Cycle deleted successfully");
      navigate("/admin/cycles");
    } catch (error) {
      toast.error(error?.data?.message || "Delete failed");
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 animate-pulse space-y-4">
        <div className="h-6 w-40 bg-slate-200 rounded" />
        <div className="h-40 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-red-600">
        Failed to load cycle.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft size={18} />
            Back
          </button>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Cycle Details
          </h1>
          <p className="text-slate-600">
            View, update or delete application cycle
          </p>
        </div>

        {/* VIEW CARD */}
        <div className="bg-white border rounded-2xl p-6 space-y-3 shadow-sm">
          <p className="text-sm text-slate-500">
            CURRENT DETAILS
          </p>

          <h2 className="text-xl font-bold">
            {cycle.financialYear}
          </h2>

          <p className="text-slate-600">
            Status:{" "}
            <span className="font-medium">{cycle.status}</span>
          </p>

          <p className="text-slate-600">
            Opening:{" "}
            {new Date(cycle.openningDate).toLocaleDateString()}
          </p>

          <p className="text-slate-600">
            Closing:{" "}
            {new Date(cycle.closingDate).toLocaleDateString()}
          </p>
        </div>

        {/* EDIT FORM */}
        <form
          onSubmit={handleUpdate}
          className="bg-white border rounded-2xl p-6 space-y-6 shadow-sm"
        >
          <h2 className="font-semibold text-lg">
            Edit Cycle
          </h2>

          {/* Financial Year */}
          <div>
            <label className="text-sm text-slate-700">
              Financial Year
            </label>
            <input
              type="text"
              name="financialYear"
              value={formData.financialYear}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 border rounded-xl"
            />
          </div>

          {/* Dates */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Opening Date</label>
              <input
                type="date"
                name="openningDate"
                value={formData.openningDate}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-3 border rounded-xl"
              />
            </div>

            <div>
              <label className="text-sm">Closing Date</label>
              <input
                type="date"
                name="closingDate"
                value={formData.closingDate}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-3 border rounded-xl"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="text-sm">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 border rounded-xl"
            >
              <option value="upcoming">Upcoming</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between pt-4 border-t">

            {/* DELETE */}
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-60"
            >
              {isDeleting ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Trash2 size={18} />
              )}
              Delete
            </button>

            {/* UPDATE */}
            <button
              type="submit"
              disabled={isUpdating}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-60"
            >
              {isUpdating ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Save size={18} />
              )}
              Save Changes
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default Cyclepage;