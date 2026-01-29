// components/OrderProgress.jsx
import React from "react";

const StepDot = ({ active }) => (
  <div
    className={[
      "h-8 w-8 rounded-full flex items-center justify-center border",
      active
        ? "border-blue-600 text-blue-600"
        : "border-gray-200 text-gray-400",
    ].join(" ")}
  >
    <div
      className={[
        "h-2 w-2 rounded-full",
        active ? "bg-blue-600" : "bg-gray-300",
      ].join(" ")}
    />
  </div>
);

const OrderProgress = () => {
  const steps = [
    { no: 1, label: "Created", sub: "Oct 24, 10:00" },
    { no: 2, label: "Confirmed", sub: "Oct 24, 10:05" },
    { no: 3, label: "Allocating", sub: "In Progress", active: true },
    { no: 4, label: "Picking", sub: "" },
    { no: 5, label: "Packing", sub: "" },
    { no: 6, label: "Shipped", sub: "" },
  ];

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="text-sm font-semibold text-gray-900 mb-4">
        Order Progress
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-6 gap-4">
        {steps.map((s) => (
          <div
            key={s.no}
            className="flex flex-col items-center text-center gap-2"
          >
            <StepDot active={!!s.active} />
            <div className="text-xs font-semibold text-gray-900">{s.label}</div>
            <div className="text-[11px] text-gray-500">{s.sub || "\u00A0"}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderProgress;
