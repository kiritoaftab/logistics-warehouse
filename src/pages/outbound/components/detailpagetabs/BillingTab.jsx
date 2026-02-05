// src/pages/outbound/components/detailpagetabs/BillingTab.jsx
import React, { useState } from "react";
import {
  CheckCircle2,
  FilePlus2,
  FileText,
  Box,
  HandCoins,
  Package,
  Truck,
} from "lucide-react";

const Chip = ({ active, icon: Icon, label, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm",
        active
          ? "bg-blue-50 border-blue-200 text-blue-700"
          : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50",
      ].join(" ")}
    >
      <Icon size={16} />
      {label}
    </button>
  );
};

const BillingTab = ({
  status = "Ready",
  onMarkReady,
  onCreateInvoice,
  onViewInvoice,
}) => {
  const [selected, setSelected] = useState("storage");

  const options = [
    { key: "storage", label: "Storage", icon: Box },
    { key: "picking", label: "Picking Fee", icon: HandCoins },
    { key: "packing", label: "Packing Material", icon: Package },
    { key: "handling", label: "Handling & Dispatch", icon: Truck },
  ];

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 flex items-center gap-3">
        <div className="text-sm font-semibold text-gray-900">
          Billing Status
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
          {status}
        </span>
      </div>

      <div className="border-t" />

      {/* Charge basis */}
      <div className="px-6 py-5">
        <div className="text-sm font-medium text-gray-700">
          Charge Basis Configuration
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {options.map((o) => (
            <Chip
              key={o.key}
              active={selected === o.key}
              icon={o.icon}
              label={o.label}
              onClick={() => setSelected(o.key)}
            />
          ))}
        </div>
      </div>

      <div className="border-t" />

      {/* Actions */}
      <div className="px-6 py-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onMarkReady}
          className="px-4 py-2 border rounded-md text-sm bg-white inline-flex items-center gap-2"
        >
          <CheckCircle2 size={16} />
          Mark Ready
        </button>

        <button
          type="button"
          onClick={onCreateInvoice}
          className="px-4 py-2 rounded-md text-sm bg-blue-600 text-white inline-flex items-center gap-2"
        >
          <FilePlus2 size={16} />
          Create Invoice
        </button>

        <button
          type="button"
          onClick={onViewInvoice}
          className="px-4 py-2 border rounded-md text-sm bg-white inline-flex items-center gap-2"
        >
          <FileText size={16} />
          View Invoice
        </button>
      </div>
    </div>
  );
};

export default BillingTab;
