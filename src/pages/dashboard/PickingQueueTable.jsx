import React from "react";

const PriorityPill = ({ label }) => {
  const styles =
    label === "High" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700";

  return (
    <span className={`px-2 py-0.5 text-xs rounded-full ${styles}`}>
      {label}
    </span>
  );
};

const PickingQueueTable = () => {
  return (
    <table className="w-full text-sm">
      <thead className="text-gray-500">
        <tr className="border-b">
          <th className="text-left py-2 font-medium">Order</th>
          <th className="text-left font-medium">Priority</th>
          <th className="text-left font-medium">SLA</th>
          <th className="text-right font-medium">Action</th>
        </tr>
      </thead>

      <tbody>
        <tr className="border-b last:border-0">
          <td className="py-3 text-blue-600 font-medium">SO-9921</td>
          <td>
            <PriorityPill label="High" />
          </td>
          <td>2h</td>
          <td className="text-right text-blue-600 font-medium cursor-pointer">
            Start
          </td>
        </tr>

        <tr className="border-b last:border-0">
          <td className="py-3 text-blue-600 font-medium">SO-9924</td>
          <td>
            <PriorityPill label="Normal" />
          </td>
          <td>4h</td>
          <td className="text-right text-blue-600 font-medium cursor-pointer">
            Start
          </td>
        </tr>

        <tr>
          <td className="py-3 text-blue-600 font-medium">SO-9928</td>
          <td>
            <PriorityPill label="Normal" />
          </td>
          <td>5h</td>
          <td className="text-right text-blue-600 font-medium cursor-pointer">
            Start
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default PickingQueueTable;
