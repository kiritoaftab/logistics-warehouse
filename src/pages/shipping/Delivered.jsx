import React, { useState } from "react";
import FilterBar from "../components/FilterBar";
import CusTable from "../components/CusTable";

const Delivered = ({ data, onFilterChange, onReset, onApply }) => {
  const [filters, setFilters] = useState({
    date: "This Week",
    warehouse: "WH-NYC-01",
    client: "Acme Corp",
    carrier: "All",
    status: "Delivered",
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
      key: "carrier",
      label: "Carrier",
      value: filters.carrier,
      options: ["All", "FedEx", "DHL", "UPS", "Own Fleet"],
    },
    {
      key: "status",
      label: "Status",
      value: filters.status,
      options: ["Delivered", "All"],
    },
    {
      key: "search",
      type: "search",
      label: "Search",
      placeholder: "Shipment ID / Order No / A",
      value: filters.search,
      className: "min-w-[300px]",
    },
  ];

  const columns = [
    { key: "shipmentId", title: "Shipment ID" },
    { key: "carrier", title: "Carrier" },
    { key: "deliveredTime", title: "Delivered Time" },
    {
      key: "podStatus",
      title: "POD Status",
      render: (row) => {
        const statusColors = {
          Available: "text-green-700",
          Pending: "text-amber-700",
        };
        return (
          <span
            className={`font-medium ${statusColors[row.podStatus] || "text-gray-700"}`}
          >
            {row.podStatus}
          </span>
        );
      },
    },
    { key: "ordersCount", title: "Orders Count" },
    {
      key: "status",
      title: "Status",
      render: (row) => (
        <span className="font-medium text-green-700">{row.status}</span>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      render: () => (
        <button className="rounded-md border border-gray-300 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50">
          Open
        </button>
      ),
    },
  ];

  const handleLocalFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    onFilterChange?.(key, value);
  };

  const handleReset = () => {
    const defaultFilters = {
      date: "This Week",
      warehouse: "WH-NYC-01",
      client: "Acme Corp",
      carrier: "All",
      status: "Delivered",
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

export default Delivered;
