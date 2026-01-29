// picking/PickWaves.jsx
import React, { useState } from "react";
import FilterBar from "../components/FilterBar";
import CusTable from "../components/CusTable";

const StatusPill = ({ status }) => {
  const map = {
    "In Progress": "bg-blue-100 text-blue-700",
    Released: "bg-green-100 text-green-700",
    Draft: "bg-gray-100 text-gray-600",
    Completed: "bg-purple-100 text-purple-700",
    Cancelled: "bg-red-100 text-red-600",
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

const PickWaves = () => {
  const [filters, setFilters] = useState({
    date: "Today",
    warehouse: "All Warehouses",
    client: "All Clients",
    status: "All",
    assigned: "Assigned to",
    search: "",
  });

  const filterConfig = [
    {
      key: "date",
      type: "select",
      label: "Date",
      value: filters.date,
      options: ["Today", "Yesterday", "Last 7 Days", "Last 30 Days"],
      className: "w-[140px]",
    },
    {
      key: "warehouse",
      type: "select",
      label: "Warehouse",
      value: filters.warehouse,
      options: ["All Warehouses", "WH-NYC-01", "WH-LA-02", "WH-CHI-03"],
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
      options: [
        "All",
        "Draft",
        "Released",
        "In Progress",
        "Completed",
        "Cancelled",
      ],
      className: "w-[120px]",
    },
    {
      key: "assigned",
      type: "select",
      label: "Assigned to",
      value: filters.assigned,
      options: ["Assigned to", "Team Alpha", "Team Beta", "Unassigned"],
      className: "w-[150px]",
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
      key: "waveId",
      title: "Wave ID",
      render: (r) => (
        <span className="font-semibold text-blue-600">{r.waveId}</span>
      ),
    },
    { key: "client", title: "Client" },
    { key: "orders", title: "Orders" },
    { key: "skuLines", title: "SKU Lines" },
    { key: "units", title: "Units" },
    { key: "strategy", title: "Strategy" },
    { key: "createdTime", title: "Created Time" },
    {
      key: "status",
      title: "Status",
      render: (r) => <StatusPill status={r.status} />,
    },
    { key: "assignedTeam", title: "Assigned Team" },
    {
      key: "actions",
      title: "Actions",
      render: (r) => (
        <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
          {r.status === "Draft" ? "Release Wave" : "View Tasks"} ...
        </button>
      ),
    },
  ];

  const data = [
    {
      id: 1,
      waveId: "WV-2023-8901",
      client: "Acme Corp",
      orders: 12,
      skuLines: 45,
      units: 320,
      strategy: "Multi Zone",
      createdTime: "Today, 09:30 AM",
      status: "In Progress",
      assignedTeam: "Team Alpha",
    },
    {
      id: 2,
      waveId: "WV-2023-8902",
      client: "Tech Retailers",
      orders: 5,
      skuLines: 18,
      units: 150,
      strategy: "Single Zone",
      createdTime: "Today, 10:15 AM",
      status: "Released",
      assignedTeam: "Unassigned",
    },
    {
      id: 3,
      waveId: "WV-2023-8903",
      client: "Global Foods",
      orders: 24,
      skuLines: 98,
      units: 1240,
      strategy: "Batch Pick",
      createdTime: "Today, 11:00 AM",
      status: "Draft",
      assignedTeam: "-",
    },
    {
      id: 4,
      waveId: "WV-2023-8898",
      client: "Acme Corp",
      orders: 8,
      skuLines: 32,
      units: 210,
      strategy: "Multi Zone",
      createdTime: "Yesterday, 16:45",
      status: "Completed",
      assignedTeam: "Team Beta",
    },
    {
      id: 5,
      waveId: "WV-2023-8895",
      client: "Tech Retailers",
      orders: 15,
      skuLines: 60,
      units: 480,
      strategy: "Multi Zone",
      createdTime: "Yesterday, 14:20",
      status: "Cancelled",
      assignedTeam: "-",
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
            status: "All",
            assigned: "Assigned to",
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

export default PickWaves;
