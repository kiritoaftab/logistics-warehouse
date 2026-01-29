import React, { useState } from "react";
import FilterBar from "../components/FilterBar";
import CusTable from "../components/CusTable";

const ReadyToShip = ({ data, onFilterChange, onReset, onApply }) => {
  const [filters, setFilters] = useState({
    date: "Today",
    warehouse: "WH-NYC-01",
    client: "Acme Corp",
    carrier: "All",
    status: "All",
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
      options: ["All", "Packed", "Ready"],
    },
    {
      key: "search",
      type: "search",
      label: "Search",
      placeholder: "Order No / Shipment ID / AV",
      value: filters.search,
      className: "min-w-[300px]",
    },
  ];

  const columns = [
    { key: "orderNo", title: "Order No" },
    { key: "client", title: "Client" },
    { key: "shipTo", title: "Ship-to" },
    { key: "cartons", title: "Cartons" },
    { key: "totalWeight", title: "Total Weight" },
    { key: "carrier", title: "Carrier" },
    { key: "slaDue", title: "SLA Due" },
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
      render: (row) => (
        <button className="rounded-md bg-blue-600 px-4 py-1.5 text-xs text-white hover:bg-blue-700">
          Create Shipment
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
      date: "Today",
      warehouse: "WH-NYC-01",
      client: "Acme Corp",
      carrier: "All",
      status: "All",
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

export default ReadyToShip;
