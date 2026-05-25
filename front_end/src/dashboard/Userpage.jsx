import React, { useEffect, useState } from "react";
import {
  useGetUserQuery,
  useUpdateRoleMutation,
  useDeleteUserMutation,
} from "@/authRedux/baseApiSlice";

import { useParams, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Mail,
  Phone,
  Shield,
  CalendarDays,
  Briefcase,
  Trash2,
  Save,
  User,
  Building2,
  BadgeCheck,
  Clock3,
  Pencil,
} from "lucide-react";

const roleStyles = {
  admin:
    "bg-red-100 text-red-700 border border-red-200",

  reviewer:
    "bg-blue-100 text-blue-700 border border-blue-200",

  finance:
    "bg-emerald-100 text-emerald-700 border border-emerald-200",

  user:
    "bg-slate-100 text-slate-700 border border-slate-200",
};

const UserDetailsPage = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  // GET SINGLE USER
  const {
    data: user,
    isLoading,
    error,
  } = useGetUserQuery(id);

  
  // MUTATIONS
  const [updateUser, { isLoading: updating }] =
    useUpdateRoleMutation();

  const [deleteUser, { isLoading: deleting }] =
    useDeleteUserMutation();

   
  // FORM STATE
  const [role, setRole] = useState("");

  const [department, setDepartment] =
    useState("");

  // PREFILL
  useEffect(() => {
    if (user) {
      setRole(user.role || "");

      setDepartment(user.department || "");
    }
  }, [user]);
  if (isLoading || !user) {
  return <p>Loading.......</p>;
}
 console.log("user",user)
  // UPDATE USER
  const handleUpdate = async () => {
    try {
      await updateUser({
        id,
        data: {
          role,
          department,
        },
      }).unwrap();

      alert("User updated successfully");
    } catch (err) {
      console.log(err);

      alert("Failed to update user");
    }
  };

  // DELETE USER
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user account?"
    );

    if (!confirmDelete) return;

    try {
      await deleteUser(id).unwrap();

      alert("User deleted successfully");

      navigate("/user");
    } catch (err) {
      console.log(err);

      alert("Failed to delete user");
    }
  };

  // LOADING
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="animate-pulse space-y-6">

          <div className="h-16 bg-slate-200 rounded-3xl" />

          <div className="h-72 bg-slate-200 rounded-3xl" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="h-80 bg-slate-200 rounded-3xl"
              />
            ))}
          </div>

        </div>
      </div>
    );
  }

  // ERROR
  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="bg-white rounded-3xl p-10 shadow-sm border border-red-100 text-center max-w-md w-full">

          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5">
            <User className="text-red-600" size={34} />
          </div>

          <h2 className="text-3xl font-black text-slate-800">
            User Not Found
          </h2>

          <p className="text-slate-500 mt-3">
            The requested user does not exist
            or may have been removed.
          </p>

          <button
            onClick={() => navigate(-1)}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-semibold transition-colors"
          >
            Go Back
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-6">

      {/* TOP BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

        <div className="flex items-center gap-4">

          <button
            onClick={() => navigate(-1)}
            className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft
              size={18}
              className="text-slate-700"
            />
          </button>

          <div>
            <h1 className="text-3xl font-black text-slate-800">
              User Details
            </h1>

            <p className="text-slate-500 text-sm mt-1">
              Review and manage user account
            </p>
          </div>

        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">

          <button
            onClick={handleUpdate}
            disabled={updating}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-200 transition-all"
          >
            <Save size={16} />

            {updating
              ? "Saving..."
              : "Save Changes"}
          </button>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 font-semibold transition-all"
          >
            <Trash2 size={16} />

            {deleting
              ? "Deleting..."
              : "Delete User"}
          </button>

        </div>

      </div>

      {/* PROFILE AVATAR (CENTERED ONLY) */}
<div className="w-full flex justify-center mb-8">
  <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden shadow-xl border-4 border-white bg-blue-600 flex items-center justify-center">
    
    {user?.image ? (
      <img
        src={user.image}
        alt="User"
        className="w-full h-full object-cover"
      />
    ) : (
      <span className="text-white text-4xl sm:text-5xl font-black uppercase">
        {user?.firstName?.[0] || ""}
        {user?.secondName?.[0] || ""}
      </span>
    )}

      </div>
    </div>
        
      {/* CONTENT */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="xl:col-span-2 space-y-6">

          {/* PERSONAL INFO */}
          <div className="bg-white rounded-[30px] border border-slate-100 shadow-sm p-6">

            <div className="flex items-center gap-3 mb-6">

              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                <User
                  size={22}
                  className="text-blue-600"
                />
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-800">
                  Personal Information
                </h3>

                <p className="text-sm text-slate-500">
                  Basic user profile details
                </p>
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <InfoCard
                icon={<User size={18} />}
                title="First Name"
                value={user.firstName}
              />

              <InfoCard
                icon={<User size={18} />}
                title="Second Name"
                value={user.secondName}
              />

              <InfoCard
                icon={<Mail size={18} />}
                title="Email Address"
                value={user.email}
              />

              <InfoCard
                icon={<Phone size={18} />}
                title="Phone Number"
                value={user.phone || "N/A"}
              />

            </div>

          </div>

          {/* ACCOUNT INFO */}
          <div className="bg-white rounded-[30px] border border-slate-100 shadow-sm p-6">

            <div className="flex items-center gap-3 mb-6">

              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
                <Shield
                  size={22}
                  className="text-emerald-600"
                />
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-800">
                  Account Information
                </h3>

                <p className="text-sm text-slate-500">
                  Administrative and system details
                </p>
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <InfoCard
                icon={<Shield size={18} />}
                title="Current Role"
                value={user.role}
              />

              <InfoCard
                icon={<Briefcase size={18} />}
                title="Department"
                value={
                  user.department ||
                  "NG-CDF Office"
                }
              />

              <InfoCard
                icon={<CalendarDays size={18} />}
                title="Account Created"
                value={new Date(
                  user.craetedAt
                ).toLocaleDateString()}
              />
                {console.log(user?.craetedAt)}
              <InfoCard
                icon={<Building2 size={18} />}
                title="Constituency"
                value={
                  user.constituency ||
                  "Muhoroni"
                }
              />

            </div>

          </div>

        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          {/* EDIT PANEL */}
          <div className="bg-white rounded-[30px] border border-slate-100 shadow-sm p-6">

            <div className="flex items-center gap-3 mb-6">

              <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center">
                <Pencil
                  size={22}
                  className="text-orange-600"
                />
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-800">
                  Manage User
                </h3>

                <p className="text-sm text-slate-500">
                  Update permissions and department
                </p>
              </div>

            </div>

            {/* ROLE */}
            <div className="mb-5">

              <label className="text-sm font-bold text-slate-700">
                User Role
              </label>

              <select
                value={role}
                onChange={(e) =>
                  setRole(e.target.value)
                }
                className="w-full mt-2 px-4 py-3 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-blue-100"
              >
                <option value="admin">
                  Admin
                </option>

                <option value="reviewer">
                  Reviewer
                </option>

                <option value="finance">
                  Finance
                </option>
                <option value="technician">
                  Technician
                </option>
                <option value="citizen">
                  Normal User
                </option>

              </select>

            </div>

            {/* DEPARTMENT */}
            <div className="mb-6">

              <label className="text-sm font-bold text-slate-700">
                Department
              </label>

              <input
                value={department}
                onChange={(e) =>
                  setDepartment(
                    e.target.value
                  )
                }
                placeholder="Enter department"
                className="w-full mt-2 px-4 py-3 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-blue-100"
              />

            </div>

            {/* SAVE */}
            <button
              onClick={handleUpdate}
              disabled={updating}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-bold transition-colors"
            >
              {updating
                ? "Saving Changes..."
                : "Save Changes"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

// INFO CARD
const InfoCard = ({
  icon,
  title,
  value,
}) => {
  return (
    <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">

      <div className="flex items-center gap-3 mb-4">

        <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-600">
          {icon}
        </div>

        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {title}
        </p>

      </div>

      <p className="text-slate-800 font-semibold break-words">
        {value}
      </p>

    </div>
  );
};

export default UserDetailsPage;