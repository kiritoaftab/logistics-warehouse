// ✅ NEW: OrderDetailPicking.jsx
import React from "react";
import { Users, Waves, Info } from "lucide-react";

const OrderDetailPicking = () => {
  return (
    <div className="space-y-6">
      {/* Picking Status */}
      <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-900">
            Picking Status
          </div>

          <div className="flex items-center gap-2">
            <button className="px-3 py-2 rounded-md border bg-white text-sm inline-flex items-center gap-2">
              <Users size={16} />
              Reassign Pickers
            </button>
            <button className="px-3 py-2 rounded-md bg-blue-600 text-white text-sm inline-flex items-center gap-2">
              <Waves size={16} />
              Create Pick Wave
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 flex gap-3">
            <div className="h-10 w-10 rounded-full bg-white border border-blue-200 flex items-center justify-center">
              <Info size={18} className="text-blue-600" />
            </div>
            <div>
              <div className="text-sm font-semibold text-blue-800">
                Pick Wave Not Created
              </div>
              <div className="text-xs text-blue-700 mt-1">
                Allocation is partial. You can create a pick wave for the 2
                allocated lines to start picking.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pick Tasks */}
      <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-900">Pick Tasks</div>
          <button className="px-3 py-2 rounded-md border bg-white text-sm">
            View All Tasks
          </button>
        </div>

        <div className="p-4">
          <div className="w-full overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 border-b">
                  <th className="py-3 pr-4">Task ID</th>
                  <th className="py-3 pr-4">Zone</th>
                  <th className="py-3 pr-4">SKUs</th>
                  <th className="py-3 pr-4">Units</th>
                  <th className="py-3 pr-4">Assigned To</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td colSpan={7} className="py-14 text-center">
                    <div className="mx-auto w-full max-w-sm text-gray-500">
                      <div className="mx-auto h-10 w-10 rounded-lg bg-gray-50 border flex items-center justify-center mb-3">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-gray-400"
                        >
                          <path
                            d="M8 2H16C17.1 2 18 2.9 18 4V22H6V4C6 2.9 6.9 2 8 2Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M9 6H15"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                          <path
                            d="M9 10H15"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                      <div className="text-sm">
                        No pick tasks generated yet. Create a pick wave to
                        generate tasks.
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPicking;
