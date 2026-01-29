// src/pages/outbound/components/detailpagetabs/AuditTab.jsx
import React, { useMemo } from "react";

const ActionPill = ({ label, tone = "gray" }) => {
  const map = {
    gray: "bg-gray-100 text-gray-700",
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-medium ${map[tone]}`}
    >
      {label}
    </span>
  );
};

const Avatar = ({ name }) => {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="h-7 w-7 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-xs font-semibold">
      {initials}
    </div>
  );
};

const AuditTab = () => {
  const rows = useMemo(
    () => [
      {
        id: 1,
        time: "Today, 10:42 AM",
        user: "John Doe",
        action: "Field Update",
        actionTone: "gray",
        oldValue: "Normal Priority",
        newValue: "High Priority",
        strikeOld: true,
      },
      {
        id: 2,
        time: "Today, 10:30 AM",
        user: "John Doe",
        action: "Allocation",
        actionTone: "blue",
        oldValue: "-",
        newValue: "Allocated 2 lines",
      },
      {
        id: 3,
        time: "Today, 09:15 AM",
        user: "Alice Smith",
        action: "Confirm Order",
        actionTone: "green",
        oldValue: "Draft",
        newValue: "Confirmed",
      },
      {
        id: 4,
        time: "Today, 09:00 AM",
        user: "Alice Smith",
        action: "Create Order",
        actionTone: "gray",
        oldValue: "-",
        newValue: "Draft Created",
      },
    ],
    [],
  );

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4">
        <div className="text-sm font-semibold text-gray-900">
          Change History
        </div>
      </div>

      {/* Table */}
      <div className="border-t overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-white border-b">
            <tr className="text-left text-xs font-medium text-gray-500">
              <th className="px-6 py-3">Timestamp</th>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Action</th>
              <th className="px-6 py-3">Old Value</th>
              <th className="px-6 py-3">New Value</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-6 py-4 text-sm text-gray-700">{r.time}</td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Avatar name={r.user} />
                    <div className="text-sm text-gray-900">{r.user}</div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <ActionPill label={r.action} tone={r.actionTone} />
                </td>

                <td className="px-6 py-4 text-sm">
                  {r.strikeOld ? (
                    <span className="text-red-500 line-through">
                      {r.oldValue}
                    </span>
                  ) : (
                    <span className="text-gray-700">{r.oldValue}</span>
                  )}
                </td>

                <td className="px-6 py-4 text-sm text-green-600 font-medium">
                  {r.newValue}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditTab;
