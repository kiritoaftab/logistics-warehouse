import React, { useState } from "react";
import FilterBar from "../components/FilterBar";
import CusTable from "../components/CusTable";

const ShipmentsInTransit = ({
  data,
  onFilterChange,
  onReset,
  onApply,
  onOpenShipment,
}) => {
  const [filters, setFilters] = useState({
    date: "This Week",
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
      options: ["All", "In Transit", "Dispatched", "Delayed"],
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
    { key: "shipmentId", title: "Shipment ID" },
    { key: "carrier", title: "Carrier" },
    { key: "tracking", title: "AWB / Tracking" },
    { key: "orders", title: "Orders" },
    { key: "cartons", title: "Cartons" },
    { key: "dispatchTime", title: "Dispatch Time" },
    { key: "lastScan", title: "Last Scan" },
    {
      key: "status",
      title: "Status",
      render: (row) => {
        const statusColors = {
          "In Transit": "text-blue-700",
          Dispatched: "text-amber-700",
          Delayed: "text-red-700",
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
        <button
          onClick={() => onOpenShipment?.(row.shipmentId)}
          className="flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
        >
          <span>🔒</span> Open
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

export default ShipmentsInTransit;
