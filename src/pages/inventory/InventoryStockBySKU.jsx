// inventory/InventoryStockBySKU.jsx
import React, { useState } from "react";
import FilterBar from "../components/FilterBar";
import CusTable from "../components/CusTable";

const Pill = ({ text }) => {
  const map = {
    Healthy: "bg-green-100 text-green-700",
    "Low Stock": "bg-orange-100 text-orange-700",
    "Expiry Risk": "bg-red-100 text-red-700",
    "QC Hold": "bg-orange-100 text-orange-700",
    "Out of Stock": "bg-gray-100 text-gray-600",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${map[text] || "bg-gray-100 text-gray-700"}`}
    >
      {text}
    </span>
  );
};

const InventoryStockBySKU = () => {
  const [f, setF] = useState({
    warehouse: "WH-NYC-01",
    client: "Acme Corp",
    skuSearch: "",
    zone: "All Zones",
    stockStatus: "All Statuses",
  });

  const filters = [
    {
      key: "warehouse",
      type: "select",
      label: "Warehouse",
      value: f.warehouse,
      options: ["WH-NYC-01"],
      className: "w-[140px]",
    },
    {
      key: "client",
      type: "select",
      label: "Client",
      value: f.client,
      options: ["Acme Corp"],
      className: "w-[140px]",
    },
    {
      key: "skuSearch",
      type: "search",
      label: "SKU Search",
      value: f.skuSearch,
      placeholder: "Search SKU Code or Name...",
      className: "w-[260px]",
    },
    {
      key: "zone",
      type: "select",
      label: "Zone",
      value: f.zone,
      options: ["All Zones", "Zone A", "Zone B", "Zone C"],
      className: "w-[140px]",
    },
    {
      key: "stockStatus",
      type: "select",
      label: "Stock Status",
      value: f.stockStatus,
      options: [
        "All Statuses",
        "Healthy",
        "Low Stock",
        "Expiry Risk",
        "QC Hold",
        "Out of Stock",
      ],
      className: "w-[160px]",
    },
  ];

  const columns = [
    {
      key: "skuDetails",
      title: "SKU Details",
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-md border border-gray-200 bg-white">
            <img
              src={r.img}
              alt={r.sku}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-blue-600">{r.sku}</div>
            <div className="text-xs text-gray-500">{r.name}</div>
          </div>
        </div>
      ),
    },
    { key: "onHand", title: "On-hand" },
    { key: "available", title: "Available" },
    { key: "hold", title: "Hold" },
    { key: "allocated", title: "Allocated" },
    {
      key: "risk",
      title: "Status / Risk",
      render: (r) => <Pill text={r.risk} />,
    },
    {
      key: "actions",
      title: "Actions",
      render: () => (
        <div className="flex justify-start">
          <button className="rounded-md border border-gray-200 bg-gray-50 px-4 py-1.5 text-sm text-gray-700">
            View
          </button>
        </div>
      ),
    },
  ];

  const data = [
    {
      id: 1,
      sku: "IPH-14-BLK",
      name: "iPhone 14 Black 128GB",
      img: "https://via.placeholder.com/40",
      onHand: "1,250",
      available: "",
      hold: "50",
      allocated: "50",
      risk: "Healthy",
    },
    {
      id: 2,
      sku: "NKE-AIR-01",
      name: "Nike Air Max 90",
      img: "https://via.placeholder.com/40",
      onHand: "420",
      available: "",
      hold: "0",
      allocated: "0",
      risk: "Low Stock",
    },
    {
      id: 3,
      sku: "SNK-CHOC-BAR",
      name: "Snickers Bar 50g",
      img: "https://via.placeholder.com/40",
      onHand: "5,000",
      available: "",
      hold: "3,000",
      allocated: "0",
      risk: "Expiry Risk",
    },
    {
      id: 4,
      sku: "SAM-GAL-S23",
      name: "Samsung Galaxy S23",
      img: "https://via.placeholder.com/40",
      onHand: "85",
      available: "",
      hold: "0",
      allocated: "5",
      risk: "Healthy",
    },
    {
      id: 5,
      sku: "MED-KIT-01",
      name: "First Aid Kit Standard",
      img: "https://via.placeholder.com/40",
      onHand: "200",
      available: "",
      hold: "50",
      allocated: "0",
      risk: "QC Hold",
    },
    {
      id: 6,
      sku: "PS5-CONSOLE",
      name: "PlayStation 5 Disc Edition",
      img: "https://via.placeholder.com/40",
      onHand: "0",
      available: "0",
      hold: "0",
      allocated: "0",
      risk: "Out of Stock",
    },
  ];

  return (
    <div className="space-y-4">
      <FilterBar
        filters={filters}
        showActions
        onFilterChange={(k, v) => setF((s) => ({ ...s, [k]: v }))}
        onApply={() => {}}
        onReset={() =>
          setF({
            warehouse: "WH-NYC-01",
            client: "Acme Corp",
            skuSearch: "",
            zone: "All Zones",
            stockStatus: "All Statuses",
          })
        }
      />

      <div className="rounded-lg border border-gray-200 bg-white">
        <CusTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default InventoryStockBySKU;
