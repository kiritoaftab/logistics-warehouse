import React from "react";

const StatusPill = ({ label }) => {
  const styles =
    label === "Packed"
      ? "bg-green-100 text-green-700"
      : "bg-blue-100 text-blue-700";

  return (
    <span className={`px-2 py-0.5 text-xs rounded-full ${styles}`}>
      {label}
    </span>
  );
};

const PackingQueueTable = () => {
  return (
    <table className="w-full text-sm">
      <thead className="text-gray-500">
        <tr className="border-b">
          <th className="text-left py-2 font-medium">Order</th>
          <th className="text-left font-medium">Carrier</th>
          <th className="text-left font-medium">Status</th>
          <th className="text-right font-medium">Action</th>
        </tr>
      </thead>

      <tbody>
        <tr className="border-b last:border-0">
          <td className="py-3">SO-9880</td>
          <td>FedEx</td>
          <td>
            <StatusPill label="Picking Done" />
          </td>
          <td className="text-right text-blue-600 font-medium">Pack</td>
        </tr>

        <tr>
          <td className="py-3">SO-9885</td>
          <td>UPS</td>
          <td>
            <StatusPill label="Packed" />
          </td>
          <td className="text-right text-blue-600 font-medium">Ship</td>
        </tr>
      </tbody>
    </table>
  );
};

export default PackingQueueTable;
