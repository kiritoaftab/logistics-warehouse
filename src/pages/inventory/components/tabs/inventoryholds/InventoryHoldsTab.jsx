// InventoryHolds.jsx (Tab 3) - matches your screenshot structure

import React, { useState } from "react";
import FilterBar from "../../../../components/FilterBar";
import CusTable from "../../../../components/CusTable";

const StatusPill = ({ status }) => {
  const cls =
    status === "Active"
      ? "bg-orange-100 text-orange-700"
      : "bg-green-100 text-green-700";
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${cls}`}
    >
      {status}
    </span>
  );
};

const InventoryHolds = () => {
  const [filterState, setFilterState] = useState({
    warehouse: "WH-NYC-01",
    client: "Acme Corp",
    search: "",
    location: "",
    status: "Active",
  });

  const filters = [
    {
      key: "warehouse",
      type: "select",
      label: "Warehouse",
      value: filterState.warehouse,
      options: ["WH-NYC-01", "WH-NYC-02"],
      className: "w-[140px]",
    },
    {
      key: "client",
      type: "select",
      label: "Client",
      value: filterState.client,
      options: ["Acme Corp", "All Clients"],
      className: "w-[140px]",
    },
    {
      key: "search",
      type: "search",
      label: "Search",
      value: filterState.search,
      placeholder: "Hold ID, SKU or Reason...",
      className: "w-[220px]",
    },
    {
      key: "location",
      type: "search",
      label: "Location",
      value: filterState.location,
      placeholder: "e.g. ZONE-Q-01",
      className: "w-[160px]",
    },
    {
      key: "status",
      type: "select",
      label: "Status",
      value: filterState.status,
      options: ["Active", "Released"],
      className: "w-[120px]",
    },
  ];

  const columns = [
    {
      key: "holdId",
      title: "Hold ID",
      render: (r) => (
        <span className="font-semibold text-blue-600">{r.holdId}</span>
      ),
    },
    {
      key: "sku",
      title: "SKU",
      render: (r) => (
        <div className="leading-tight">
          <div className="font-semibold text-gray-900">{r.sku}</div>
          <div className="text-xs text-gray-500">{r.skuSub}</div>
        </div>
      ),
    },
    { key: "qty", title: "Qty" },
    { key: "location", title: "Location" },
    { key: "reason", title: "Hold Reason" },
    { key: "createdBy", title: "Created By" },
    { key: "createdTime", title: "Created Time" },
    {
      key: "status",
      title: "Status",
      render: (r) => <StatusPill status={r.status} />,
    },
    {
      key: "actions",
      title: "Actions",
      render: (r) => (
        <div className="flex items-center justify-start gap-2">
          <button className="rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm">
            View
          </button>
          {r.status === "Active" && (
            <button className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white">
              Release
            </button>
          )}
          {r.canDamage && (
            <button className="rounded-md bg-red-500 px-3 py-1.5 text-sm text-white">
              Damage
            </button>
          )}
        </div>
      ),
    },
  ];

  const data = [
    {
      id: 1,
      holdId: "HLD-9021",
      sku: "IPH-14-BLK",
      skuSub: "iPhone 14 Black 128GB",
      qty: 50,
      location: "ZONE-Q-01",
      reason: "Quality Check",
      createdBy: "Sarah J.",
      createdTime: "Today, 10:30 AM",
      status: "Active",
      canDamage: false,
    },
    {
      id: 2,
      holdId: "HLD-8845",
      sku: "SNK-CHOC-BAR",
      skuSub: "Snickers Bar 50g",
      qty: 150,
      location: "ZONE-B-14",
      reason: "Possible Expiry",
      createdBy: "Mike T.",
      createdTime: "Yesterday, 4:15 PM",
      status: "Active",
      canDamage: false,
    },
    {
      id: 3,
      holdId: "HLD-8810",
      sku: "NKE-AIR-01",
      skuSub: "Nike Air Max 90",
      qty: 12,
      location: "ZONE-R-02",
      reason: "Damaged Packaging",
      createdBy: "Priya K.",
      createdTime: "Oct 24, 2023",
      status: "Active",
      canDamage: true,
    },
    {
      id: 4,
      holdId: "HLD-7550",
      sku: "MED-KIT-01",
      skuSub: "First Aid Kit Standard",
      qty: 200,
      location: "ZONE-Q-05",
      reason: "Recall Notice",
      createdBy: "Robert L.",
      createdTime: "Oct 20, 2023",
      status: "Released",
      canDamage: false,
    },
    {
      id: 5,
      holdId: "HLD-7210",
      sku: "SAM-GAL-S23",
      skuSub: "Samsung Galaxy S23",
      qty: 5,
      location: "ZONE-A-09",
      reason: "Customer Return",
      createdBy: "Maria G.",
      createdTime: "Oct 18, 2023",
      status: "Released",
      canDamage: false,
    },
  ];

  return (
    <div className="space-y-6">
      <FilterBar
        filters={filters}
        showActions
        onFilterChange={(k, v) => setFilterState((s) => ({ ...s, [k]: v }))}
        onApply={() => {}}
        onReset={() =>
          setFilterState({
            warehouse: "WH-NYC-01",
            client: "Acme Corp",
            search: "",
            location: "",
            status: "Active",
          })
        }
      />

      <div className="rounded-lg border border-gray-200 bg-white">
        <CusTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default InventoryHolds;
