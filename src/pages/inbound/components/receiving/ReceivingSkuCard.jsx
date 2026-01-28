import React from "react";
import SessionReceiptsTable from "./SessionReceiptsTable";

const ReceivingSkuCard = ({
  skuTitle,
  partialText,
  scanSku,
  setScanSku,
  palletId,
  setPalletId,
  batchNo,
  setBatchNo,
  goodQty,
  setGoodQty,
  damagedQty,
  setDamagedQty,
  onAdd,
  receipts = [],
  onDeleteReceipt,
}) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-blue-700 truncate">
            {skuTitle}
          </div>
        </div>
        {partialText && (
          <span className="px-2 py-1 rounded-full text-xs bg-yellow-50 text-yellow-700">
            {partialText}
          </span>
        )}
      </div>

      {/* Scan */}
      <div className="mb-3">
        <div className="text-xs font-medium text-gray-500 mb-1">
          Scan Barcode / SKU
        </div>
        <input
          value={scanSku}
          onChange={(e) => setScanSku?.(e.target.value)}
          className="w-full rounded-md border border-blue-500 px-3 py-2 text-sm focus:outline-none"
        />
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Field label="Pallet ID" value={palletId} onChange={setPalletId} />
        <Field label="Batch No" value={batchNo} onChange={setBatchNo} />
        <Field
          label="Good Qty"
          type="number"
          value={goodQty}
          onChange={setGoodQty}
        />
        <Field
          label="Damaged Qty"
          type="number"
          value={damagedQty}
          onChange={setDamagedQty}
        />
      </div>

      <button
        onClick={onAdd}
        className="w-full rounded-md bg-primary text-white py-2 text-sm font-medium"
      >
        Add to Receiving
      </button>

      {/* Session receipts */}
      <div className="mt-5">
        <div className="text-xs font-medium text-gray-500 mb-2">
          Current Session Receipts
        </div>
        <SessionReceiptsTable rows={receipts} onDelete={onDeleteReceipt} />
      </div>
    </div>
  );
};

const Field = ({ label, value, onChange, type = "text" }) => (
  <div>
    <div className="text-xs font-medium text-gray-500 mb-1">{label}</div>
    <input
      type={type}
      value={value ?? ""}
      onChange={(e) =>
        onChange?.(type === "number" ? Number(e.target.value) : e.target.value)
      }
      className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
    />
  </div>
);

export default ReceivingSkuCard;
