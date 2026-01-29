// src/pages/reports/PackProductivity.jsx
import React, { useMemo, useState } from "react";
import { Download, RefreshCw, Search } from "lucide-react";

import PageHeader from "../components/PageHeader";
import FilterBar from "../components/FilterBar";
import StatCard from "../components/StatCard";
import CusTable from "../components/CusTable";
import { Badge } from "./components/helper";

const RatingPill = ({ rating }) => {
  const map = {
    "High Performer": "bg-green-100 text-green-700",
    Good: "bg-green-100 text-green-700",
    Average: "bg-orange-100 text-orange-700",
    "Needs Improvement": "bg-orange-100 text-orange-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        map[rating] || "bg-gray-100 text-gray-700"
      }`}
    >
      {rating}
    </span>
  );
};

export default function PackProductivity() {
  const [dateRange, setDateRange] = useState("This Month");
  const [packer, setPacker] = useState("All Packers");
  const [zone, setZone] = useState("All Zones");
  const [search, setSearch] = useState("");

  const filtersObj = useMemo(
    () => ({ dateRange, packer, zone, search }),
    [dateRange, packer, zone, search],
  );

  const handleApply = () => console.log("Apply Filters:", filtersObj);
  const handleReset = () => {
    setDateRange("This Month");
    setPacker("All Packers");
    setZone("All Zones");
    setSearch("");
  };

  const data = [
    {
      id: "James Miller",
      packer: "James Miller",
      ordersPacked: 145,
      cartonsCreated: 210,
      unitsPacked: 1050,
      avgTime: "5m 45s",
      reprints: 2,
      rating: "High Performer",
      avatar: true,
    },
    {
      id: "Arjun Patel",
      packer: "Arjun Patel",
      ordersPacked: 128,
      cartonsCreated: 185,
      unitsPacked: 920,
      avgTime: "6m 30s",
      reprints: 1,
      rating: "Good",
      avatar: true,
    },
    {
      id: "Sarah Johnson",
      packer: "Sarah Johnson",
      ordersPacked: 98,
      cartonsCreated: 145,
      unitsPacked: 650,
      avgTime: "7m 15s",
      reprints: 8,
      rating: "Average",
      avatar: true,
    },
    {
      id: "Kenji Tanaka",
      packer: "Kenji Tanaka",
      ordersPacked: 95,
      cartonsCreated: 130,
      unitsPacked: 600,
      avgTime: "7m 45s",
      reprints: 12,
      rating: "Needs Improvement",
      avatar: true,
    },
  ];

  const filtered = useMemo(() => {
    const q = (search || "").toLowerCase().trim();
    if (!q) return data;

    return data.filter((r) =>
      [
        r.packer,
        String(r.ordersPacked),
        String(r.cartonsCreated),
        String(r.unitsPacked),
        r.avgTime,
        String(r.reprints),
        r.rating,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [data, search]);

  const columns = [
    {
      key: "packer",
      title: "Packer",
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.avatar ? (
            <div className="h-7 w-7 rounded-full bg-gray-200" />
          ) : null}
          <button className="text-blue-600 hover:underline">
            {row.packer}
          </button>
        </div>
      ),
    },
    { key: "ordersPacked", title: "Orders Packed" },
    { key: "cartonsCreated", title: "Cartons Created" },
    { key: "unitsPacked", title: "Units Packed" },
    { key: "avgTime", title: "Avg Time / Order" },
    { key: "reprints", title: "Reprints" },
    {
      key: "rating",
      title: "Rating",
      render: (row) => <RatingPill rating={row.rating} />,
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
          title="Pack Productivity Report"
          subtitle="Analyze packing speed, carton output, and operational efficiency"
          breadcrumbs={[
            { label: "Reports", to: "/reports" },
            { label: "Pack Productivity" },
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
                key: "packer",
                label: "Packer",
                value: packer,
                options: [
                  "All Packers",
                  "James Miller",
                  "Arjun Patel",
                  "Sarah Johnson",
                  "Kenji Tanaka",
                ],
              },
              {
                key: "zone",
                label: "Zone",
                value: zone,
                options: ["All Zones", "Zone A", "Zone B", "Zone C"],
              },
            ]}
            onFilterChange={(key, val) => {
              if (key === "dateRange") setDateRange(val);
              if (key === "packer") setPacker(val);
              if (key === "zone") setZone(val);
            }}
            onApply={handleApply}
            onReset={handleReset}
            showActions={true}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="bg-white border rounded-lg p-4 relative overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full w-1"
              style={{ backgroundColor: "#2563EB" }}
            />
            <p className="text-sm text-gray-500">Cartons / Hour</p>
            <p className="text-2xl font-semibold text-gray-900 mt-2">58</p>
            <div className="mt-2">
              <Badge text="↗ +12% vs last month" tone="green" />
            </div>
          </div>

          <StatCard
            title="Avg Pack Time / Order"
            value="6m 10s"
            accentColor="#7C3AED"
            subtext="Stable"
          />

          <div className="bg-white border rounded-lg p-4 relative overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full w-1"
              style={{ backgroundColor: "#16A34A" }}
            />
            <p className="text-sm text-gray-500">Total Orders Packed</p>
            <p className="text-2xl font-semibold text-gray-900 mt-2">1,482</p>
            <div className="mt-2">
              <Badge text="+5% Volume" tone="green" />
            </div>
          </div>

          <div className="bg-white border rounded-lg p-4 relative overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full w-1"
              style={{ backgroundColor: "#0F766E" }}
            />
            <p className="text-sm text-gray-500">Label Reprints</p>
            <p className="text-2xl font-semibold text-gray-900 mt-2">42</p>
            <div className="mt-2">
              <Badge text="Low Rate (0.3%)" tone="green" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="mt-6 rounded-xl border border-gray-200 bg-white">
          <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              Packer Performance
            </h3>

            <div className="relative w-full sm:w-[260px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-full rounded-md border border-gray-200 bg-white pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="Search packer..."
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
