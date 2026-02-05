// src/pages/reports/PutawayAging.jsx
import React, { useMemo, useState } from "react";
import { RefreshCw, Download, Search } from "lucide-react";

import PageHeader from "../components/PageHeader";
import FilterBar from "../components/FilterBar";
import StatCard from "../components/StatCard";
import CusTable from "../components/CusTable";
import { StatusPill, Badge } from "./components/helper";

export default function PutawayAging() {
  const [dateRange, setDateRange] = useState("This Week");
  const [zone, setZone] = useState("All Zones");
  const [user, setUser] = useState("All Users");
  const [search, setSearch] = useState("");

  const filtersObj = useMemo(
    () => ({ dateRange, zone, user, search }),
    [dateRange, zone, user, search],
  );

  const handleApply = () => console.log("Apply Filters:", filtersObj);

  const handleReset = () => {
    setDateRange("This Week");
    setZone("All Zones");
    setUser("All Users");
    setSearch("");
  };

  const data = [
    {
      id: "TSK-9001",
      taskId: "TSK-9001",
      grnNo: "GRN-2023-089",
      sku: "SKU-A100 (Widget X)",
      qty: 500,
      source: "Dock-01",
      suggestedBin: "A-01-02",
      assignedTo: "John Doe",
      createdTime: "Oct 24, 08:30 AM",
      aging: "26h 15m",
      status: "Pending",
    },
    {
      id: "TSK-9012",
      taskId: "TSK-9012",
      grnNo: "GRN-2023-095",
      sku: "SKU-C300 (Tool Z)",
      qty: 50,
      source: "Recv-Area",
      suggestedBin: "C-02-01",
      assignedTo: "Jane Smith",
      createdTime: "Oct 25, 06:00 AM",
      aging: "5h 45m",
      status: "In Progress",
    },
    {
      id: "TSK-9018",
      taskId: "TSK-9018",
      grnNo: "GRN-2023-098",
      sku: "SKU-D400 (Part A)",
      qty: 1000,
      source: "Dock-03",
      suggestedBin: "D-10-05",
      assignedTo: "-",
      createdTime: "Oct 25, 07:00 AM",
      aging: "4h 45m",
      status: "Pending",
    },
    {
      id: "TSK-9022",
      taskId: "TSK-9022",
      grnNo: "GRN-2023-101",
      sku: "SKU-E500 (Part B)",
      qty: 200,
      source: "Recv-Area",
      suggestedBin: "E-01-01",
      assignedTo: "Mike Ross",
      createdTime: "Oct 25, 10:00 AM",
      aging: "1h 45m",
      status: "Pending",
    },
    {
      id: "TSK-9025",
      taskId: "TSK-9025",
      grnNo: "GRN-2023-102",
      sku: "SKU-F600 (Part C)",
      qty: 50,
      source: "Dock-01",
      suggestedBin: "F-03-03",
      assignedTo: "Mike Ross",
      createdTime: "Oct 25, 10:30 AM",
      aging: "1h 15m",
      status: "Pending",
    },
  ];

  const filtered = useMemo(() => {
    const q = (search || "").toLowerCase().trim();
    if (!q) return data;
    return data.filter((r) =>
      [
        r.taskId,
        r.grnNo,
        r.sku,
        r.source,
        r.suggestedBin,
        r.assignedTo,
        r.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [data, search]);

  const columns = [
    {
      key: "taskId",
      title: "Task ID",
      render: (row) => (
        <button className="text-blue-600 hover:underline">{row.taskId}</button>
      ),
    },
    { key: "grnNo", title: "GRN No" },
    { key: "sku", title: "SKU" },
    { key: "qty", title: "Qty" },
    { key: "source", title: "Source" },
    { key: "suggestedBin", title: "Suggested Bin" },
    { key: "assignedTo", title: "Assigned To" },
    { key: "createdTime", title: "Created Time" },
    {
      key: "aging",
      title: "Aging",
      render: (row) => (
        <span
          className={
            row.aging.startsWith("26") ? "font-semibold text-red-600" : ""
          }
        >
          {row.aging}
        </span>
      ),
    },
    {
      key: "status",
      title: "Status",
      render: (row) => <StatusPill status={row.status} variant="task" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-5">
        <PageHeader
          title="Putaway Aging Report"
          subtitle="Monitor delays in stock movement from dock to storage"
          breadcrumbs={[
            { label: "Reports", to: "/reports" },
            { label: "Putaway Aging" },
          ]}
          actions={
            <>
              <button className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm">
                Refresh
              </button>
              <button className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm">
                Export CSV
              </button>
            </>
          }
        />

        {/* Filters (3 selects + Apply) */}
        <div className="mt-3">
          <FilterBar
            filters={[
              {
                key: "dateRange",
                label: "Date Range",
                value: dateRange,
                options: ["Today", "This Week", "This Month", "Last Week"],
              },
              {
                key: "zone",
                label: "Zone",
                value: zone,
                options: ["All Zones", "Zone A", "Zone B", "Zone C"],
              },
              {
                key: "user",
                label: "User",
                value: user,
                options: ["All Users", "John Doe", "Jane Smith", "Mike Ross"],
              },
            ]}
            onFilterChange={(key, val) => {
              if (key === "dateRange") setDateRange(val);
              if (key === "zone") setZone(val);
              if (key === "user") setUser(val);
            }}
            onApply={handleApply}
            onReset={handleReset}
            showActions={true}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <StatCard
            title="Total Tasks Created"
            value="158"
            accentColor="#2563EB"
            subtext="This week"
          />
          <StatCard
            title="Pending Tasks"
            value="45"
            accentColor="#F59E0B"
            subtext="Action required"
          />
          <div className="bg-white border rounded-lg p-4 relative overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full w-1"
              style={{ backgroundColor: "#FB923C" }}
            />
            <p className="text-sm text-gray-500">Aging &gt; 4 Hours</p>
            <p className="text-2xl font-semibold text-gray-900 mt-2">12</p>
            <div className="mt-2">
              <Badge text="+3 since morning" tone="orange" />
            </div>
          </div>
          <div className="bg-white border rounded-lg p-4 relative overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full w-1"
              style={{ backgroundColor: "#EF4444" }}
            />
            <p className="text-sm text-gray-500">Aging &gt; 24 Hours</p>
            <p className="text-2xl font-semibold text-gray-900 mt-2">2</p>
            <div className="mt-2">
              <Badge text="Critical" tone="red" />
            </div>
          </div>
        </div>

        {/* Detailed Task List */}
        <div className="mt-6 rounded-xl border border-gray-200 bg-white">
          <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              Detailed Task List
            </h3>

            <div className="relative w-full sm:w-[220px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-full rounded-md border border-gray-200 bg-white pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="Search task..."
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
