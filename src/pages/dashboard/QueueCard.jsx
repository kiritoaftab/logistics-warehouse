import React from "react";

const QueueCard = ({ title, children }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <button className="text-sm text-blue-600 font-medium">View all</button>
      </div>

      <div className="p-4">{children}</div>
    </div>
  );
};

export default QueueCard;
