import React, { useState } from "react";
import PutawayTaskSummary from "./PutawayTaskSummary";
import ScanConfirmCard from "./ScanConfirmCard";
import PutawayRightPanel from "./PutawayRightPanel";

const PutawayDetails = () => {
  const SIDEBAR_W = "left-64"; // change to left-72 / left-80 if your sidebar is wider

  const task = {
    status: "Pending",
    taskId: "PT-10923",
    grn: "GRN-2201",
    asn: "ASN-8829",
    skuName: "iPhone 14 Case",
    skuCode: "SKU-10293",
    qty: 500,
    qtyLabel: "500 Pcs",
    assignedTo: "Sarah L.",
    sourceLocation: "Recv. Bin-01 (Dock A)",
    suggestedZone: "Zone A - Electronics",
    suggestedBin: "A-04-01",
    createdAt: "Today, 10:05 AM",
    priority: "Normal",
    capacityUsedPercent: 75,
    remainingCapacityText: "~200 units",
    maxCapacityText: "Max: 1000 units",
  };

  const [scanSku, setScanSku] = useState("");
  const [goodQty, setGoodQty] = useState(500);
  const [holdQty, setHoldQty] = useState(0);

  const requiredQty = Number(task.qty || 0);
  const allocatedQty = Number(goodQty || 0);
  const remainingQty = Math.max(0, requiredQty - allocatedQty);

  return (
    <div className="min-h-screen bg-gray-50 pb-0">
      <PutawayTaskSummary task={task} />

      <div className="mx-auto 2xl:max-w-[1900px] px-6 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <ScanConfirmCard
              task={task}
              scanSku={scanSku}
              setScanSku={setScanSku}
              goodQty={goodQty}
              setGoodQty={setGoodQty}
              holdQty={holdQty}
              setHoldQty={setHoldQty}
            />
          </div>

          <div className="space-y-6">
            <PutawayRightPanel task={task} />
          </div>
        </div>
      </div>

      {/* Sticky Footer Summary (shifted right so it doesn't go under sidebar) */}
      <div
        className={[
          "bottom-0 right-0 z-50 border-t border-gray-200 bg-white",
          SIDEBAR_W,
        ].join(" ")}
      >
        <div className="mx-auto flex items-center justify-between gap-6 px-6 py-4 2xl:max-w-[1900px]">
          {/* Metrics */}
          <div className="flex items-center gap-8">
            <div className="min-w-[120px]">
              <div className="text-[11px] uppercase tracking-wide text-gray-500">
                Required
              </div>
              <div className="mt-1 text-xl font-semibold text-gray-900">
                {requiredQty}
              </div>
            </div>

            <div className="h-10 w-px bg-gray-200" />

            <div className="min-w-[120px]">
              <div className="text-[11px] uppercase tracking-wide text-gray-500">
                Allocated
              </div>
              <div className="mt-1 text-xl font-semibold text-blue-600">
                {allocatedQty}
              </div>
            </div>

            <div className="h-10 w-px bg-gray-200" />

            <div className="min-w-[120px]">
              <div className="text-[11px] uppercase tracking-wide text-gray-500">
                Remaining
              </div>
              <div className="mt-1 text-xl font-semibold text-gray-400">
                {remainingQty}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button className="rounded-lg border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-800 shadow-sm">
              Save Draft
            </button>

            <button
              disabled={remainingQty !== 0}
              className={[
                "rounded-lg px-6 py-2.5 text-sm font-medium shadow-sm",
                remainingQty === 0
                  ? "bg-blue-600 text-white"
                  : "cursor-not-allowed bg-blue-200 text-white",
              ].join(" ")}
            >
              Complete Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PutawayDetails;
