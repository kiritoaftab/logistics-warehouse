import React, { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import FilterBar from "../components/FilterBar";
import CusTable from "../components/CusTable";
import http from "../../api/http";

const TABS = ["Users", "Modules", "Permissions", "Roles"];

const Masters = () => {
  const [activeTab, setActiveTab] = useState("Users");

  return (
    <div>
      <PageHeader
        title="WMS Masters"
        subtitle="Configure master data and access control rules"
        breadcrumbs={[
          { label: "WMS", path: "/wms" },
          { label: "Masters", path: "/wms/masters" },
        ]}
        actions={
          <>
            <button className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700">
              Import
            </button>
            <button className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700">
              Export
            </button>
          </>
        }
      />

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex flex-wrap gap-4">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={[
                "px-3 py-2 text-sm font-medium border-b-2 -mb-px",
                activeTab === t
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-600 border-transparent hover:text-gray-900",
              ].join(" ")}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === "Users" && <UsersTab />}
      {activeTab === "Modules" && <ComingSoon label="Modules" />}
      {activeTab === "Permissions" && <ComingSoon label="Permissions" />}
      {activeTab === "Roles" && <ComingSoon label="Roles" />}
    </div>
  );
};

export default Masters;

/* -------------------- USERS TAB (FULL CRUD) -------------------- */

const emptyUser = {
  username: "",
  email: "",
  password: "",
  first_name: "",
  last_name: "",
  phone: "",
};

const UsersTab = () => {
  const [filtersState, setFiltersState] = useState({
    search: "",
    status: "All",
  });

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  // modal
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState("create"); // create | edit
  const [activeUser, setActiveUser] = useState(null);
  const [form, setForm] = useState(emptyUser);

  // change password
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
      const res = await http.get("/users"); // token auto attached
      const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setUsers(list);
    } catch (e) {
      console.error(e);
      alert("Failed to fetch users. Check token in sessionStorage.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onReset = () => setFiltersState({ search: "", status: "All" });
  const onApply = () => {}; // optional (FilterBar requires buttons)

  const filteredUsers = useMemo(() => {
    const q = (filtersState.search || "").toLowerCase().trim();
    const status = filtersState.status;

    return users.filter((u) => {
      const matchesQ =
        !q ||
        `${u.username || ""} ${u.email || ""} ${u.phone || ""}`
          .toLowerCase()
          .includes(q);

      const isActive = u.is_active ?? u.active ?? true;
      const matchesStatus =
        status === "All" ||
        (status === "Active" && isActive) ||
        (status === "Inactive" && !isActive);

      return matchesQ && matchesStatus;
    });
  }, [users, filtersState]);

  const openCreate = () => {
    setMode("create");
    setActiveUser(null);
    setForm(emptyUser);
    setShowForm(true);
  };

  const openEdit = (u) => {
    setMode("edit");
    setActiveUser(u);
    setForm({
      username: u.username || "",
      email: u.email || "",
      password: "", // don't change here
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
        await http.post("/users", form);
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
      console.error(e);
      alert("Failed to save user. Check API payload/token.");
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
      console.error(e);
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
      alert("Password changed successfully.");
    } catch (e) {
      console.error(e);
      alert("Failed to change password.");
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
      {/* tab header actions */}
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

      {/* Create/Edit modal */}
      {showForm && (
        <Modal
          title={mode === "create" ? "Add User" : "Edit User"}
          subtitle={
            mode === "create"
              ? "Create a new user (token required)."
              : "Update user details."
          }
          onClose={() => setShowForm(false)}
          footer={
            <>
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
            </>
          }
        >
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
        </Modal>
      )}

      {/* Change password modal */}
      {showPwd && (
        <Modal
          title="Change Password"
          subtitle={pwdUser?.username || ""}
          onClose={() => setShowPwd(false)}
          footer={
            <>
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
            </>
          }
        >
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
        </Modal>
      )}
    </div>
  );
};

/* -------------------- SMALL UI HELPERS -------------------- */

const ComingSoon = ({ label }) => (
  <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-700">
    {label} CRUD will go here (share APIs next).
  </div>
);

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

const Modal = ({ title, subtitle, onClose, children, footer }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
    <div className="w-full max-w-xl rounded-lg bg-white p-5 shadow-lg">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <button
          onClick={onClose}
          className="rounded-md px-2 py-1 text-gray-500 hover:bg-gray-100"
        >
          ✕
        </button>
      </div>

      {children}

      <div className="mt-5 flex items-center justify-end gap-3">{footer}</div>
    </div>
  </div>
);
