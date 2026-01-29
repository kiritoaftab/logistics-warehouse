// picking/PickTaskDetail.jsx
import React, { useMemo, useState } from "react";
import { X, ExternalLink, Clock, User, KeyRound } from "lucide-react";

const StatusChip = ({ text }) => {
  const map = {
    "In Progress": "bg-orange-100 text-orange-700",
    Done: "bg-green-100 text-green-700",
    Current: "bg-blue-100 text-blue-700",
    Pending: "bg-gray-100 text-gray-600",
  };
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        map[text] || "bg-gray-100 text-gray-700",
      ].join(" ")}
    >
      {text}
    </span>
  );
};

const StepBadge = ({ state, index }) => {
  // state: done | current | pending
  if (state === "done") {
    return (
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white text-xs font-bold">
        ✓
      </div>
    );
  }
  if (state === "current") {
    return (
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">
        {index}
      </div>
    );
  }
  return (
    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-500 text-xs font-bold">
      {index}
    </div>
  );
};

const PickTaskDetail = ({ taskId = "PT-2024-8901", onClose, onBack }) => {
  const [binScan, setBinScan] = useState("A-02-04"); // matches screenshot (green filled)
  const [skuScan, setSkuScan] = useState("");
  const [qty, setQty] = useState("");

  const taskInfo = useMemo(
    () => ({
      taskId,
      waveId: "WV-502",
      client: "Acme Corp",
      zone: "Z1-HighRack",
      assignedTo: "John Doe",
      orders: "5 Orders • 12 Lines",
      timeElapsed: "12m 30s",
      status: "In Progress",
    }),
    [taskId],
  );

  const steps = useMemo(
    () => [
      {
        idx: 1,
        state: "done",
        bin: "A-01-01",
        sku: "SKU-101",
        skuSub: "Widget Blue",
        req: 10,
        picked: 10,
        status: "Done",
      },
      {
        idx: 2,
        state: "current",
        bin: "A-02-04",
        sku: "SKU-500",
        skuSub: "Gadget Pro Max",
        req: 5,
        picked: 0,
        status: "Current",
      },
      {
        idx: 3,
        state: "pending",
        bin: "B-05-02",
        sku: "SKU-205",
        skuSub: "Accessory Kit",
        req: 20,
        picked: 0,
        status: "Pending",
      },
      {
        idx: 4,
        state: "pending",
        bin: "B-05-03",
        sku: "SKU-205",
        skuSub: "Accessory Kit",
        req: 15,
        picked: 0,
        status: "Pending",
      },
    ],
    [],
  );

  const current = steps.find((s) => s.state === "current") || steps[0];

  const handleConfirmPick = () => {
    if (binScan !== "A-02-04") {
      alert("Error: Wrong bin location!");
      return;
    }
    if (skuScan !== "SKU-500") {
      alert("Error: Wrong SKU!");
      return;
    }

    console.log("Pick confirmed:", { binScan, skuScan, quantity });
    setCurrentStep(3);
    setBinScan("");
    setSkuScan("");
    setQuantity("");
  };

  const handleRaiseException = () => {
    const reason = prompt("Enter exception reason (Shortage/Damage/Other):");
    if (reason) {
      const notes = prompt("Enter notes:");
      console.log("Exception raised:", { reason, notes });
      alert("Exception logged. Task marked as Exception.");
    }
  };

  const getStepIcon = (stepIndex) => {
    if (stepIndex < currentStep - 1) {
      return <CheckCircle className="text-green-500" size={16} />;
    }
    if (stepIndex === currentStep - 1) {
      return <Key className="text-orange-500" size={16} />;
    }
    return <div className="w-4 h-4 rounded-full border border-gray-300"></div>;
  };
  return (
    <div className="min-h-screen bg-[#E9F1FB] p-6">
      <div className="mx-auto 2xl:max-w-[1900px] space-y-4">
        {/* Top bar (breadcrumb + right actions) */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs text-gray-500">
              <span className="hover:text-gray-700 cursor-pointer">
                Picking
              </span>{" "}
              <span className="mx-1">›</span>
              <span className="hover:text-gray-700 cursor-pointer">
                Tasks
              </span>{" "}
              <span className="mx-1">›</span>
              <span className="font-semibold text-gray-700">
                Task #{taskInfo.taskId}
              </span>
            </div>

            <div className="text-2xl font-semibold text-gray-900">
              Pick Task Detail
            </div>
          </div>

          <div className="flex items-center gap-3">
            <StatusChip text={taskInfo.status} />

            <button
              type="button"
              className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700"
            >
              Save Progress
            </button>

            <button
              type="button"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white"
            >
              Complete Task
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600"
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Info card (single wide card like Figma) */}
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            <div>
              <div className="text-xs font-medium text-gray-500">Task ID</div>
              <div className="text-sm font-semibold text-gray-900">
                {taskInfo.taskId}
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-gray-500">Wave ID</div>
              <div className="text-sm font-semibold text-blue-600">
                {taskInfo.waveId}
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-gray-500">Client</div>
              <div className="text-sm font-semibold text-gray-900">
                {taskInfo.client}
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-gray-500">Zone</div>
              <div className="text-sm font-semibold text-gray-900">
                {taskInfo.zone}
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-gray-500">
                Assigned To
              </div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-gray-200" />
                <div className="text-sm font-semibold text-gray-900">
                  {taskInfo.assignedTo}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-5">
            <div className="md:col-span-2">
              <div className="text-xs font-medium text-gray-500">
                Orders / Lines
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {taskInfo.orders}
              </div>
            </div>

            <div className="md:col-span-3">
              <div className="text-xs font-medium text-gray-500">
                Time Elapsed
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <Clock size={14} className="text-gray-400" />
                {taskInfo.timeElapsed}
              </div>
            </div>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Left: Pick Steps */}
          <div className="lg:col-span-2 rounded-lg border border-gray-200 bg-white">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div className="text-sm font-semibold text-gray-900">
                Pick Steps (12)
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700">
                <KeyRound size={14} className="text-gray-500" />
                Sequence Enforced
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs font-semibold text-gray-500">
                  <tr>
                    <th className="px-5 py-3 text-left">#</th>
                    <th className="px-5 py-3 text-left">Bin</th>
                    <th className="px-5 py-3 text-left">SKU</th>
                    <th className="px-5 py-3 text-left">Req</th>
                    <th className="px-5 py-3 text-left">Picked</th>
                    <th className="px-5 py-3 text-left">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {steps.map((s) => {
                    const isCurrent = s.state === "current";
                    return (
                      <tr
                        key={s.idx}
                        className={[
                          "relative",
                          isCurrent ? "bg-blue-50" : "bg-white",
                        ].join(" ")}
                      >
                        {/* left blue highlight bar for current row */}
                        {isCurrent && (
                          <td
                            className="absolute left-0 top-0 h-full w-1 bg-blue-600"
                            aria-hidden
                          />
                        )}

                        <td className="px-5 py-4">
                          <StepBadge state={s.state} index={s.idx} />
                        </td>

                        <td className="px-5 py-4 font-semibold text-gray-900">
                          {s.bin}
                        </td>

                        <td className="px-5 py-4">
                          <div className="font-semibold text-gray-900">
                            {s.sku}
                          </div>
                          <div className="text-xs text-gray-500">
                            {s.skuSub}
                          </div>
                        </td>

                        <td className="px-5 py-4 text-gray-900">{s.req}</td>

                        <td className="px-5 py-4 text-gray-900">{s.picked}</td>

                        <td className="px-5 py-4">
                          <StatusChip text={s.status} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Scan & Confirm */}
          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div className="text-sm font-semibold text-gray-900">
                Scan &amp; Confirm
              </div>
              <button
                type="button"
                className="rounded-md p-2 text-gray-500 hover:bg-gray-50"
                title="Expand"
              >
                <ExternalLink size={16} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Summary card (inside right panel) */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-medium text-gray-500">
                      Pick From
                    </div>
                    <div className="text-lg font-semibold text-blue-600">
                      {current.bin}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-medium text-gray-500">
                      Required Qty
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      {current.req} EA
                    </div>
                  </div>

                  <div className="col-span-1">
                    <div className="text-xs font-medium text-gray-500">SKU</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {current.sku}
                    </div>
                    <div className="text-xs text-gray-500">
                      {current.skuSub} (Black Edition)
                    </div>
                  </div>

                  <div className="col-span-1 text-right">
                    <div className="text-xs font-medium text-gray-500">
                      Batch Required
                    </div>
                    <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                      Yes
                    </span>
                  </div>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    1. Scan Bin Location
                  </div>
                  <input
                    value={binScan}
                    onChange={(e) => setBinScan(e.target.value)}
                    className="mt-2 w-full rounded-md border border-gray-200 bg-green-100 px-3 py-2 text-sm text-gray-900 outline-none"
                    placeholder="A-02-04"
                  />
                </div>

                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    2. Scan SKU Barcode
                  </div>
                  <input
                    value={skuScan}
                    onChange={(e) => setSkuScan(e.target.value)}
                    className="mt-2 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400"
                    placeholder="Scan SKU..."
                  />
                </div>

                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    3. Confirm Quantity
                  </div>
                  <input
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    type="number"
                    className="mt-2 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400"
                    placeholder={`${current.req}`}
                    min={0}
                    max={current.req}
                  />
                </div>
              </div>

              {/* (If you want buttons inside right panel later, tell me; your screenshot cut them off.) */}
            </div>
          </div>
        </div>
        <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handleConfirmPick}
            className="flex-1 bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            Confirm Pick
          </button>
          <button
            onClick={handleRaiseException}
            className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors"
          >
            Raise Exception
          </button>
          <button className="px-6 border border-gray-300 text-gray-700 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors">
            Partial Pick
          </button>
        </div>
        {/* Optional back link (if you use it) */}
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600"
          >
            ← Back to Tasks
          </button>
        )}
      </div>
    </div>
  );
};

export default PickTaskDetail;
