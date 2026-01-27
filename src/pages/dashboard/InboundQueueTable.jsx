import React from "react";

const StatusPill = ({ label, color }) => (
  <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${color}`}>
    {label}
  </span>
);

const InboundQueueTable = () => {
  return (
    <table className="w-full text-sm">
      <thead className="text-gray-500">
        <tr className="border-b">
          <th className="text-left py-2 font-medium">ASN</th>
          <th className="text-left font-medium">ETA</th>
          <th className="text-left font-medium">Status</th>
          <th className="text-right font-medium">Action</th>
        </tr>
      </thead>

      <tbody>
        <tr className="border-b last:border-0">
          <td className="py-3 text-blue-600 font-medium">ASN-8821</td>
          <td>10:30 AM</td>
          <td>
            <StatusPill label="Arrived" color="bg-blue-100 text-blue-700" />
          </td>
          <td className="text-right text-blue-600 font-medium cursor-pointer">
            Open
          </td>
        </tr>

        <tr className="border-b last:border-0">
          <td className="py-3 text-blue-600 font-medium">ASN-8822</td>
          <td>11:00 AM</td>
          <td>
            <StatusPill label="Pending" color="bg-gray-100 text-gray-600" />
          </td>
          <td className="text-right text-blue-600 font-medium cursor-pointer">
            Open
          </td>
        </tr>

        <tr>
          <td className="py-3 text-blue-600 font-medium">ASN-8825</td>
          <td>01:15 PM</td>
          <td>
            <StatusPill label="Pending" color="bg-gray-100 text-gray-600" />
          </td>
          <td className="text-right text-blue-600 font-medium cursor-pointer">
            Open
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default InboundQueueTable;
