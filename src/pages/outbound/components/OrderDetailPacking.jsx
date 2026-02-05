// ✅ NEW: OrderDetailPacking.jsx
import React from "react";
import { Printer } from "lucide-react";

const OrderDetailPacking = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <div className="flex items-center gap-10">
            <div>
              <div className="text-xs text-gray-500">Cartons Created</div>
              <div className="text-2xl font-semibold text-gray-900">0</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Packed Units</div>
              <div className="text-2xl font-semibold text-gray-900">
                0 / 120
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="px-3 py-2 rounded-md border bg-white text-sm inline-flex items-center gap-2">
              <Printer size={16} />
              Print Packing Slip
            </button>
            <button className="px-3 py-2 rounded-md bg-blue-600 text-white text-sm">
              Start Packing
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="w-full overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 border-b">
                  <th className="py-3 pr-4">Carton ID</th>
                  <th className="py-3 pr-4">Items Count</th>
                  <th className="py-3 pr-4">Weight (kg)</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3">Action</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td colSpan={5} className="py-14 text-center">
                    <div className="mx-auto w-full max-w-md text-gray-500">
                      <div className="mx-auto h-14 w-14 rounded-full bg-gray-50 border flex items-center justify-center mb-3">
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-gray-400"
                        >
                          <path
                            d="M21 16V8C21 7.4 20.7 6.9 20.2 6.6L12.9 2.4C12.3 2.1 11.7 2.1 11.1 2.4L3.8 6.6C3.3 6.9 3 7.4 3 8V16C3 16.6 3.3 17.1 3.8 17.4L11.1 21.6C11.7 21.9 12.3 21.9 12.9 21.6L20.2 17.4C20.7 17.1 21 16.6 21 16Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M3.3 7.5L12 12.5L20.7 7.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 22V12.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                        </svg>
                      </div>
                      <div className="text-sm">
                        No cartons created yet. Click &quot;Start Packing&quot;
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
    </div>
  );
};

export default OrderDetailPacking;
