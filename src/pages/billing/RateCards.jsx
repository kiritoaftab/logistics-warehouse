import React, { useState } from "react";
import FilterBar from "../components/FilterBar";
import CusTable from "../components/CusTable";
import { Download, Plus, Play, Pencil, Copy } from "lucide-react";

const RateCards = () => {
  const [activeTab, setActiveTab] = useState("rate");
  const [filters, setFilters] = useState({
    chargeType: "All",
    search: "",
  });

  // Header Tabs (UI only)
  const tabs = [
    { id: "billable", label: "Billable Events" },
    { id: "ready", label: "Ready to Invoice" },
    { id: "invoiced", label: "Invoiced" },
    { id: "payments", label: "Payments / Aging" },
    { id: "rate", label: "Rate Cards" },
  ];

  const filterConfig = [
    {
      key: "chargeType",
      label: "",
      value: filters.chargeType,
      options: ["All", "Storage", "Inbound", "Pick/Pack", "Shipping"],
    },
    {
      key: "search",
      type: "search",
      label: "",
      placeholder: "Search Rate Cards...",
      value: filters.search,
      className: "min-w-[260px]",
    },
  ];

  const rateCardsData = [
    {
      id: 1,
      name: "Standard Pallet Storage",
      chargeType: "Storage",
      basis: "Per Pallet / Day",
      rate: "25.00",
      currency: "INR",
      effectiveFrom: "Jan 01, 2024",
    },
    {
      id: 2,
      name: "Cold Storage Area A",
      chargeType: "Storage",
      basis: "Per Sq Ft / Day",
      rate: "45.00",
      currency: "INR",
      effectiveFrom: "Jan 01, 2024",
    },
    {
      id: 3,
      name: "Inbound Case Handling",
      chargeType: "Inbound",
      basis: "Per Case",
      rate: "12.50",
      currency: "INR",
      effectiveFrom: "Mar 15, 2024",
    },
    {
      id: 4,
      name: "Standard Pick & Pack",
      chargeType: "Pick/Pack",
      basis: "Per Unit",
      rate: "5.00",
      currency: "INR",
      effectiveFrom: "Jan 01, 2024",
    },
    {
      id: 5,
      name: "Bulk Order Picking",
      chargeType: "Pick/Pack",
      basis: "Per Pallet",
      rate: "150.00",
      currency: "INR",
      effectiveFrom: "Jun 01, 2024",
    },
    {
      id: 6,
      name: "Shipping Admin Fee",
      chargeType: "Shipping",
      basis: "Per Shipment",
      rate: "500.00",
      currency: "INR",
      effectiveFrom: "Jan 01, 2024",
    },
  ];

  const ChargeTypePill = ({ value }) => {
    const map = {
      Storage: "bg-blue-50 text-blue-700",
      Inbound: "bg-green-50 text-green-700",
      "Pick/Pack": "bg-orange-50 text-orange-700",
      Shipping: "bg-gray-100 text-gray-700",
    };
    return (
      <span
        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
          map[value] || "bg-gray-100 text-gray-700"
        }`}
      >
        {value}
      </span>
    );
  };

  const columns = [
    {
      key: "name",
      title: "Rate Card Name",
      render: (row) => (
        <button className="font-semibold text-blue-600 hover:text-blue-700">
          {row.name}
        </button>
      ),
    },
    {
      key: "chargeType",
      title: "Charge Type",
      render: (row) => <ChargeTypePill value={row.chargeType} />,
    },
    { key: "basis", title: "Basis" },
    { key: "rate", title: "Rate" },
    { key: "currency", title: "Currency" },
    { key: "effectiveFrom", title: "Effective From" },
    {
      key: "actions",
      title: "Actions",
      render: () => (
        <div className="flex items-center justify-start gap-2">
          <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50">
            <Pencil size={16} />
          </button>
          <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50">
            <Copy size={16} />
          </button>
        </div>
      ),
    },
  ];

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({ chargeType: "All", search: "" });
  };

  const handleApply = () => {
    console.log("Filters applied:", filters);
  };

  return (
    <div className="min-h-screen ">
      <div className="mx-auto max-w-7xl px-6 py-6 space-y-5">
        {/* Filter row + New Rate Card (like Figma) */}
        <div className="rounded-xl border border-gray-200 bg-white p-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <FilterBar
                filters={filterConfig}
                onFilterChange={handleFilterChange}
                // onReset={handleReset}
                // onApply={handleApply}
              />
            </div>

            <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
              <Plus size={16} />
              New Rate Card
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-gray-200 bg-white">
          <CusTable columns={columns} data={rateCardsData} />
        </div>
      </div>
    </div>
  );
};

export default RateCards;
