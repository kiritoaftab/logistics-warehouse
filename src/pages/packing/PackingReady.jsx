// packing/PackingReady.jsx
import React, { useState } from "react";
import FilterBar from "../components/FilterBar";
import CusTable from "../components/CusTable";

const PackingReady = ({ onOrderSelect }) => {
  const [filters, setFilters] = useState({
    date: "Today",
    warehouse: "WH-NYC-01",
    client: "Acme Corp",
    carrier: "All",
    priority: "All",
    search: "",
  });

  // FilterBar EXACTLY like Figma
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
      options: ["WH-NYC-01", "WH-LA-02", "WH-CHI-03"],
      className: "w-[140px]",
    },
    {
      key: "client",
      type: "select",
      label: "Client",
      value: filters.client,
      options: ["Acme Corp", "Beta Ltd", "Gamma Inc"],
      className: "w-[140px]",
    },
    {
      key: "carrier",
      type: "select",
      label: "Carrier",
      value: filters.carrier,
      options: ["All", "FedEx", "DHL", "UPS"],
      className: "w-[120px]",
    },
    {
      key: "priority",
      type: "select",
      label: "Priority",
      value: filters.priority,
      options: ["All", "High", "Normal", "Low"],
      className: "w-[120px]",
    },
    {
      key: "search",
      type: "search",
      label: "Search",
      value: filters.search,
      placeholder: "Order No / Wave ID / Ship-to",
      className: "w-[240px]",
    },
  ];

  const columns = [
    {
      key: "orderNo",
      title: "Order No",
      render: (r) => (
        <span className="font-semibold text-gray-900">{r.orderNo}</span>
      ),
    },
    { key: "client", title: "Client" },
    { key: "shipTo", title: "Ship-to" },
    { key: "lines", title: "Lines" },
    { key: "unitsPicked", title: "Units Picked" },
    {
      key: "priority",
      title: "Priority",
      render: (r) => (
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
            r.priority === "High"
              ? "bg-orange-100 text-orange-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {r.priority}
        </span>
      ),
    },
    {
      key: "status",
      title: "Status",
      render: (r) => (
        <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold bg-green-100 text-green-700">
          {r.status}
        </span>
      ),
    },
    {
      key: "slaDue",
      title: "SLA Due",
      render: (r) => (
        <span
          className={`font-medium ${
            r.slaDue.includes("Overdue")
              ? "text-red-600"
              : r.slaDue.includes("Today")
                ? "text-orange-600"
                : "text-gray-600"
          }`}
        >
          {r.slaDue}
        </span>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      render: (r) => (
        <button
          onClick={() => onOrderSelect?.(r.orderNo)}
          className="text-blue-600 text-sm font-medium hover:text-blue-800"
        >
          Pack Now
        </button>
      ),
    },
  ];

  // Data EXACTLY like Figma screenshot
  const data = [
    {
      id: 1,
      orderNo: "ORDER-2024-8801",
      client: "Acme Corp",
      shipTo: "New York, NY",
      lines: 5,
      unitsPicked: 120,
      priority: "Normal",
      status: "Picked",
      slaDue: "Today 16:00",
    },
    {
      id: 2,
      orderNo: "ORDER-2024-8804",
      client: "Acme Corp",
      shipTo: "Chicago, IL",
      lines: 12,
      unitsPicked: 450,
      priority: "High",
      status: "Picked",
      slaDue: "Today 14:30",
    },
    {
      id: 3,
      orderNo: "ORDER-2024-8792",
      client: "Beta Ltd",
      shipTo: "Austin, TX",
      lines: 2,
      unitsPicked: 24,
      priority: "Normal",
      status: "Picked",
      slaDue: "Tomorrow 10:00",
    },
    {
      id: 4,
      orderNo: "ORDER-2024-8785",
      client: "Gamma Inc",
      shipTo: "Seattle, WA",
      lines: 8,
      unitsPicked: 96,
      priority: "Normal",
      status: "Picked",
      slaDue: "Tomorrow 12:00",
    },
    {
      id: 5,
      orderNo: "ORDER-2024-8750",
      client: "Acme Corp",
      shipTo: "Miami, FL",
      lines: 15,
      unitsPicked: 300,
      priority: "High",
      status: "Picked",
      slaDue: "Overdue (2h)",
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
            warehouse: "WH-NYC-01",
            client: "Acme Corp",
            carrier: "All",
            priority: "All",
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

export default PackingReady;
