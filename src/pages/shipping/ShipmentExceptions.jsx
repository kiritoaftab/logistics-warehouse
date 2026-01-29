import React from "react";
import { AlertTriangle, ChevronRight } from "lucide-react";

const ShipmentExceptions = () => {
  const rows = [
    {
      id: "EXC-2024-001",
      type: "Delay",
      created: "Oct 24, 2024 16:15",
      owner: "System",
      status: "Open",
      canResolve: true,
    },
    {
      id: "EXC-2024-002",
      type: "Damage",
      created: "Oct 23, 2024 11:30",
      owner: "Sarah Connor",
      status: "Resolved",
      canResolve: false,
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5">
        <div className="text-lg font-semibold text-gray-900">
          Exceptions <span className="text-gray-500">({rows.length})</span>
        </div>

        <button className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100">
          <AlertTriangle size={16} />
          Open Exception Case
        </button>
      </div>

      {/* Table */}
      <div className="border-t">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-4 font-medium">Exception ID</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Created Time</th>
                <th className="px-6 py-4 font-medium">Owner</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="px-6 py-5">
                    <button className="font-semibold text-blue-600 hover:text-blue-700">
                      {r.id}
                    </button>
                  </td>

                  <td className="px-6 py-5">
                    <TypePill type={r.type} />
                  </td>

                  <td className="px-6 py-5 text-gray-900">{r.created}</td>
                  <td className="px-6 py-5 text-gray-900">{r.owner}</td>

                  <td className="px-6 py-5">
                    <StatusPill status={r.status} />
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-2">
                      {r.canResolve && (
                        <button className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-50">
                          Resolve
                        </button>
                      )}
                      <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50">
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ShipmentExceptions;

const TypePill = ({ type }) => {
  const cls =
    type === "Delay"
      ? "bg-orange-100 text-orange-700"
      : "bg-gray-100 text-gray-700";
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${cls}`}>
      {type}
    </span>
  );
};

const StatusPill = ({ status }) => {
  const cls =
    status === "Open"
      ? "bg-red-100 text-red-700"
      : "bg-green-100 text-green-700";
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${cls}`}>
      {status}
    </span>
  );
};
