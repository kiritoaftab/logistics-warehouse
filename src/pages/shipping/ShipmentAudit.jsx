import React from "react";
import { Download } from "lucide-react";

const ShipmentAudit = () => {
  const rows = [
    {
      ts: "Oct 24, 2024 14:35",
      user: "System",
      action: "Document Uploaded",
      oldVal: "-",
      newVal: "Carrier Manifest.pdf",
    },
    {
      ts: "Oct 24, 2024 14:30",
      user: "Mike Smith",
      action: "Status Change",
      oldVal: "Dispatched",
      newVal: "-",
      strikeOld: true,
    },
    {
      ts: "Oct 24, 2024 14:28",
      user: "Mike Smith",
      action: "Dispatch Confirmed",
      oldVal: "-",
      newVal: "Shipment dispatched via FedEx",
    },
    {
      ts: "Oct 24, 2024 13:15",
      user: "John Doe",
      action: "AWB Updated",
      oldVal: "-",
      newVal: "-",
    },
    {
      ts: "Oct 24, 2024 13:10",
      user: "John Doe",
      action: "Carrier Assigned",
      oldVal: "Self Pickup",
      newVal: "-",
      strikeOld: true,
    },
    {
      ts: "Oct 24, 2024 11:45",
      user: "System",
      action: "Orders Added",
      oldVal: "-",
      newVal: "ORD-1001, ORD-1004, ORD-1009",
    },
    {
      ts: "Oct 24, 2024 11:40",
      user: "John Doe",
      action: "Shipment Created",
      oldVal: "-",
      newVal: "Draft Created",
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5">
        <div className="text-lg font-semibold text-gray-900">
          Shipment Audit Log
        </div>

        <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50">
          <Download size={16} />
          Export Log
        </button>
      </div>

      {/* Table */}
      <div className="border-t">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-4 font-medium">Timestamp</th>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Action</th>
                <th className="px-6 py-4 font-medium">Old Value</th>
                <th className="px-6 py-4 font-medium">New Value</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {rows.map((r, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-5 text-gray-900">{r.ts}</td>
                  <td className="px-6 py-5 text-gray-900">{r.user}</td>
                  <td className="px-6 py-5 text-gray-900">{r.action}</td>
                  <td className="px-6 py-5">
                    <span
                      className={
                        r.strikeOld
                          ? "text-gray-400 line-through"
                          : "text-gray-500"
                      }
                    >
                      {r.oldVal}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-gray-900">{r.newVal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ShipmentAudit;
