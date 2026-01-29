import React, { useState } from "react";
import FilterBar from "../components/FilterBar";
import CusTable from "../components/CusTable";

const Exceptions = ({ data, onFilterChange, onReset, onApply }) => {
  const [filters, setFilters] = useState({
    date: "Today",
    warehouse: "WH-NYC-01",
    client: "Acme Corp",
    exceptionType: "All",
    search: "",
  });

  const filterConfig = [
    {
      key: "date",
      label: "Date",
      value: filters.date,
      options: ["Today", "Yesterday", "This Week", "This Month"],
    },
    {
      key: "warehouse",
      label: "Warehouse",
      value: filters.warehouse,
      options: ["WH-NYC-01", "WH-LA-02", "WH-CHI-03"],
    },
    {
      key: "client",
      label: "Client",
      value: filters.client,
      options: ["Acme Corp", "Global Inc", "Tech Solutions"],
    },
    {
      key: "exceptionType",
      label: "Exception Type",
      value: filters.exceptionType,
      options: ["All", "Delay", "Damage", "RTO", "Lost"],
    },
    {
      key: "search",
      type: "search",
      label: "Search",
      placeholder: "Exception ID / Shipment ID",
      value: filters.search,
      className: "min-w-[300px]",
    },
  ];

  const columns = [
    { key: "exceptionId", title: "Exception ID" },
    { key: "shipmentId", title: "Shipment ID" },
    {
      key: "type",
      title: "Type",
      render: (row) => {
        const typeColors = {
          Delay: "text-amber-700",
          Damage: "text-red-700",
          RTO: "text-purple-700",
        };
        return (
          <span
            className={`font-medium ${typeColors[row.type] || "text-gray-700"}`}
          >
            {row.type}
          </span>
        );
      },
    },
    { key: "age", title: "Age" },
    {
      key: "status",
      title: "Status",
      render: (row) => {
        const statusColors = {
          Open: "text-red-700",
          Resolved: "text-green-700",
        };
        return (
          <span
            className={`font-medium ${statusColors[row.status] || "text-gray-700"}`}
          >
            {row.status}
          </span>
        );
      },
    },
    {
      key: "actions",
      title: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          {row.status === "Open" ? (
            <>
              <button className="rounded-md border border-gray-300 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50">
                Open Case
              </button>
              <button className="rounded-md bg-green-600 px-3 py-1.5 text-xs text-white hover:bg-green-700">
                Resolve
              </button>
            </>
          ) : (
            <button className="rounded-md border border-gray-300 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50">
              View
            </button>
          )}
        </div>
      ),
    },
  ];

  const handleLocalFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    onFilterChange?.(key, value);
  };

  const handleReset = () => {
    const defaultFilters = {
      date: "Today",
      warehouse: "WH-NYC-01",
      client: "Acme Corp",
      exceptionType: "All",
      search: "",
    };
    setFilters(defaultFilters);
    onReset?.();
  };

  return (
    <>
      <FilterBar
        filters={filterConfig}
        onFilterChange={handleLocalFilterChange}
        onReset={handleReset}
        onApply={() => onApply?.(filters)}
      />
      <CusTable columns={columns} data={data} />
    </>
  );
};

export default Exceptions;
