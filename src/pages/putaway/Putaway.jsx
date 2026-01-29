import React from "react";
import PageHeader from "../components/PageHeader";
import FilterBar from "../components/FilterBar";
import CusTable from "../components/CusTable";
import { useNavigate } from "react-router-dom";

const Putaway = () => {
  const navigate = useNavigate();
  const filters = [
    {
      type: "select",
      label: "Date Range",
      value: "Today",
      className: "w-[140px]",
    },
    {
      type: "select",
      label: "Warehouse",
      value: "WH-NYC-01",
      className: "w-[140px]",
    },
    {
      type: "select",
      label: "Client",
      value: "All Clients",
      className: "w-[140px]",
    },
    {
      type: "select",
      label: "Status",
      value: "All Statuses",
      className: "w-[140px]",
    },
    {
      type: "select",
      label: "Source",
      value: "All Sources",
      className: "w-[140px]",
    },
    {
      type: "select",
      label: "Zone",
      value: "All Zones",
      className: "w-[140px]",
    },
    {
      type: "search",
      label: "Search",
      placeholder: "Task ID / ASN / GRN / SKU",
      className: "w-[260px]",
    },
  ];

  const columns = [
    {
      key: "select",
      title: "",
      render: () => <input type="checkbox" className="h-4 w-4" />,
    },

    {
      key: "taskId",
      title: "Task ID",
      render: (row) => (
        <div className="leading-tight">
          <div className="text-xs text-gray-400">PT</div>
          <div className="text-sm font-semibold text-blue-600">
            {row.taskId}
          </div>
        </div>
      ),
    },
    {
      key: "grn",
      title: "GRN No",
      render: (row) => (
        <div className="text-sm font-semibold text-blue-600">{row.grn}</div>
      ),
    },
    {
      key: "asn",
      title: "ASN No",
      render: (row) => (
        <div className="text-sm font-semibold text-blue-600">{row.asn}</div>
      ),
    },
    {
      key: "sku",
      title: "SKU Details",
      render: (row) => (
        <div className="leading-tight">
          <div className="text-sm font-medium text-gray-900">
            {row.skuTitle}
          </div>
          <div className="text-xs text-gray-400">{row.skuSub}</div>
        </div>
      ),
    },
    { key: "qty", title: "Qty" },
    { key: "source", title: "Source" },
    { key: "destLoc", title: "Dest. Loc" },
    {
      key: "status",
      title: "Status",
      render: (row) => {
        const isPending = row.status === "Pending";
        const isCompleted = row.status === "Completed";
        return (
          <span
            className={[
              "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
              isPending ? "bg-orange-100 text-orange-700" : "",
              isCompleted ? "bg-green-100 text-green-700" : "",
              !isPending && !isCompleted ? "bg-gray-100 text-gray-700" : "",
            ].join(" ")}
          >
            {row.status}
          </span>
        );
      },
    },
    { key: "assigned", title: "Assigned To" },
    { key: "created", title: "Created" },
    {
      key: "action",
      title: "Action",
      render: (row) => (
        <button
          onClick={() => navigate("/putawaydetails")}
          className={[
            "rounded-md px-4 py-2 text-sm font-medium",
            row.status === "Pending"
              ? "bg-blue-600 text-white"
              : "border border-gray-200 bg-white text-gray-700",
          ].join(" ")}
        >
          {row.status === "Pending" ? "Start" : "View"}
        </button>
      ),
    },
  ];

  const data = [
    {
      id: 1,
      taskId: "10923",
      grn: "GRN-2201",
      asn: "ASN-8829",
      skuTitle: "iPhone 14 Case",
      skuSub: "SKU-10293",
      qty: "500 Pcs",
      source: "Recv. Bin-01",
      destLoc: "A-04-01 Zone A",
      status: "Pending",
      assigned: "-",
      created: "10:05 AM",
    },
    {
      id: 2,
      taskId: "10920",
      grn: "GRN-2199",
      asn: "ASN-8825",
      skuTitle: "Wireless Mouse",
      skuSub: "SKU-44120",
      qty: "120 Pcs",
      source: "Dock D-02",
      destLoc: "A-01-05 Zone A",
      status: "Completed",
      assigned: "Mike R.",
      created: "08:30 AM",
    },
  ];

  return (
    <div className="min-h-screen  p-6">
      <PageHeader
        title="Putaway Tasks"
        subtitle="Move received stock from dock to storage locations"
        actions={
          <>
            <button className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700">
              Export
            </button>
            <button className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white">
              Assign Tasks
            </button>
          </>
        }
      />

      <FilterBar filters={filters} />

      {/* Status Cards (match screenshot count/layout) */}
      <div className="mb-4 grid grid-cols-5 gap-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-xs text-gray-500">Total Tasks</div>
          <div className="mt-2 text-2xl font-semibold text-gray-900">142</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-xs text-gray-500">Pending</div>
          <div className="mt-2 text-2xl font-semibold text-gray-900">85</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-xs text-gray-500">In Progress</div>
          <div className="mt-2 text-2xl font-semibold text-blue-600">24</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-xs text-gray-500">Completed</div>
          <div className="mt-2 text-2xl font-semibold text-gray-900">1</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-xs text-gray-500">Aging &gt; 4h</div>
          <div className="mt-2 text-2xl font-semibold text-red-600">12</div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-200 bg-white">
        {/* table top selection bar */}
        <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3 text-sm text-gray-500">
          <input type="checkbox" className="h-4 w-4" />
          <span>0 Selected</span>
        </div>

        <CusTable columns={columns} data={data} />
      </div>

      {/* Guidelines */}
      <div className="mt-4 rounded-md border border-yellow-200 bg-yellow-50 p-4 text-sm text-gray-700">
        <div className="font-semibold text-gray-900 mb-1">
          Putaway Guidelines
        </div>
        <ul className="list-disc pl-5 space-y-1">
          <li>Putaway quantity cannot exceed the received quantity.</li>
          <li>
            If the suggested location capacity is reached, you must flag the
            task and request an alternate location.
          </li>
          <li>
            Batch and Expiry details must be verified physically before
            confirming the task.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Putaway;
