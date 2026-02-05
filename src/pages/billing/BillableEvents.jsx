import React, { useState } from "react";
import FilterBar from "../components/FilterBar";
import CusTable from "../components/CusTable";
import { Download, Plus, Play, Eye } from "lucide-react";

const BillableEvents = () => {
  const [filters, setFilters] = useState({
    period: "This Month",
    warehouse: "WH-NYC-01",
    clients: "All Clients",
    status: "All",
    search: "",
  });

  // Tabs (UI only for now)
  const tabs = [
    { id: "billable", label: "Billable Events" },
    { id: "ready", label: "Ready to Invoice" },
    { id: "invoiced", label: "Invoiced" },
    { id: "payments", label: "Payments / Aging" },
    { id: "rate", label: "Rate Cards" },
  ];
  const [activeTab, setActiveTab] = useState("billable");

  const filterConfig = [
    {
      key: "period",
      label: "",
      value: filters.period,
      options: ["This Month", "Last Month", "This Quarter", "Custom Range"],
    },
    {
      key: "warehouse",
      label: "",
      value: filters.warehouse,
      options: ["WH-NYC-01", "WH-LA-02", "WH-CHI-03"],
    },
    {
      key: "clients",
      label: "",
      value: filters.clients,
      options: ["All Clients", "Acme Retail", "Global Foods", "TechSource"],
    },
    {
      key: "status",
      label: "",
      value: filters.status,
      options: ["All", "Pending", "Ready", "Blocked"],
    },
    {
      key: "search",
      type: "search",
      label: "",
      placeholder: "Search Invoice, Order, ASN...",
      value: filters.search,
      className: "min-w-[320px]",
    },
  ];

  // Stats cards data (match Figma)
  const statsCards = [
    { title: "Storage Charges", amount: "₹45,200", status: "Pending" },
    { title: "Handling Charges", amount: "₹12,450", status: "Inbound pending" },
    {
      title: "Pick/Pack Charges",
      amount: "₹28,800",
      status: "Outbound pending",
    },
    { title: "Shipping Admin", amount: "₹5,100", status: "Pending" },
    {
      title: "Blocked Events",
      amount: "24",
      status: "Missing rate cards",
      danger: true,
    },
  ];

  // Events data
  const eventsData = [
    {
      id: 1,
      eventId: "EVT-9001",
      type: "Storage",
      reference: "Daily - Oct 24",
      customer: "Acme Retail",
      basis: "450 Pallets",
      rate: "₹20/pallet",
      amount: "₹9,000",
      status: "Pending",
    },
    {
      id: 2,
      eventId: "EVT-9002",
      type: "Inbound",
      reference: "ASN-2024-088",
      customer: "Global Foods",
      basis: "240 Units",
      rate: "₹2/unit",
      amount: "₹480",
      status: "Ready",
    },
    {
      id: 3,
      eventId: "EVT-9005",
      type: "Picking",
      reference: "ORD-10045",
      customer: "TechSource",
      basis: "12 Lines",
      rate: "-",
      amount: "-",
      status: "Blocked",
    },
    {
      id: 4,
      eventId: "EVT-9008",
      type: "Packing",
      reference: "ORD-10045",
      customer: "TechSource",
      basis: "4 Cartons",
      rate: "₹50/carton",
      amount: "₹200",
      status: "Pending",
    },
    {
      id: 5,
      eventId: "EVT-9012",
      type: "Shipping",
      reference: "SHP-9901",
      customer: "Acme Retail",
      basis: "1 Shipment",
      rate: "₹150",
      amount: "₹150",
      status: "Pending",
    },
    {
      id: 6,
      eventId: "EVT-9015",
      type: "Putaway",
      reference: "GRN-5502",
      customer: "Urban Styles",
      basis: "500 Units",
      rate: "₹1.5/unit",
      amount: "₹750",
      status: "Ready",
    },
  ];

  const StatusPill = ({ value }) => {
    const styles = {
      Pending: "bg-blue-50 text-blue-700",
      Ready: "bg-green-50 text-green-700",
      Blocked: "bg-red-50 text-red-700",
    };
    return (
      <span
        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
          styles[value] || "bg-gray-100 text-gray-700"
        }`}
      >
        {value}
      </span>
    );
  };

  const TypeChip = ({ value }) => (
    <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
      {value}
    </span>
  );

  const columns = [
    { key: "eventId", title: "Event ID" },
    {
      key: "type",
      title: "Type",
      render: (row) => <TypeChip value={row.type} />,
    },
    {
      key: "reference",
      title: "Reference",
      render: (row) => (
        <button className="font-semibold text-blue-600 hover:text-blue-700">
          {row.reference}
        </button>
      ),
    },
    { key: "customer", title: "Customer" },
    { key: "basis", title: "Basis" },
    { key: "rate", title: "Rate" },
    { key: "amount", title: "Amount" },
    {
      key: "status",
      title: "Status",
      render: (row) => <StatusPill value={row.status} />,
    },
    {
      key: "actions",
      title: "Actions",
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          {row.status === "Blocked" ? (
            <button className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700">
              Fix Rate
            </button>
          ) : (
            <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50">
              <Eye size={16} />
            </button>
          )}
        </div>
      ),
    },
  ];

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({
      period: "This Month",
      warehouse: "WH-NYC-01",
      clients: "All Clients",
      status: "All",
      search: "",
    });
  };

  const handleApply = () => {
    console.log("Filters applied:", filters);
  };

  return (
    <div className="min-h-screen ">
      <div className="mx-auto max-w-7xl space-y-5">
        {/* FilterBar (uses your component) */}
        <div className="rounded-xl border border-gray-200 bg-white p-3">
          <FilterBar
            filters={filterConfig}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
            onApply={handleApply}
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className={`rounded-xl border p-4 ${
                stat.danger
                  ? "border-red-200 bg-red-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <p
                className={`text-sm font-medium ${
                  stat.danger ? "text-red-700" : "text-gray-500"
                }`}
              >
                {stat.title}
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {stat.amount}
              </p>
              <p
                className={`mt-1 text-sm ${
                  stat.danger ? "text-red-600" : "text-gray-500"
                }`}
              >
                {stat.status}
              </p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="rounded-xl border border-gray-200 bg-white">
          <CusTable columns={columns} data={eventsData} />
        </div>
      </div>
    </div>
  );
};

export default BillableEvents;
