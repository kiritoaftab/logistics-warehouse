// src/pages/outbound/components/detailpagetabs/PackingTab.jsx
import React from "react";
import { Package, Printer } from "lucide-react";

const PackingTab = ({
  cartonsCreated = 0,
  packedUnits = 0,
  totalUnits = 120,
  onPrintPackingSlip,
  onStartPacking,
}) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      {/* Top summary + actions */}
      <div className="px-4 py-4 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-10">
          <div>
            <div className="text-xs font-semibold text-blue-600">
              Cartons Created
            </div>
            <div className="mt-1 text-2xl font-semibold text-gray-900">
              {cartonsCreated}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-blue-600">
              Packed Units
            </div>
            <div className="mt-1 text-2xl font-semibold text-gray-900">
              {packedUnits}{" "}
              <span className="text-sm font-medium text-gray-500">
                / {totalUnits}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrintPackingSlip}
            className="px-4 py-2 border rounded-md text-sm bg-white inline-flex items-center gap-2"
          >
            <Printer size={16} />
            Print Packing Slip
          </button>

          <button
            type="button"
            onClick={onStartPacking}
            className="px-4 py-2 rounded-md text-sm bg-blue-600 text-white"
          >
            Start Packing
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="border-t">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b bg-white">
              <tr className="text-left text-xs text-gray-500">
                <th className="px-4 py-3 font-medium">Carton ID</th>
                <th className="px-4 py-3 font-medium">Items Count</th>
                <th className="px-4 py-3 font-medium">Weight (kg)</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td colSpan={5} className="px-4 py-14">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="h-12 w-12 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500">
                      <Package size={18} />
                    </div>
                    <div className="mt-3 text-sm text-gray-500">
                      No cartons created yet. Click{" "}
                      <span className="font-medium text-gray-700">
                        "Start Packing"
                      </span>{" "}
                      to begin.
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PackingTab;
