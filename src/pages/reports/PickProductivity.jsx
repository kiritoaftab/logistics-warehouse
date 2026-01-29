// src/pages/reports/PickProductivity.jsx
import React, { useMemo, useState } from "react";
import { Download, Printer } from "lucide-react";

import PageHeader from "../components/PageHeader";
import FilterBar from "../components/FilterBar";
import StatCard from "../components/StatCard";
import CusTable from "../components/CusTable";
import { AccuracyPill, Badge } from "./components/helper";

export default function PickProductivity() {
  const [dateRange, setDateRange] = useState("This Month (Oct 2023)");
  const [warehouse, setWarehouse] = useState("All Warehouses");
  const [user, setUser] = useState("All Users");

  const filtersObj = useMemo(
    () => ({ dateRange, warehouse, user }),
    [dateRange, warehouse, user],
  );

  const handleApply = () => console.log("Apply Filters:", filtersObj);

  const handleReset = () => {
    setDateRange("This Month (Oct 2023)");
    setWarehouse("All Warehouses");
    setUser("All Users");
  };

  const rows = [
    {
      id: "Marcus Johnson",
      picker: "Marcus Johnson",
      tasksCompleted: 420,
      linesPicked: 1250,
      unitsPicked: 3800,
      avgTime: "3m 12s",
      exceptions: 2,
      accuracy: 99.9,
    },
    {
      id: "Elena Rodriguez",
      picker: "Elena Rodriguez",
      tasksCompleted: 385,
      linesPicked: 1100,
      unitsPicked: 3250,
      avgTime: "3m 30s",
      exceptions: 5,
      accuracy: 99.5,
    },
    {
      id: "David Chen",
      picker: "David Chen",
      tasksCompleted: 310,
      linesPicked: 950,
      unitsPicked: 2800,
      avgTime: "4m 05s",
      exceptions: 1,
      accuracy: 99.9,
    },
    {
      id: "Priya Patel",
      picker: "Priya Patel",
      tasksCompleted: 290,
      linesPicked: 880,
      unitsPicked: 2450,
      avgTime: "4m 15s",
      exceptions: 8,
      accuracy: 99.1,
      avatar: true,
    },
    {
      id: "Robert Smith",
      picker: "Robert Smith",
      tasksCompleted: 450,
      linesPicked: 1400,
      unitsPicked: 4200,
      avgTime: "2m 55s",
      exceptions: 12,
      accuracy: 98.8,
    },
    {
      id: "Sarah Okafor",
      picker: "Sarah Okafor",
      tasksCompleted: 340,
      linesPicked: 1050,
      unitsPicked: 3100,
      avgTime: "3m 40s",
      exceptions: 3,
      accuracy: 99.7,
    },
  ];

  const columns = [
    {
      key: "picker",
      title: "Picker",
      render: (row) => (
        <div className="flex items-center gap-2">
          {/* optional avatar dot like screenshot */}
          {row.avatar ? (
            <div className="h-7 w-7 rounded-full bg-gray-200" />
          ) : null}

          <button className="text-blue-600 hover:underline">
            {row.picker}
          </button>
        </div>
      ),
    },
    { key: "tasksCompleted", title: "Tasks Completed" },
    { key: "linesPicked", title: "Lines Picked" },
    { key: "unitsPicked", title: "Units Picked" },
    { key: "avgTime", title: "Avg Time" },
    { key: "exceptions", title: "Exceptions" },
    {
      key: "accuracy",
      title: "Accuracy %",
      render: (row) => <AccuracyPill value={row.accuracy} />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-5">
        <PageHeader
          title="Pick Productivity"
          subtitle="Monitor picker throughput, time, and exceptions"
          breadcrumbs={[
            { label: "Reports", to: "/reports" },
            { label: "Pick Productivity" },
          ]}
          actions={
            <>
              <button className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm">
                <Download className="h-4 w-4" />
                Export Report
              </button>
              <button className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm">
                <Printer className="h-4 w-4" />
                Print
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
                options: [
                  "Today",
                  "This Week",
                  "This Month (Oct 2023)",
                  "Last Month",
                ],
              },
              {
                key: "warehouse",
                label: "Warehouse",
                value: warehouse,
                options: [
                  "All Warehouses",
                  "WH-NYC-01",
                  "WH-LA-02",
                  "WH-CHI-03",
                ],
              },
              {
                key: "user",
                label: "User",
                value: user,
                options: [
                  "All Users",
                  "Marcus Johnson",
                  "Elena Rodriguez",
                  "Priya Patel",
                ],
              },
            ]}
            onFilterChange={(key, val) => {
              if (key === "dateRange") setDateRange(val);
              if (key === "warehouse") setWarehouse(val);
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
            title="Picks / Hour"
            value="142"
            accentColor="#2563EB"
            subtext="Vs. last month"
          />

          <div className="bg-white border rounded-lg p-4 relative overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full w-1"
              style={{ backgroundColor: "#7C3AED" }}
            />
            <p className="text-sm text-gray-500">Avg Pick Task Time</p>

            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-2xl font-semibold text-gray-900">3m 45s</p>
              <span className="text-xs font-semibold text-red-600">↘ 12s</span>
            </div>

            <p className="mt-1 text-sm text-gray-500">Improved efficiency</p>
          </div>

          <div className="bg-white border rounded-lg p-4 relative overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full w-1"
              style={{ backgroundColor: "#0F766E" }}
            />
            <p className="text-sm text-gray-500">Exception Rate</p>

            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-2xl font-semibold text-gray-900">1.2%</p>
              <span className="text-xs font-medium text-gray-500">
                — Stable
              </span>
            </div>

            <p className="mt-1 text-sm text-gray-500">Target: &lt; 2.0%</p>
          </div>

          <StatCard
            title="Total Units Picked"
            value="24,580"
            accentColor="#16A34A"
            subtext="This month"
          />
        </div>

        {/* Table */}
        <div className="mt-6 rounded-xl border border-gray-200 bg-white">
          <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              Picker Performance Details
            </h3>

            <button className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
              View Exceptions
            </button>
          </div>

          <div className="p-2">
            <CusTable columns={columns} data={rows} />
          </div>
        </div>
      </div>
    </div>
  );
}
