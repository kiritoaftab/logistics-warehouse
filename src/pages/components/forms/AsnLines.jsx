import React from "react";
import FormCard from "./FormCard";
import { Plus, Trash2 } from "lucide-react";

const AsnLines = ({ lines = [], onAdd, onUpdate, onRemove }) => {
  const totalUnits = lines.reduce((sum, l) => sum + (Number(l.qty) || 0), 0);

  return (
    <FormCard
      title="ASN Lines"
      right={
        <button
          type="button"
          onClick={onAdd}
          className="px-3 py-2 text-sm border rounded-md bg-white flex items-center gap-2"
        >
          <Plus size={16} /> Add Line
        </button>
      }
    >
      <div className="overflow-x-auto">
        <table className="min-w-[800px] w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-500 border-b">
              <th className="text-left py-2">SKU</th>
              <th className="text-left py-2">Name</th>
              <th className="text-left py-2">UOM</th>
              <th className="text-left py-2">Exp. Qty</th>
              <th className="text-left py-2">Remarks</th>
              <th className="text-right py-2"> </th>
            </tr>
          </thead>
          <tbody>
            {lines.map((l, idx) => (
              <tr key={l.id} className="border-b">
                <td className="py-2 pr-2">
                  <input
                    className="w-full border rounded-md px-3 py-2 bg-gray-50"
                    value={l.sku}
                    onChange={(e) => onUpdate(idx, { sku: e.target.value })}
                    placeholder="SKU-xxxxx"
                  />
                </td>
                <td className="py-2 pr-2">
                  <input
                    className="w-full border rounded-md px-3 py-2 bg-gray-50"
                    value={l.name}
                    onChange={(e) => onUpdate(idx, { name: e.target.value })}
                    placeholder="Item name"
                  />
                </td>
                <td className="py-2 pr-2 w-[120px]">
                  <input
                    className="w-full border rounded-md px-3 py-2 bg-gray-50"
                    value={l.uom}
                    onChange={(e) => onUpdate(idx, { uom: e.target.value })}
                    placeholder="Pcs"
                  />
                </td>
                <td className="py-2 pr-2 w-[140px]">
                  <input
                    type="number"
                    className="w-full border rounded-md px-3 py-2 bg-gray-50"
                    value={l.qty}
                    onChange={(e) => onUpdate(idx, { qty: e.target.value })}
                    placeholder="0"
                  />
                </td>
                <td className="py-2 pr-2">
                  <input
                    className="w-full border rounded-md px-3 py-2 bg-gray-50"
                    value={l.remarks}
                    onChange={(e) => onUpdate(idx, { remarks: e.target.value })}
                    placeholder="..."
                  />
                </td>
                <td className="py-2 text-right">
                  <button
                    type="button"
                    onClick={() => onRemove(idx)}
                    className="p-2 text-gray-400 hover:text-red-600"
                    title="Remove"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}

            {lines.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-gray-400">
                  No lines yet. Click “Add Line”.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <div>Total Lines: {lines.length}</div>
        <div className="font-semibold text-gray-900">
          Total Expected Units: {totalUnits}
        </div>
      </div>
    </FormCard>
  );
};

export default AsnLines;
