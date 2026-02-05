import React from "react";
import { AlertCircle } from "lucide-react";

const DashboardWidgets = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
      {/* Top Moving SKUs */}
      <div className="bg-white rounded-xl border p-4">
        <h3 className="text-sm font-semibold mb-4">Top Moving SKUs</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span>SKU-1002 (Blue Widget)</span>
            <span className="font-semibold">1,200 units</span>
          </div>
          <div className="flex justify-between">
            <span>SKU-4402 (Standard Box)</span>
            <span className="font-semibold">980 units</span>
          </div>
          <div className="flex justify-between">
            <span>SKU-2991 (Flex Tape)</span>
            <span className="font-semibold">850 units</span>
          </div>
        </div>
      </div>

      {/* Zone Utilization */}
      <div className="bg-white rounded-xl border p-4">
        <h3 className="text-sm font-semibold mb-4">Zone Utilization</h3>

        {[
          { zone: "Zone A", value: 85, color: "bg-blue-600" },
          { zone: "Zone B", value: 60, color: "bg-orange-500" },
          { zone: "Zone C", value: 40, color: "bg-green-500" },
        ].map((z) => (
          <div key={z.zone} className="mb-4 text-sm">
            <div className="flex justify-between mb-1">
              <span>{z.zone}</span>
              <span>{z.value}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${z.color}`}
                style={{ width: `${z.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Expiry Alerts */}
      <div className="bg-white rounded-xl border p-4">
        <h3 className="text-sm font-semibold mb-4">
          Expiry Alerts (Next 7 days)
        </h3>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span>BATCH-2022-A1</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-600">
              2 days
            </span>
          </div>
          <div className="flex justify-between">
            <span>BATCH-2022-C4</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-orange-100 text-orange-600">
              5 days
            </span>
          </div>
          <div className="flex justify-between">
            <span>BATCH-2022-B2</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-600">
              6 days
            </span>
          </div>
        </div>
      </div>

      {/* Critical Alerts */}
      <div className="bg-white rounded-xl border p-4">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <h3 className="text-sm font-semibold">Critical Alerts</h3>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span>Putaway aging &gt; 4h</span>
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              3
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Orders breaching SLA</span>
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              5
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Locations overfilled</span>
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              1
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Billing blocks</span>
            <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
              2
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardWidgets;
