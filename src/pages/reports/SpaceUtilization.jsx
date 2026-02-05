// src/pages/reports/SpaceUtilization.jsx
import React, { useMemo, useState } from "react";
import { Download, RefreshCw, Search } from "lucide-react";

import PageHeader from "../components/PageHeader";
import FilterBar from "../components/FilterBar";
import StatCard from "../components/StatCard";
import CusTable from "../components/CusTable";
import { Badge, UtilBar } from "./components/helper";

export default function SpaceUtilization() {
  const [zone, setZone] = useState("All Zones");
  const [binType, setBinType] = useState("All Bin Types");
  const [utilStatus, setUtilStatus] = useState("Utilization Status");
  const [search, setSearch] = useState("");

  const filtersObj = useMemo(
    () => ({ zone, binType, utilStatus, search }),
    [zone, binType, utilStatus, search],
  );

  const handleApply = () => console.log("Apply Filters:", filtersObj);
  const handleReset = () => {
    setZone("All Zones");
    setBinType("All Bin Types");
    setUtilStatus("Utilization Status");
    setSearch("");
  };

  const data = [
    {
      id: "A-01-01",
      zone: "Zone A (Recv)",
      binCode: "A-01-01",
      capacity: 1000,
      used: 1050,
      utilization: 105,
      skus: 2,
      status: "Overfilled",
    },
    {
      id: "B-05-14",
      zone: "Zone B (Bulk)",
      binCode: "B-05-14",
      capacity: 500,
      used: 250,
      utilization: 50,
      skus: 1,
      status: "Active",
    },
    {
      id: "C-10-01",
      zone: "Zone C (Pick)",
      binCode: "C-10-01",
      capacity: 200,
      used: 180,
      utilization: 90,
      skus: 3,
      status: "High",
    },
    {
      id: "C-10-02",
      zone: "Zone C (Pick)",
      binCode: "C-10-02",
      capacity: 200,
      used: 0,
      utilization: 0,
      skus: 0,
      status: "Empty",
    },
    {
      id: "D-02-05",
      zone: "Zone D (Cold)",
      binCode: "D-02-05",
      capacity: 100,
      used: 100,
      utilization: 100,
      skus: 1,
      status: "Full",
    },
  ];

  const filtered = useMemo(() => {
    const q = (search || "").toLowerCase().trim();
    let rows = data;

    if (q) {
      rows = rows.filter((r) =>
        [r.zone, r.binCode, String(r.capacity), String(r.used), r.status]
          .join(" ")
          .toLowerCase()
          .includes(q),
      );
    }

    if (zone !== "All Zones")
      rows = rows.filter((r) => r.zone.startsWith(zone));
    if (utilStatus !== "Utilization Status")
      rows = rows.filter((r) => r.status === utilStatus);

    return rows;
  }, [data, search, zone, utilStatus]);

  const columns = [
    { key: "zone", title: "Zone" },
    {
      key: "binCode",
      title: "Bin Code",
      render: (row) => (
        <button className="text-blue-600 hover:underline">{row.binCode}</button>
      ),
    },
    { key: "capacity", title: "Capacity (Units)" },
    { key: "used", title: "Used" },
    {
      key: "utilization",
      title: "Utilization %",
      render: (row) => <UtilBar percent={row.utilization} />,
    },
    { key: "skus", title: "SKUs Count" },
    {
      key: "status",
      title: "Status",
      render: (row) => <StatusPill status={row.status} variant="space" />,
    },
    {
      key: "action",
      title: "Action",
      render: () => (
        <button className="rounded-md border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-800 hover:bg-gray-100">
          Inspect
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-5">
        <PageHeader
          title="Space Utilization Report"
          subtitle="Monitor bin capacity, utilization rates, and warehouse efficiency"
          breadcrumbs={[
            { label: "Reports", to: "/reports" },
            { label: "Space Utilization" },
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
                key: "zone",
                label: "Zone",
                value: zone,
                options: ["All Zones", "Zone A", "Zone B", "Zone C", "Zone D"],
              },
              {
                key: "binType",
                label: "Bin Type",
                value: binType,
                options: ["All Bin Types", "Recv", "Bulk", "Pick", "Cold"],
              },
              {
                key: "utilStatus",
                label: "Utilization Status",
                value: utilStatus,
                options: [
                  "Utilization Status",
                  "Overfilled",
                  "Full",
                  "High",
                  "Active",
                  "Empty",
                ],
              },
            ]}
            onFilterChange={(key, val) => {
              if (key === "zone") setZone(val);
              if (key === "binType") setBinType(val);
              if (key === "utilStatus") setUtilStatus(val);
            }}
            onApply={handleApply}
            onReset={handleReset}
            showActions={true}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <StatCard
            title="Total Bins"
            value="1,250"
            accentColor="#2563EB"
            subtext="Capacity stable"
          />

          <div className="bg-white border rounded-lg p-4 relative overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full w-1"
              style={{ backgroundColor: "#F59E0B" }}
            />
            <p className="text-sm text-gray-500">Avg Utilization</p>
            <p className="text-2xl font-semibold text-gray-900 mt-2">85%</p>
            <div className="mt-2">
              <Badge text="High Load" tone="orange" />
            </div>
          </div>

          <div className="bg-white border rounded-lg p-4 relative overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full w-1"
              style={{ backgroundColor: "#EF4444" }}
            />
            <p className="text-sm text-gray-500">Overfilled Bins</p>
            <p className="text-2xl font-semibold text-gray-900 mt-2">12</p>
            <div className="mt-2">
              <Badge text="Corrective action needed" tone="red" />
            </div>
          </div>

          <div className="bg-white border rounded-lg p-4 relative overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full w-1"
              style={{ backgroundColor: "#16A34A" }}
            />
            <p className="text-sm text-gray-500">Empty Bins</p>
            <p className="text-2xl font-semibold text-gray-900 mt-2">148</p>
            <div className="mt-2">
              <Badge text="Available space" tone="green" />
            </div>
          </div>
        </div>

        {/* Detailed Bin List */}
        <div className="mt-6 rounded-xl border border-gray-200 bg-white">
          <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              Detailed Bin List
            </h3>

            <div className="relative w-full sm:w-[260px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-full rounded-md border border-gray-200 bg-white pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="Search bin, SKU..."
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
