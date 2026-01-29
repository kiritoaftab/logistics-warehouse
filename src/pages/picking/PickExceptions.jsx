// picking/PickExceptions.jsx
import React, { useState } from "react";
import FilterBar from "../components/FilterBar";
import CusTable from "../components/CusTable";

const ExceptionStatusPill = ({ status }) => {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        status === "Open"
          ? "bg-red-100 text-red-700"
          : "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
};

const PickExceptions = () => {
  const [filters, setFilters] = useState({
    date: "Today",
    warehouse: "All Warehouses",
    client: "All Clients",
    status: "Open",
    reason: "All",
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
      options: ["All", "Open", "Resolved"],
      className: "w-[120px]",
    },
    {
      key: "reason",
      type: "select",
      label: "Reason",
      value: filters.reason,
      options: [
        "All",
        "Stock not found",
        "Bin blocked",
        "Damaged",
        "Wrong location",
      ],
      className: "w-[150px]",
    },
    {
      key: "search",
      type: "search",
      label: "Search",
      value: filters.search,
      placeholder: "Order No / SKU",
      className: "w-[240px]",
    },
  ];

  const columns = [
    {
      key: "exceptionId",
      title: "Exception ID",
      render: (r) => (
        <span className="font-semibold text-red-600">{r.exceptionId}</span>
      ),
    },
    {
      key: "orderNo",
      title: "Order No",
      render: (r) => (
        <span className="font-medium text-gray-900">{r.orderNo}</span>
      ),
    },
    { key: "sku", title: "SKU" },
    { key: "requiredQty", title: "Required Qty" },
    { key: "pickedQty", title: "Picked Qty" },
    { key: "reason", title: "Reason" },
    {
      key: "status",
      title: "Status",
      render: (r) => <ExceptionStatusPill status={r.status} />,
    },
    {
      key: "actions",
      title: "Actions",
      render: (r) => (
        <button
          className={`text-sm font-medium ${
            r.status === "Open"
              ? "text-blue-600 hover:text-blue-800"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          {r.status === "Open" ? "Resolve" : "View"}
        </button>
      ),
    },
  ];

  const data = [
    {
      id: 1,
      exceptionId: "EX-0501",
      orderNo: "ORD-9901",
      sku: "SKU-101",
      requiredQty: 10,
      pickedQty: 8,
      reason: "Stock not found",
      status: "Open",
    },
    {
      id: 2,
      exceptionId: "EX-0502",
      orderNo: "ORD-9905",
      sku: "SKU-202",
      requiredQty: 50,
      pickedQty: 0,
      reason: "Bin blocked",
      status: "Open",
    },
    {
      id: 3,
      exceptionId: "EX-0499",
      orderNo: "ORD-9880",
      sku: "SKU-105",
      requiredQty: 5,
      pickedQty: 4,
      reason: "Damaged",
      status: "Resolved",
    },
    {
      id: 4,
      exceptionId: "EX-0495",
      orderNo: "ORD-9875",
      sku: "SKU-300",
      requiredQty: 20,
      pickedQty: 0,
      reason: "Stock not found",
      status: "Resolved",
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
            status: "Open",
            reason: "All",
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

export default PickExceptions;
