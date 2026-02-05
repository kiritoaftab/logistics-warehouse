// tabs/EmptyState.jsx
import React from "react";
import { Truck } from "lucide-react";

const EmptyState = ({ title, subtitle, actionLabel }) => (
  <div className="rounded-lg border border-gray-200 bg-white p-6">
    <div className="flex items-start gap-3">
      <div className="h-9 w-9 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center">
        <Truck size={16} />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-blue-700">{title}</div>
        <div className="text-sm text-gray-600 mt-1">{subtitle}</div>
      </div>
    </div>

    <div className="mt-5 rounded-lg border border-gray-100 bg-white p-6 text-center text-sm text-gray-500">
      No data available yet.
      {actionLabel ? (
        <div className="mt-4">
          <button className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm">
            {actionLabel}
          </button>
        </div>
      ) : null}
    </div>
  </div>
);

export default EmptyState;
