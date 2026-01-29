// src/pages/reports/BillingRevenue.jsx
import React, { useMemo, useState } from "react";
import { RefreshCw, Download, Search } from "lucide-react";

import PageHeader from "../components/PageHeader";
import FilterBar from "../components/FilterBar";
import StatCard from "../components/StatCard";
import CusTable from "../components/CusTable";
import { Badge } from "./components/helper";

const NumPill = ({ value, tone = "green" }) => {
  const tones = {
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    orange: "bg-orange-100 text-orange-700",
    gray: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        tones[tone] || tones.gray
      }`}
    >
      {value}
    </span>
  );
};

export default function BillingRevenue() {
  const [dateRange, setDateRange] = useState("This Month");
  const [client, setClient] = useState("All Clients");
  const [chargeType, setChargeType] = useState("All Charge Types");
  const [search, setSearch] = useState("");

  const filtersObj = useMemo(
    () => ({ dateRange, client, chargeType, search }),
    [dateRange, client, chargeType, search],
  );

  const handleApply = () => console.log("Apply Filters:", filtersObj);
  const handleReset = () => {
    setDateRange("This Month");
    setClient("All Clients");
    setChargeType("All Charge Types");
    setSearch("");
  };

  const rows = [
    {
      id: "TechRetail Inc.",
      customer: "TechRetail Inc.",
      eventsCount: 2450,
      blocked: 0,
      invoices: 12,
      totalBilled: "₹1,85,000",
      outstanding: "₹45,000",
      overdue: 0,
    },
    {
      id: "Global Fashion Ltd.",
      customer: "Global Fashion Ltd.",
      eventsCount: 1800,
      blocked: 85,
      invoices: 8,
      totalBilled: "₹1,42,500",
      outstanding: "₹1,42,500",
      overdue: 25000,
    },
    {
      id: "Fresh Foods Co.",
      customer: "Fresh Foods Co.",
      eventsCount: 950,
      blocked: 12,
      invoices: 14,
      totalBilled: "₹85,000",
      outstanding: "₹12,000",
      overdue: 0,
    },
    {
      id: "AutoParts Express",
      customer: "AutoParts Express",
      eventsCount: 320,
      blocked: 31,
      invoices: 5,
      totalBilled: "₹28,400",
      outstanding: "₹28,400",
      overdue: 12000,
    },
    {
      id: "Home Decor Plus",
      customer: "Home Decor Plus",
      eventsCount: 80,
      blocked: 0,
      invoices: 3,
      totalBilled: "₹9,100",
      outstanding: "₹0",
      overdue: 0,
    },
  ];

  const filtered = useMemo(() => {
    const q = (search || "").toLowerCase().trim();
    if (!q) return rows;

    return rows.filter((r) =>
      [
        r.customer,
        String(r.eventsCount),
        String(r.blocked),
        String(r.invoices),
        r.totalBilled,
        r.outstanding,
        String(r.overdue),
      ]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [rows, search]);

  const columns = [
    {
      key: "customer",
      title: "Customer",
      render: (row) => (
        <button className="text-blue-600 hover:underline">
          {row.customer}
        </button>
      ),
    },
    { key: "eventsCount", title: "Events Count" },
    {
      key: "blocked",
      title: "Blocked",
      render: (row) => {
        const n = Number(row.blocked || 0);
        if (n === 0) return <NumPill value="0" tone="green" />;
        if (n >= 50) return <NumPill value={n} tone="red" />;
        return <NumPill value={n} tone="orange" />;
      },
    },
    { key: "invoices", title: "Invoices" },
    { key: "totalBilled", title: "Total Billed" },
    { key: "outstanding", title: "Outstanding" },
    {
      key: "overdue",
      title: "Overdue",
      render: (row) => {
        const n = Number(row.overdue || 0);
        if (n === 0) return <NumPill value="₹0" tone="green" />;
        if (n >= 20000)
          return <NumPill value={`₹${n.toLocaleString()}`} tone="red" />;
        return <NumPill value={`₹${n.toLocaleString()}`} tone="orange" />;
      },
    },
    {
      key: "action",
      title: "Action",
      render: () => (
        <button className="rounded-md border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-800 hover:bg-gray-100">
          Details
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-5">
        <PageHeader
          title="Billing Cycle & Revenue"
          subtitle="Track revenue generation, billable events, and payment efficiency"
          breadcrumbs={[
            { label: "Reports", to: "/reports" },
            { label: "Billing & Revenue" },
          ]}
          actions={
            <>
              <button className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
              <button className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm">
                <Download className="h-4 w-4" />
                Export CSV
              </button>
            </>
          }
        />

        {/* Filters */}
        <div className="mt-3">
          <FilterBar
            filters={[
              {
                key: "dateRange",
                label: "Date Range",
                value: dateRange,
                options: ["Today", "This Week", "This Month", "Last Month"],
              },
              {
                key: "client",
                label: "Client",
                value: client,
                options: [
                  "All Clients",
                  "TechRetail Inc.",
                  "Global Fashion Ltd.",
                  "Fresh Foods Co.",
                  "AutoParts Express",
                ],
              },
              {
                key: "chargeType",
                label: "Charge Type",
                value: chargeType,
                options: [
                  "All Charge Types",
                  "Storage",
                  "Handling",
                  "Pick/Pack",
                  "Transportation",
                ],
              },
            ]}
            onFilterChange={(key, val) => {
              if (key === "dateRange") setDateRange(val);
              if (key === "client") setClient(val);
              if (key === "chargeType") setChargeType(val);
            }}
            onApply={handleApply}
            onReset={handleReset}
            showActions={true}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          <div className="bg-white border rounded-lg p-4 relative overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full w-1"
              style={{ backgroundColor: "#16A34A" }}
            />
            <p className="text-sm text-gray-500">Est. Revenue</p>
            <p className="text-2xl font-semibold text-gray-900 mt-2">
              ₹4,50,000
            </p>
            <div className="mt-2">
              <Badge text="↗ +8% vs last month" tone="green" />
            </div>
          </div>

          <div className="bg-white border rounded-lg p-4 relative overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full w-1"
              style={{ backgroundColor: "#2563EB" }}
            />
            <p className="text-sm text-gray-500">Billable Events</p>
            <p className="text-2xl font-semibold text-gray-900 mt-2">5,600</p>
            <div className="mt-2">
              <Badge text="+12% Activity" tone="green" />
            </div>
          </div>

          <div className="bg-white border rounded-lg p-4 relative overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full w-1"
              style={{ backgroundColor: "#EF4444" }}
            />
            <p className="text-sm text-gray-500">Blocked Events</p>
            <p className="text-2xl font-semibold text-red-600 mt-2">128</p>
            <div className="mt-2">
              <Badge text="Needs Attention" tone="red" />
            </div>
          </div>

          <StatCard
            title="Invoices Raised"
            value="42"
            accentColor="#7C3AED"
            subtext="On Schedule"
          />

          <div className="bg-white border rounded-lg p-4 relative overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full w-1"
              style={{ backgroundColor: "#0F766E" }}
            />
            <p className="text-sm text-gray-500">Avg Billing Cycle</p>
            <p className="text-2xl font-semibold text-gray-900 mt-2">
              2.5 Days
            </p>
            <div className="mt-2">
              <Badge text="-0.5 Days faster" tone="green" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="mt-6 rounded-xl border border-gray-200 bg-white">
          <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              Customer Revenue Performance
            </h3>

            <div className="relative w-full sm:w-[280px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-full rounded-md border border-gray-200 bg-white pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="Search customer..."
              />
            </div>
          </div>

          <div className="p-2">
            <CusTable columns={columns} data={filtered} />
          </div>
        </div>
      </div>
    </div>
  );
}
