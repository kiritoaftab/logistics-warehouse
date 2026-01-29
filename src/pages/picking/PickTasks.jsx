// picking/PickTasks.jsx
import React, { useState } from "react";
import FilterBar from "../components/FilterBar";
import CusTable from "../components/CusTable";

const TaskStatusPill = ({ status }) => {
  const map = {
    "In Progress": "bg-blue-100 text-blue-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Exception: "bg-red-100 text-red-700",
    Done: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        map[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
};

const PickTasks = ({ onTaskSelect }) => {
  const [filters, setFilters] = useState({
    date: "Today",
    warehouse: "All Warehouses",
    client: "All Clients",
    status: "Pending",
    assigned: "Assigned to",
    zone: "All",
    search: "",
  });

  const filterConfig = [
    {
      key: "date",
      type: "select",
      label: "Date",
      value: filters.date,
      options: ["Today", "Yesterday", "Last 7 Days"],
      className: "w-[140px]",
    },
    {
      key: "warehouse",
      type: "select",
      label: "Warehouse",
      value: filters.warehouse,
      options: ["All Warehouses", "WH-NYC-01", "WH-LA-02"],
      className: "w-[160px]",
    },
    {
      key: "client",
      type: "select",
      label: "Client",
      value: filters.client,
      options: ["All Clients", "Acme Corp", "Tech Retailers", "Global Foods"],
      className: "w-[140px]",
    },
    {
      key: "status",
      type: "select",
      label: "Status",
      value: filters.status,
      options: ["All", "Pending", "In Progress", "Exception", "Done"],
      className: "w-[140px]",
    },
    {
      key: "assigned",
      type: "select",
      label: "Assigned to",
      value: filters.assigned,
      options: [
        "Assigned to",
        "John Doe",
        "Jane Smith",
        "Mike Ross",
        "Sarah Lee",
      ],
      className: "w-[160px]",
    },
    {
      key: "zone",
      type: "select",
      label: "Zone",
      value: filters.zone,
      options: [
        "All",
        "Zone A (Ambient)",
        "Zone B (Chilled)",
        "Zone C (Secure)",
      ],
      className: "w-[180px]",
    },
    {
      key: "search",
      type: "search",
      label: "Search",
      value: filters.search,
      placeholder: "Wave ID / Task ID / Order No",
      className: "w-[240px]",
    },
  ];

  const columns = [
    {
      key: "taskId",
      title: "Task ID",
      render: (r) => (
        <span className="font-semibold text-blue-600">{r.taskId}</span>
      ),
    },
    {
      key: "waveId",
      title: "Wave ID",
      render: (r) => <span className="text-gray-700">{r.waveId}</span>,
    },
    { key: "zone", title: "Zone" },
    { key: "orders", title: "Orders" },
    { key: "lines", title: "Lines" },
    { key: "units", title: "Units" },
    { key: "assignedTo", title: "Assigned to" },
    {
      key: "status",
      title: "Status",
      render: (r) => <TaskStatusPill status={r.status} />,
    },
    {
      key: "actions",
      title: "Actions",
      render: (r) => (
        <button
          onClick={() => onTaskSelect?.(r.taskId)}
          className={`text-sm font-medium ${
            r.status === "In Progress"
              ? "text-orange-600 hover:text-orange-800"
              : r.status === "Pending"
                ? "text-green-600 hover:text-green-800"
                : "text-blue-600 hover:text-blue-800"
          }`}
        >
          {r.status === "In Progress"
            ? "Resume ..."
            : r.status === "Pending"
              ? "Start Task"
              : "Open Task"}
        </button>
      ),
    },
  ];

  const data = [
    {
      id: 1,
      taskId: "PT-1001",
      waveId: "WV-2023-8901",
      zone: "Zone A (Ambient)",
      orders: 3,
      lines: 12,
      units: 85,
      assignedTo: "John Doe",
      status: "In Progress",
    },
    {
      id: 2,
      taskId: "PT-1002",
      waveId: "WV-2023-8901",
      zone: "Zone B (Chilled)",
      orders: 2,
      lines: 8,
      units: 40,
      assignedTo: "Jane Smith",
      status: "Pending",
    },
    {
      id: 3,
      taskId: "PT-1005",
      waveId: "WV-2023-8902",
      zone: "Zone A (Ambient)",
      orders: 5,
      lines: 18,
      units: 150,
      assignedTo: "-",
      status: "Pending",
    },
    {
      id: 4,
      taskId: "PT-0998",
      waveId: "WV-2023-8898",
      zone: "Zone C (Secure)",
      orders: 1,
      lines: 2,
      units: 5,
      assignedTo: "Mike Ross",
      status: "Exception",
    },
    {
      id: 5,
      taskId: "PT-0990",
      waveId: "WV-2023-8890",
      zone: "Zone A (Ambient)",
      orders: 4,
      lines: 20,
      units: 100,
      assignedTo: "Sarah Lee",
      status: "Done",
    },
  ];

  return (
    <div className="space-y-6">
      <FilterBar
        filters={filterConfig}
        showActions
        onFilterChange={(key, value) =>
          setFilters((prev) => ({ ...prev, [key]: value }))
        }
        onApply={() => console.log("Apply filters:", filters)}
        onReset={() =>
          setFilters({
            date: "Today",
            warehouse: "All Warehouses",
            client: "All Clients",
            status: "Pending",
            assigned: "Assigned to",
            zone: "All",
            search: "",
          })
        }
      />

      <div className="rounded-lg border border-gray-200 bg-white">
        <CusTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default PickTasks;
