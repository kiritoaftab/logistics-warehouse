// packing/PackOrderDetail.jsx
import React, { useMemo, useState } from "react";
import {
  Printer,
  ListChecks,
  Plus,
  X,
  RotateCcw,
  FileText,
  Trash2,
} from "lucide-react";

const StatusChip = ({ text }) => {
  const map = {
    "Packing in Progress": "bg-blue-50 text-blue-700 border-blue-100",
    Closed: "bg-gray-100 text-gray-700 border-gray-200",
    Pending: "bg-orange-50 text-orange-700 border-orange-100",
    Waiting: "bg-sky-50 text-sky-700 border-sky-100",
  };
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
        map[text] || "bg-gray-50 text-gray-700 border-gray-200",
      ].join(" ")}
    >
      {text}
    </span>
  );
};

const Pill = ({ text }) => {
  const map = {
    Pending: "bg-orange-100 text-orange-700",
    Waiting: "bg-blue-100 text-blue-700",
    Packed: "bg-green-100 text-green-700",
  };
  return (
    <span
      className={[
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
        map[text] || "bg-gray-100 text-gray-700",
      ].join(" ")}
    >
      {text}
    </span>
  );
};

const PackOrderDetail = ({ orderId = "ORD-2024-8812", onBack }) => {
  const [cartonType, setCartonType] = useState("Standard Medium Box");
  const [weight, setWeight] = useState("1.2");
  const [scanSku, setScanSku] = useState("");
  const [packQty, setPackQty] = useState("1");

  const orderInfo = useMemo(
    () => ({
      orderNo: orderId,
      client: "Acme Corp",
      shipTo: "TechSolutions Inc, San Francisco",
      lines: 4,
      units: 45,
      packed: 12,
      status: "Packing in Progress",
    }),
    [orderId],
  );

  const items = useMemo(
    () => [
      {
        id: 1,
        sku: "SKU-9901",
        name: "Wireless Mouse",
        picked: 20,
        remaining: 8,
        status: "Pending",
      },
      {
        id: 2,
        sku: "SKU-1022",
        name: "USB-C Hub",
        picked: 10,
        remaining: 10,
        status: "Waiting",
      },
      {
        id: 3,
        sku: "SKU-5540",
        name: "Monitor Stand",
        picked: 5,
        remaining: 5,
        status: "Waiting",
      },
      {
        id: 4,
        sku: "SKU-3321",
        name: "Keyboard",
        picked: 10,
        remaining: 10,
        status: "Waiting",
      },
    ],
    [],
  );

  const cartonTypes = useMemo(
    () => [
      "Standard Small Box",
      "Standard Medium Box",
      "Standard Large Box",
      "Custom Box",
    ],
    [],
  );

  const cartonContents = useMemo(
    () => [{ id: 1, item: "SKU-9901 - Wireless Mouse", qty: 12 }],
    [],
  );

  const handleAddToCarton = () => {
    // TODO: integrate API later
    // eslint-disable-next-line no-alert
    alert(`Added ${packQty} of ${scanSku || "SKU"} to carton`);
    setScanSku("");
    setPackQty("1");
  };

  return (
    <div className="min-h-screen bg-[#F3F7FE] p-6">
      <div className="mx-auto 2xl:max-w-[1900px] space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs text-gray-500">
              <span className="hover:text-gray-700 cursor-pointer">
                Packing
              </span>{" "}
              <span className="mx-1">›</span>
              <span className="hover:text-gray-700 cursor-pointer">
                Pack Order
              </span>{" "}
              <span className="mx-1">›</span>
              <span className="font-semibold text-gray-700">Detail</span>
            </div>
            <div className="text-2xl font-semibold text-gray-900">
              Pack Order
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-blue-700">
              {orderInfo.status}
            </span>
            <button className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700">
              Save Progress
            </button>
            <button className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white">
              Finalize Packing
            </button>
            {/* optional back */}
            {onBack && (
              <button
                onClick={onBack}
                className="ml-2 rounded-md border border-gray-200 bg-white p-2 text-gray-600"
                title="Back"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Top info card */}
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-center">
            {/* Left order meta */}
            <div className="lg:col-span-6">
              <div className="text-lg font-semibold text-gray-900">
                {orderInfo.orderNo}
              </div>
              <div className="text-sm text-gray-700">{orderInfo.client}</div>
              <div className="text-sm text-gray-500">
                Ship to: {orderInfo.shipTo}
              </div>
            </div>

            {/* Middle stats */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-6">
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase">
                  LINES/UNITS
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {orderInfo.lines} <span className="text-gray-400">/</span>{" "}
                  {orderInfo.units}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase">
                  PACKED
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  <span className="text-blue-600">{orderInfo.packed}</span>{" "}
                  <span className="text-gray-400">/</span> {orderInfo.units}
                </div>
              </div>
            </div>

            {/* Right actions */}
            <div className="lg:col-span-2 flex flex-col gap-2 lg:items-end">
              <button className="w-full lg:w-[220px] rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 flex items-center justify-center gap-2">
                <Printer size={16} />
                Print Packing Slip
              </button>
              <button className="w-full lg:w-[220px] rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 flex items-center justify-center gap-2">
                <ListChecks size={16} />
                View Pick List
              </button>
            </div>
          </div>
        </div>

        {/* 3-column layout */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Left: Items to Pack */}
          <div className="lg:col-span-4 rounded-lg border border-gray-200 bg-white">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div className="text-sm font-semibold text-gray-900">
                Items to Pack
              </div>
              <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {orderInfo.lines} Lines
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs font-semibold text-gray-500">
                  <tr>
                    <th className="px-5 py-3 text-left">SKU</th>
                    <th className="px-5 py-3 text-left">Picked</th>
                    <th className="px-5 py-3 text-left">Rem.</th>
                    <th className="px-5 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((it) => (
                    <tr key={it.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <div className="font-semibold text-gray-900">
                          {it.sku}
                        </div>
                        <div className="text-xs text-gray-500">{it.name}</div>
                      </td>
                      <td className="px-5 py-4 text-gray-900">{it.picked}</td>
                      <td className="px-5 py-4 text-gray-900">
                        {it.remaining}
                      </td>
                      <td className="px-5 py-4">
                        <Pill text={it.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Middle: Current Carton */}
          <div className="lg:col-span-5 rounded-lg border border-gray-200 bg-white">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div className="text-sm font-semibold text-gray-900">
                Current Carton:{" "}
                <span className="text-blue-600 font-semibold">CTN-001</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700">
                  New
                </button>
                <button className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white">
                  Close
                </button>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-semibold text-gray-500 mb-2">
                    Carton Type
                  </div>
                  <select
                    value={cartonType}
                    onChange={(e) => setCartonType(e.target.value)}
                    className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {cartonTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="text-xs font-semibold text-gray-500 mb-2">
                    Weight (kg)
                  </div>
                  <input
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1.2"
                  />
                </div>
              </div>

              {/* Pack Item (blue section) */}
              <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 space-y-3">
                <div className="text-sm font-semibold text-gray-900">
                  Pack Item
                </div>

                <div>
                  <div className="text-xs font-semibold text-gray-500 mb-2">
                    Scan SKU
                  </div>
                  <div className="relative">
                    <input
                      value={scanSku}
                      onChange={(e) => setScanSku(e.target.value)}
                      className="w-full rounded-md border border-blue-200 bg-white px-3 py-2 pr-12 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Click to scan..."
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-2 rounded-md border border-blue-200 bg-white p-1.5 text-gray-600 hover:bg-gray-50"
                      title="Scan"
                    >
                      <RotateCcw size={16} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-3 items-end">
                  <div className="col-span-4">
                    <div className="text-xs font-semibold text-gray-500 mb-2">
                      Pack Qty
                    </div>
                    <input
                      type="number"
                      min={1}
                      value={packQty}
                      onChange={(e) => setPackQty(e.target.value)}
                      className="w-full rounded-md border border-blue-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="1"
                    />
                  </div>
                  <div className="col-span-8">
                    <button
                      onClick={handleAddToCarton}
                      className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white flex items-center justify-center gap-2 hover:bg-blue-700"
                    >
                      <Plus size={16} />
                      Add to Carton
                    </button>
                  </div>
                </div>
              </div>

              {/* Carton Contents */}
              <div className="space-y-2">
                <div className="text-sm font-semibold text-gray-900">
                  Carton Contents
                </div>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-xs font-semibold text-gray-500">
                      <tr>
                        <th className="px-4 py-3 text-left">Item</th>
                        <th className="px-4 py-3 text-left">Qty</th>
                        <th className="px-4 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {cartonContents.map((c) => (
                        <tr key={c.id}>
                          <td className="px-4 py-3 text-gray-900">{c.item}</td>
                          <td className="px-4 py-3 text-gray-900">{c.qty}</td>
                          <td className="px-4 py-3 text-right">
                            <button className="inline-flex items-center justify-center rounded-md p-2 text-red-500 hover:bg-red-50">
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Carton actions + checklist */}
          <div className="lg:col-span-3 space-y-4">
            <div className="rounded-lg border border-gray-200 bg-white p-5">
              <div className="text-sm font-semibold text-gray-900 mb-3">
                Carton Actions
              </div>

              <div className="space-y-2">
                <button className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 flex items-center gap-2">
                  <Printer size={16} />
                  Print Carton Label
                </button>
                <button className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 flex items-center gap-2">
                  <Printer size={16} />
                  Reprint Label
                </button>
                <button className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 flex items-center gap-2">
                  <FileText size={16} />
                  Add Note
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-5">
              <div className="text-sm font-semibold text-gray-900 mb-3">
                Completion Checklist
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">All items packed</span>
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500">
                    <X size={14} />
                  </span>
                </div>
                <div className="h-px bg-gray-100" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">All cartons closed</span>
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500">
                    <X size={14} />
                  </span>
                </div>
                <div className="h-px bg-gray-100" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">Labels generated</span>
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500">
                    <X size={14} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Optional back link */}
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600"
          >
            ← Back to Packing
          </button>
        )}
      </div>
    </div>
  );
};

export default PackOrderDetail;
