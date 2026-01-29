// src/pages/outbound/components/detailpagetabs/PickingTab.jsx
import React from "react";
import { Users, Waves, Info, ClipboardList } from "lucide-react";

const PickingTab = ({
  onReassignPickers,
  onCreatePickWave,
  onViewAllTasks,
}) => {
  return (
    <div className="space-y-6">
      {/* Picking Status */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm font-semibold text-gray-900">
            Picking Status
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onReassignPickers}
              className="px-3 py-2 border rounded-md text-sm bg-white inline-flex items-center gap-2"
            >
              <Users size={16} />
              Reassign Pickers
            </button>

            <button
              type="button"
              onClick={onCreatePickWave}
              className="px-3 py-2 rounded-md text-sm bg-blue-600 text-white inline-flex items-center gap-2"
            >
              <Waves size={16} />
              Create Pick Wave
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-full bg-white text-blue-600 flex items-center justify-center border border-blue-200">
              <Info size={18} />
            </div>

            <div className="min-w-0">
              <div className="text-sm font-semibold text-blue-700">
                Pick Wave Not Created
              </div>
              <div className="text-sm text-blue-700/80 mt-1">
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

          <button
            type="button"
            onClick={onViewAllTasks}
            className="px-3 py-2 border rounded-md text-sm bg-white"
          >
            View All Tasks
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b bg-white">
              <tr className="text-left text-xs text-gray-500">
                <th className="px-4 py-3 font-medium">Task ID</th>
                <th className="px-4 py-3 font-medium">Zone</th>
                <th className="px-4 py-3 font-medium">SKUs</th>
                <th className="px-4 py-3 font-medium">Units</th>
                <th className="px-4 py-3 font-medium">Assigned To</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {/* Empty state row */}
              <tr>
                <td colSpan={7} className="px-4 py-14">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="h-10 w-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500">
                      <ClipboardList size={18} />
                    </div>
                    <div className="mt-3 text-sm text-gray-500">
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
  );
};

export default PickingTab;
