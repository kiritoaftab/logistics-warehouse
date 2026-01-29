// packing/PackingInProgress.jsx
import React, { useState } from "react";
import FilterBar from "../components/FilterBar";
import CusTable from "../components/CusTable";

const ProgressBar = ({ current, total }) => {
  const percentage = (current / total) * 100;
  return (
    <div className="flex items-center gap-2">
      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm text-gray-700">
        {current} / {total}
      </span>
    </div>
  );
};

const PackingInProgress = ({ onOrderSelect }) => {
  const [filters, setFilters] = useState({
    date: "Today",
    warehouse: "WH-NYC-01",
    client: "Acme Corp",
    status: "Packing",
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
      options: ["WH-NYC-01", "WH-LA-02"],
      className: "w-[140px]",
    },
    {
      key: "client",
      type: "select",
      label: "Client",
      value: filters.client,
      options: ["All Clients", "Acme Corp", "Beta Ltd", "Gamma Inc"],
      className: "w-[140px]",
    },
    {
      key: "status",
      type: "select",
      label: "Status",
      value: filters.status,
      options: ["Packing", "Paused", "Waiting"],
      className: "w-[140px]",
    },
    {
      key: "search",
      type: "search",
      label: "Search",
      value: filters.search,
      placeholder: "Order No / Packer / Ship-to",
      className: "w-[240px]",
    },
  ];

  const columns = [
    {
      key: "orderNo",
      title: "Order No",
      render: (r) => (
        <span className="font-semibold text-blue-600">{r.orderNo}</span>
      ),
    },
    { key: "packingStartedBy", title: "Packing Started By" },
    { key: "startedTime", title: "Started Time" },
    { key: "cartonsCreated", title: "Cartons Created" },
    {
      key: "packedUnits",
      title: "Packed Units",
      render: (r) => (
        <ProgressBar current={r.packedCurrent} total={r.packedTotal} />
      ),
    },
    {
      key: "status",
      title: "Status",
      render: (r) => (
        <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700">
          {r.status}
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
          Resume Packing
        </button>
      ),
    },
  ];

  const data = [
    {
      id: 1,
      orderNo: "ORD-2024-8820",
      packingStartedBy: "John Doe",
      startedTime: "Today 10:30 AM",
      cartonsCreated: 2,
      packedCurrent: 45,
      packedTotal: 50,
      status: "Packing",
    },
    {
      id: 2,
      orderNo: "ORD-2024-8815",
      packingStartedBy: "Jane Smith",
      startedTime: "Today 11:15 AM",
      cartonsCreated: 1,
      packedCurrent: 12,
      packedTotal: 60,
      status: "Packing",
    },
    {
      id: 3,
      orderNo: "ORD-2024-8833",
      packingStartedBy: "Mike Brown",
      startedTime: "Today 09:45 AM",
      cartonsCreated: 4,
      packedCurrent: 120,
      packedTotal: 120,
      status: "Packing",
    },
    {
      id: 4,
      orderNo: "ORD-2024-8799",
      packingStartedBy: "Sarah Lee",
      startedTime: "Yesterday 4:00 PM",
      cartonsCreated: 1,
      packedCurrent: 5,
      packedTotal: 25,
      status: "Packing",
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
            status: "Packing",
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

export default PackingInProgress;
