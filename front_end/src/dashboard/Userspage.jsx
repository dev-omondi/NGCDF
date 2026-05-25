import React, { useMemo, useState } from "react";
import { useGetUsersQuery } from "@/authRedux/baseApiSlice";
import {
  Search,
  Users,
  Shield,
  Mail,
  Phone,
  User,
  UserCog,
  MoreVertical,
  UserPlus,
  Filter,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const roleColors = {
  admin:
    "bg-red-100 text-red-700 border border-red-200",
  reviewer:
    "bg-blue-100 text-blue-700 border border-blue-200",
  finance:
    "bg-emerald-100 text-emerald-700 border border-emerald-200",
  user:
    "bg-slate-100 text-slate-700 border border-slate-200",
};

const statusColors = {
  active:
    "bg-emerald-100 text-emerald-700",
  inactive:
    "bg-red-100 text-red-700",
};

const Userspage = () => {
  const { data: users = [], isLoading, error } = useGetUsersQuery();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const navigate=useNavigate()

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase());

      const matchesRole =
        roleFilter === "all" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === "admin").length,
    citizens: users.filter((u) => u.role === "citizen").length,
    staff: users.filter((u) => u.role=== "staff").length,
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4">
          Failed to load users
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800">
            User Management
          </h1>

          <p className="text-slate-500 mt-1 text-sm">
            Manage admins, reviewers, and bursary staff
          </p>
        </div>

        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-semibold shadow-lg shadow-blue-200 transition-all">
          <UserPlus size={18} />
          Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">
                Total Users
              </p>

              <h2 className="text-3xl font-black text-slate-800 mt-2">
                {stats.total}
              </h2>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
              <Users className="text-blue-600" size={22} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">
                Admins
              </p>

              <h2 className="text-3xl font-black text-slate-800 mt-2">
                {stats.admins}
              </h2>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center">
              <Shield className="text-red-600" size={22} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">
                Normal Users
              </p>

              <h2 className="text-3xl font-black text-slate-800 mt-2">
                {stats.citizens}
              </h2>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <User className="text-emerald-600" size={22} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">
                NGCDF Staff
              </p>

              <h2 className="text-3xl font-black text-slate-800 mt-2">
                {stats.staff}
              </h2>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center">
              <UserCog className="text-orange-600" size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          {/* Search */}
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 w-full lg:max-w-md">
            <Search size={18} className="text-slate-400" />

            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none flex-1 text-sm text-slate-700"
            />
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-slate-500">
              <Filter size={16} />
              <span className="text-sm font-medium">
                Role
              </span>
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-3 rounded-2xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="reviewer">Reviewer</option>
              <option value="finance">Finance</option>
              <option value="citizen">Citizen</option>
              <option value="technician">Technician</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  User
                </th>

                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Contact
                </th>

                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Role
                </th>

                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Department
                </th>

                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Joined
                </th>

                <th className="text-right px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {isLoading
                ? [...Array(6)].map((_, i) => (
                    <tr key={i} className="border-b border-slate-100">
                      <td className="px-6 py-5">
                        <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
                      </td>

                      <td className="px-6 py-5">
                        <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
                      </td>

                      <td className="px-6 py-5">
                        <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
                      </td>

                      <td className="px-6 py-5">
                        <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
                      </td>

                      <td className="px-6 py-5">
                        <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
                      </td>

                      <td className="px-6 py-5">
                        <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
                      </td>
                    </tr>
                  ))
                : filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      {/* User */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                            {user.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-800">
                              {user.name}
                            </p>

                            <p className="text-xs text-slate-500">
                              ID: {user._id?.slice(-4)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-6 py-5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-slate-700">
                            <Mail size={13} />
                            {user.email}
                          </div>

                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Phone size={12} />
                            {user.phone || "No phone"}
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-5">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                            roleColors[user.role] || roleColors.user
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                            statusColors[user.status] ||
                            statusColors.active
                          }`}
                        >
                          {user.department || "N/A"}
                        </span>
                      </td>

                      {/* Joined */}
                      <td className="px-6 py-5">
                        <p className="text-sm text-slate-600">
                          {new Date(
                            user.createdAt
                          ).toLocaleDateString()}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end ">
                          <button className="px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100
                           text-blue-600 text-xs font-semibold transition-colors"
                           onClick={() => navigate(`/user/${user._id}`)}
                           >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {!isLoading && filteredUsers.length === 0 && (
          <div className="py-16 text-center">
            <Users
              size={42}
              className="mx-auto text-slate-300 mb-3"
            />

            <h3 className="text-lg font-bold text-slate-700">
              No users found
            </h3>

            <p className="text-slate-500 text-sm mt-1">
              Try adjusting your filters or search query
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Userspage;