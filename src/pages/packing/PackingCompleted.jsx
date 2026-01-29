// packing/PackingCompleted.jsx
import React, { useState } from "react";
import FilterBar from "../components/FilterBar";
import CusTable from "../components/CusTable";
import { Truck } from "lucide-react";

const PackingCompleted = ({ onOrderSelect }) => {
  const [filters, setFilters] = useState({
    date: "Today",
    warehouse: "WH-NYC-01",
    client: "Acme Corp",
    carrier: "All",
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
      key: "carrier",
      type: "select",
      label: "Carrier",
      value: filters.carrier,
      options: ["All", "FedEx", "DHL", "UPS"],
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
        <span className="font-semibold text-blue-600">{r.orderNo}</span>
      ),
    },
    { key: "cartons", title: "Cartons" },
    { key: "totalWeight", title: "Total Weight" },
    {
      key: "carrier",
      title: "Carrier",
      render: (r) => (
        <div className="flex items-center gap-2">
          <Truck size={14} className="text-gray-500" />
          <span>{r.carrier}</span>
        </div>
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
      key: "actions",
      title: "Actions",
      render: (r) => (
        <button
          onClick={() => onOrderSelect?.(r.orderNo)}
          className="text-blue-600 text-sm font-medium hover:text-blue-800"
        >
          Open Shipping
        </button>
      ),
    },
  ];

  const data = [
    {
      id: 1,
      orderNo: "ORD-2024-8810",
      cartons: 3,
      totalWeight: "15.2 kg",
      carrier: "FedEx",
      status: "Packed",
    },
    {
      id: 2,
      orderNo: "ORD-2024-8805",
      cartons: 1,
      totalWeight: "2.5 kg",
      carrier: "DHL",
      status: "Packed",
    },
    {
      id: 3,
      orderNo: "ORD-2024-8799",
      cartons: 5,
      totalWeight: "45.0 kg",
      carrier: "UPS",
      status: "Packed",
    },
    {
      id: 4,
      orderNo: "ORD-2024-8790",
      cartons: 2,
      totalWeight: "8.8 kg",
      carrier: "FedEx",
      status: "Packed",
    },
    {
      id: 5,
      orderNo: "ORD-2024-8788",
      cartons: 4,
      totalWeight: "22.1 kg",
      carrier: "DHL",
      status: "Packed",
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

export default PackingCompleted;
