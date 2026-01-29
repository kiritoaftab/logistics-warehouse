// tabs/AllocationTab.jsx
import React, { useMemo } from "react";
import { Play } from "lucide-react";
import CusTable from "../../../components/CusTable";
import { Pill } from "../helpers";
import { pillToneForAllocationStatus } from "../helpers";

const AllocationTab = () => {
  const stats = { full: 1, partial: 1, unallocated: 0 };

  const rows = useMemo(
    () => [
      {
        id: "1",
        sku: "SKU-1001-A",
        name: "Wireless Mouse Black",
        requested: 50,
        allocated: 50,
        short: 0,
        rule: "FIFO",
        status: "Full",
        action: "View Bins",
      },
      {
        id: "2",
        sku: "SKU-2040-X",
        name: "Mechanical Keyboard",
        requested: 20,
        allocated: 20,
        short: 0,
        rule: "FIFO",
        status: "Full",
        action: "View Bins",
      },
      {
        id: "3",
        sku: "SKU-8820-B",
        name: "Monitor Stand Pro",
        requested: 20,
        allocated: 10,
        short: 10,
        rule: "FIFO",
        status: "Partial",
        action: "View Bins",
        badge: "Manual",
      },
      {
        id: "4",
        sku: "SKU-9900-Q",
        name: "Webcam 4K Ultra",
        requested: 15,
        allocated: 0,
        short: 15,
        rule: "FIFO",
        status: "None",
        action: "Manual Allocate",
      },
    ],
    [],
  );

  const columns = useMemo(
    () => [
      {
        key: "sku",
        title: "SKU",
        render: (r) => (
          <div>
            <div className="text-sm font-semibold text-blue-600">{r.sku}</div>
            <div className="text-xs text-gray-500">{r.name}</div>
          </div>
        ),
      },
      { key: "requested", title: "Requested" },
      { key: "allocated", title: "Allocated" },
      {
        key: "short",
        title: "Short",
        render: (r) => (
          <span className={r.short > 0 ? "text-red-600 font-semibold" : ""}>
            {r.short}
          </span>
        ),
      },
      { key: "rule", title: "Rule" },
      {
        key: "status",
        title: "Status",
        render: (r) => (
          <Pill text={r.status} tone={pillToneForAllocationStatus(r.status)} />
        ),
      },
      {
        key: "actions",
        title: "Actions",
        render: (r) => (
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-xs rounded-md border bg-white">
              {r.action}
            </button>
            {r.badge && (
              <span className="px-2 py-1 text-xs rounded-md bg-blue-50 text-blue-700">
                {r.badge}
              </span>
            )}
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-gray-200 bg-white p-4 flex flex-wrap items-center gap-3 justify-between">
        <div className="flex flex-wrap items-center gap-6">
          <div className="text-sm text-gray-600">
            Full Lines{" "}
            <span className="ml-2 font-semibold text-gray-900">
              {stats.full}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            Partial Lines{" "}
            <span className="ml-2 font-semibold text-red-600">
              {stats.partial}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            Unallocated{" "}
            <span className="ml-2 font-semibold text-gray-900">
              {stats.unallocated}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-4 py-2 border rounded-md text-sm bg-white inline-flex items-center gap-2">
            <Play size={16} />
            Run Allocation
          </button>
          <button className="px-4 py-2 rounded-md text-sm bg-blue-600 text-white">
            Release to Picking
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
        <div className="px-4 py-3 border-b">
          <div className="text-sm font-semibold text-gray-900">
            Allocation Results
          </div>
        </div>
        <CusTable columns={columns} data={rows} />
      </div>
    </div>
  );
};

export default AllocationTab;
