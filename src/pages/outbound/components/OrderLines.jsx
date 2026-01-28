// ✅ OrderLines: add modal support
import React, { useState } from "react";
import { Search, Trash2 } from "lucide-react";
import ConfirmDeleteModal from "../../components/modals/ConfirmDeleteModal";
import { useToast } from "../../components/toast/ToastProvider";

const OrderLines = ({ lines, onAdd, onUpdate, onRemove }) => {
  const [deleteIdx, setDeleteIdx] = useState(null);
  const toast = useToast();
  const handleConfirmDelete = () => {
    if (deleteIdx === null) return;
    onRemove?.(deleteIdx);
    setDeleteIdx(null);
    toast.success("Order line deleted successfully");
  };
  return (
    <>
      <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
        <div className="px-4 py-3 border-b">
          <div className="text-sm font-semibold text-gray-900">Order Lines</div>
        </div>

        <div className="px-4 py-3">
          <div className="grid grid-cols-12 gap-3 text-xs font-medium text-gray-500 border-b pb-2">
            <div className="col-span-3">SKU</div>
            <div className="col-span-3">Name</div>
            <div className="col-span-1">UOM</div>
            <div className="col-span-1">Qty</div>
            <div className="col-span-2">Allocation Rule</div>
            <div className="col-span-2">Batch/Note</div>
          </div>

          <div className="divide-y">
            {lines.map((l, idx) => (
              <div
                key={l.id}
                className="grid grid-cols-12 gap-3 py-3 items-center"
              >
                <div className="col-span-3">
                  <div className="relative">
                    <input
                      value={l.sku}
                      onChange={(e) => onUpdate(idx, { sku: e.target.value })}
                      placeholder="Search SKU..."
                      className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                    />
                    <Search
                      size={16}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                  </div>
                </div>

                <div className="col-span-3">
                  <div className="text-sm text-gray-600 truncate">
                    {l.name || "-"}
                  </div>
                </div>

                <div className="col-span-1">
                  <select
                    value={l.uom}
                    onChange={(e) => onUpdate(idx, { uom: e.target.value })}
                    className="w-full rounded-md border border-gray-200 bg-white px-2 py-2 text-sm"
                  >
                    <option>Each</option>
                    <option>EA</option>
                    <option>Pcs</option>
                    <option>Box</option>
                  </select>
                </div>

                <div className="col-span-1">
                  <input
                    type="number"
                    value={l.qty}
                    onChange={(e) =>
                      onUpdate(idx, { qty: Number(e.target.value) })
                    }
                    className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                  />
                </div>

                <div className="col-span-2">
                  <select
                    value={l.allocationRule}
                    onChange={(e) =>
                      onUpdate(idx, { allocationRule: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-200 bg-white px-2 py-2 text-sm"
                  >
                    <option>FIFO</option>
                    <option>FEFO</option>
                    <option>LIFO</option>
                  </select>
                </div>

                <div className="col-span-2 flex items-center gap-2">
                  <input
                    value={l.note}
                    onChange={(e) => onUpdate(idx, { note: e.target.value })}
                    placeholder="Note"
                    className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setDeleteIdx(idx)} // ✅ open modal
                    className="p-2 rounded-md hover:bg-gray-50 text-gray-400 hover:text-red-600"
                    title="Remove"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onAdd}
            className="mt-3 px-3 py-2 text-sm rounded-md border bg-white"
          >
            + Add Line
          </button>
        </div>
      </div>

      {/* ✅ Confirm Delete Modal */}
      <ConfirmDeleteModal
        open={deleteIdx !== null}
        title="Delete line?"
        message="Are you sure you want to delete this order line?"
        confirmText="Delete"
        cancelText="Cancel"
        onClose={() => setDeleteIdx(null)}
        onConfirm={() => handleConfirmDelete()}
      />
    </>
  );
};

export default OrderLines;
