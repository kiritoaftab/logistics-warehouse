import React from "react";
import { Trash2 } from "lucide-react";

const SessionReceiptsTable = ({ rows = [], onDelete }) => {
  return (
    <div className="rounded-md border border-gray-200 overflow-hidden">
      <div className="grid grid-cols-12 bg-gray-50 px-3 py-2 text-xs text-gray-500">
        <div className="col-span-4">Pallet</div>
        <div className="col-span-5">Batch</div>
        <div className="col-span-2 text-right">Qty</div>
        <div className="col-span-1" />
      </div>

      {rows.length === 0 ? (
        <div className="px-3 py-3 text-sm text-gray-500">No receipts yet</div>
      ) : (
        rows.map((r) => (
          <div
            key={r.id}
            className="grid grid-cols-12 items-center px-3 py-2 border-t text-sm"
          >
            <div className="col-span-4 font-medium text-gray-900">
              {r.pallet}
            </div>
            <div className="col-span-5 text-gray-700">{r.batch}</div>
            <div className="col-span-2 text-right text-gray-900">{r.qty}</div>
            <div className="col-span-1 flex justify-end">
              <button
                onClick={() => onDelete?.(r.id)}
                className="text-gray-400 hover:text-red-600"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SessionReceiptsTable;
