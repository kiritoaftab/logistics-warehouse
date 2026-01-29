import React, { useEffect, useMemo, useState } from "react";
import FilterBar from "../../components/FilterBar";
import CusTable from "../../components/CusTable";
import http from "../../api/http";

const emptyForm = {
  username: "",
  email: "",
  password: "",
  first_name: "",
  last_name: "",
  phone: "",
};

const UsersPage = () => {
  const [filtersState, setFiltersState] = useState({
    search: "",
    status: "All",
  });

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  // modal states
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState("create"); // create | edit
  const [activeUser, setActiveUser] = useState(null);
  const [form, setForm] = useState(emptyForm);

  // change password modal
  const [showPwd, setShowPwd] = useState(false);
  const [pwdUser, setPwdUser] = useState(null);
  const [pwdForm, setPwdForm] = useState({
    old_password: "",
    new_password: "",
  });

  const filters = [
    {
      key: "search",
      type: "search",
      label: "Search",
      placeholder: "Search username / email / phone...",
      value: filtersState.search,
      className: "w-[360px]",
    },
    {
      key: "status",
      label: "Status",
      value: filtersState.status,
      options: ["All", "Active", "Inactive"],
      className: "w-[200px]",
    },
  ];

  const onFilterChange = (key, val) =>
    setFiltersState((p) => ({ ...p, [key]: val }));

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await http.get("/users"); // requiresAuth default true
      // handle API shape: either array or {data:[]}
      const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setUsers(list);
    } catch (e) {
      console.error("fetch users error", e);
      alert("Failed to fetch users (check token / API).");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onApply = () => {
    // client-side filter (fast). Later you can pass query to API if needed.
    // (we keep apply because your FilterBar shows Apply/Reset)
  };

  const onReset = () => setFiltersState({ search: "", status: "All" });

  const filteredUsers = useMemo(() => {
    const q = (filtersState.search || "").toLowerCase().trim();
    const status = filtersState.status;

    return users.filter((u) => {
      const matchesQ =
        !q ||
        `${u.username || ""} ${u.email || ""} ${u.phone || ""}`
          .toLowerCase()
          .includes(q);

      const matchesStatus =
        status === "All" ||
        (status === "Active" && (u.is_active ?? u.active ?? true)) ||
        (status === "Inactive" && !(u.is_active ?? u.active ?? true));

      return matchesQ && matchesStatus;
    });
  }, [users, filtersState]);

  const openCreate = () => {
    setMode("create");
    setActiveUser(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (u) => {
    setMode("edit");
    setActiveUser(u);
    setForm({
      username: u.username || "",
      email: u.email || "",
      password: "", // keep blank on edit unless your API supports password update here
      first_name: u.first_name || "",
      last_name: u.last_name || "",
      phone: u.phone || "",
    });
    setShowForm(true);
  };

  const submitForm = async () => {
    try {
      setLoading(true);

      if (mode === "create") {
        await http.post("/users", form); // requires token
      } else {
        const id = activeUser?.id || activeUser?._id;
        await http.put(`/users/${id}`, {
          username: form.username,
          email: form.email,
          first_name: form.first_name,
          last_name: form.last_name,
          phone: form.phone,
        });
      }

      setShowForm(false);
      await fetchUsers();
    } catch (e) {
      console.error("save user error", e);
      alert("Failed to save user. Check token / payload.");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (u) => {
    const id = u?.id || u?._id;
    if (!window.confirm(`Delete user "${u.username}"?`)) return;

    try {
      setLoading(true);
      await http.delete(`/users/${id}`);
      await fetchUsers();
    } catch (e) {
      console.error("delete user error", e);
      alert("Failed to delete user.");
    } finally {
      setLoading(false);
    }
  };

  const openChangePassword = (u) => {
    setPwdUser(u);
    setPwdForm({ old_password: "", new_password: "" });
    setShowPwd(true);
  };

  const submitPassword = async () => {
    const id = pwdUser?.id || pwdUser?._id;
    try {
      setLoading(true);
      await http.post(`/users/${id}/password`, pwdForm);
      setShowPwd(false);
      alert("Password updated successfully.");
    } catch (e) {
      console.error("change password error", e);
      alert("Failed to change password. Check old password / token.");
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      { key: "username", title: "Username" },
      { key: "email", title: "Email" },
      {
        key: "name",
        title: "Name",
        render: (row) =>
          `${row.first_name || ""} ${row.last_name || ""}`.trim() || "-",
      },
      { key: "phone", title: "Phone" },
      {
        key: "status",
        title: "Status",
        render: (row) => {
          const isActive = row.is_active ?? row.active ?? true;
          return (
            <span
              className={[
                "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
                isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700",
              ].join(" ")}
            >
              {isActive ? "Active" : "Inactive"}
            </span>
          );
        },
      },
      {
        key: "actions",
        title: "Actions",
        render: (row) => (
          <div className="flex items-center gap-2">
            <button
              className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700"
              onClick={() => openEdit(row)}
            >
              Edit
            </button>
            <button
              className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700"
              onClick={() => openChangePassword(row)}
            >
              Password
            </button>
            <button
              className="rounded-md bg-red-600 px-3 py-1.5 text-xs text-white"
              onClick={() => deleteUser(row)}
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div>
      {/* Top bar actions for this tab */}
      <div className="mb-4 flex items-center justify-end">
        <button
          onClick={openCreate}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white"
        >
          + Add User
        </button>
      </div>

      <FilterBar
        filters={filters}
        onFilterChange={onFilterChange}
        onApply={onApply}
        onReset={onReset}
      />

      <div className="rounded-lg border border-gray-200 bg-white p-2">
        {loading ? (
          <div className="p-6 text-sm text-gray-600">Loading...</div>
        ) : (
          <CusTable columns={columns} data={filteredUsers} />
        )}
      </div>

      {/* Create/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-xl rounded-lg bg-white p-5 shadow-lg">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {mode === "create" ? "Add User" : "Edit User"}
                </h3>
                <p className="text-sm text-gray-500">
                  {mode === "create"
                    ? "Create a new user (token required)."
                    : "Update user details."}
                </p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-md px-2 py-1 text-gray-500 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Field
                label="Username"
                value={form.username}
                onChange={(v) => setForm((p) => ({ ...p, username: v }))}
              />
              <Field
                label="Email"
                value={form.email}
                onChange={(v) => setForm((p) => ({ ...p, email: v }))}
              />
              <Field
                label="First Name"
                value={form.first_name}
                onChange={(v) => setForm((p) => ({ ...p, first_name: v }))}
              />
              <Field
                label="Last Name"
                value={form.last_name}
                onChange={(v) => setForm((p) => ({ ...p, last_name: v }))}
              />
              <Field
                label="Phone"
                value={form.phone}
                onChange={(v) => setForm((p) => ({ ...p, phone: v }))}
              />

              {mode === "create" && (
                <Field
                  label="Password"
                  type="password"
                  value={form.password}
                  onChange={(v) => setForm((p) => ({ ...p, password: v }))}
                />
              )}
            </div>

            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={submitForm}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-60"
              >
                {mode === "create" ? "Create" : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPwd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-lg">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Change Password
                </h3>
                <p className="text-sm text-gray-500">
                  {pwdUser?.username || ""}
                </p>
              </div>
              <button
                onClick={() => setShowPwd(false)}
                className="rounded-md px-2 py-1 text-gray-500 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <Field
                label="Old Password"
                type="password"
                value={pwdForm.old_password}
                onChange={(v) => setPwdForm((p) => ({ ...p, old_password: v }))}
              />
              <Field
                label="New Password"
                type="password"
                value={pwdForm.new_password}
                onChange={(v) => setPwdForm((p) => ({ ...p, new_password: v }))}
              />
            </div>

            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowPwd(false)}
                className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={submitPassword}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-60"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Field = ({ label, value, onChange, type = "text" }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[11px] font-medium text-gray-500">{label}</span>
    <input
      type={type}
      value={value || ""}
      onChange={(e) => onChange?.(e.target.value)}
      className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
    />
  </div>
);

export default UsersPage;
