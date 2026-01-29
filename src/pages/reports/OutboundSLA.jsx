// src/pages/reports/OutboundSLA.jsx
import React, { useMemo, useState } from "react";
import { Download, Printer } from "lucide-react";

import PageHeader from "../components/PageHeader";
import FilterBar from "../components/FilterBar";
import StatCard from "../components/StatCard";
import CusTable from "../components/CusTable";
import { Badge } from "./components/helper";

// Priority pill (HIGH / NORMAL)
const PriorityPill = ({ value }) => {
  const map = {
    HIGH: "bg-red-100 text-red-700",
    NORMAL: "bg-blue-100 text-blue-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        map[value] || "bg-gray-100 text-gray-700"
      }`}
    >
      {value}
    </span>
  );
};

// SLA Status pill (Within SLA / Breached)
const SLAStatusPill = ({ value }) => {
  const isBreached = String(value).toLowerCase().includes("breached");

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        isBreached ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
      }`}
    >
      {value}
    </span>
  );
};

export default function OutboundSLA() {
  const [dateRange, setDateRange] = useState("This Month (Oct 2023)");
  const [warehouse, setWarehouse] = useState("All Warehouses");
  const [client, setClient] = useState("All Clients");

  const filtersObj = useMemo(
    () => ({ dateRange, warehouse, client }),
    [dateRange, warehouse, client],
  );

  const handleApply = () => console.log("Apply Filters:", filtersObj);
  const handleReset = () => {
    setDateRange("This Month (Oct 2023)");
    setWarehouse("All Warehouses");
    setClient("All Clients");
  };

  const rows = [
    {
      id: "ORD-2023-8842",
      orderNo: "ORD-2023-8842",
      priority: "HIGH",
      slaDue: "Oct 24, 14:00",
      pickedTime: "Oct 24, 10:30",
      packedTime: "Oct 24, 11:45",
      shippedTime: "Oct 24, 13:30",
      slaStatus: "Within SLA",
    },
    {
      id: "ORD-2023-8843",
      orderNo: "ORD-2023-8843",
      priority: "NORMAL",
      slaDue: "Oct 25, 10:00",
      pickedTime: "Oct 24, 16:00",
      packedTime: "Oct 24, 17:15",
      shippedTime: "Oct 25, 09:00",
      slaStatus: "Within SLA",
    },
    {
      id: "ORD-2023-8840",
      orderNo: "ORD-2023-8840",
      priority: "HIGH",
      slaDue: "Oct 24, 12:00",
      pickedTime: "Oct 24, 10:00",
      packedTime: "Oct 24, 11:30",
      shippedTime: "Oct 24, 12:30",
      slaStatus: "Breached (+30m)",
    },
    {
      id: "ORD-2023-8835",
      orderNo: "ORD-2023-8835",
      priority: "NORMAL",
      slaDue: "Oct 24, 18:00",
      pickedTime: "Oct 24, 12:15",
      packedTime: "Oct 24, 13:45",
      shippedTime: "Oct 24, 15:30",
      slaStatus: "Within SLA",
    },
    {
      id: "ORD-2023-8831",
      orderNo: "ORD-2023-8831",
      priority: "HIGH",
      slaDue: "Oct 24, 10:00",
      pickedTime: "Oct 23, 16:00",
      packedTime: "Oct 23, 17:30",
      shippedTime: "Oct 24, 10:15",
      slaStatus: "Breached (+15m)",
    },
    {
      id: "ORD-2023-8828",
      orderNo: "ORD-2023-8828",
      priority: "NORMAL",
      slaDue: "Oct 24, 16:00",
      pickedTime: "Oct 24, 09:00",
      packedTime: "Oct 24, 10:30",
      shippedTime: "Oct 24, 13:00",
      slaStatus: "Within SLA",
    },
  ];

  const columns = [
    {
      key: "orderNo",
      title: "Order No",
      render: (row) => (
        <button className="text-blue-600 hover:underline">{row.orderNo}</button>
      ),
    },
    {
      key: "priority",
      title: "Priority",
      render: (row) => <PriorityPill value={row.priority} />,
    },
    { key: "slaDue", title: "SLA Due" },
    { key: "pickedTime", title: "Picked Time" },
    { key: "packedTime", title: "Packed Time" },
    { key: "shippedTime", title: "Shipped Time" },
    {
      key: "slaStatus",
      title: "SLA Status",
      render: (row) => <SLAStatusPill value={row.slaStatus} />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-5">
        <PageHeader
          title="Outbound SLA Performance"
          subtitle="Monitor on-time shipping and SLA breaches"
          breadcrumbs={[
            { label: "Reports", to: "/reports" },
            { label: "Outbound SLA" },
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
                key: "client",
                label: "Client",
                value: client,
                options: ["All Clients", "Acme Corp", "Globex", "Initech"],
              },
            ]}
            onFilterChange={(key, val) => {
              if (key === "dateRange") setDateRange(val);
              if (key === "warehouse") setWarehouse(val);
              if (key === "client") setClient(val);
            }}
            onApply={handleApply}
            onReset={handleReset}
            showActions={true}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <StatCard
            title="Orders Shipped"
            value="1,240"
            accentColor="#2563EB"
            subtext="Total shipped volume"
          />

          <StatCard
            title="Shipped Within SLA"
            value="98.5%"
            accentColor="#16A34A"
            subtext="Target: > 98%"
          />

          <div className="bg-white border rounded-lg p-4 relative overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full w-1"
              style={{ backgroundColor: "#7C3AED" }}
            />
            <p className="text-sm text-gray-500">Avg Cycle Time</p>
            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-2xl font-semibold text-gray-900">4h 15m</p>
              <span className="text-xs font-semibold text-red-600">↘ 10m</span>
            </div>
            <p className="mt-1 text-sm text-gray-500">Confirm to Ship</p>
          </div>

          <div className="bg-white border rounded-lg p-4 relative overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full w-1"
              style={{ backgroundColor: "#EF4444" }}
            />
            <p className="text-sm text-gray-500">SLA Breaches</p>

            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-2xl font-semibold text-gray-900">18</p>
              <span className="text-xs font-medium text-gray-500">
                — Stable
              </span>
            </div>

            <p className="mt-1 text-sm text-gray-500">Late shipments</p>
          </div>
        </div>

        {/* Table */}
        <div className="mt-6 rounded-xl border border-gray-200 bg-white">
          <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              Shipment SLA Details
            </h3>

            <button className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
              Show Breaches Only
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
