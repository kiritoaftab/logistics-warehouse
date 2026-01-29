// src/pages/reports/components/helper.jsx
import React from "react";

export const ChipSelect = ({
  label,
  value,
  onChange,
  options = [],
  className = "",
}) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <span className="text-[11px] font-medium text-gray-500">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 rounded-md border border-gray-200 bg-white px-3 text-sm font-medium text-gray-900 outline-none focus:ring-2 focus:ring-gray-200"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
};

export const StatusPill = ({ status, variant = "inbound" }) => {
  const variants = {
    inbound: {
      Completed: "bg-green-100 text-green-700",
      "Delayed Putaway": "bg-orange-100 text-orange-700",
      Pending: "bg-gray-100 text-gray-700",
    },

    task: {
      Pending: "bg-red-100 text-red-700",
      "In Progress": "bg-orange-100 text-orange-700",
      Completed: "bg-green-100 text-green-700",
    },

    space: {
      Overfilled: "bg-red-100 text-red-700",
      Full: "bg-red-100 text-red-700",
      High: "bg-orange-100 text-orange-700",
      Active: "bg-green-100 text-green-700",
      Empty: "bg-gray-100 text-gray-700",
    },
  };

  const map = variants[variant] || {};

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        map[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
};

export const Badge = ({ text, tone = "gray" }) => {
  const tones = {
    gray: "bg-gray-100 text-gray-700",
    red: "bg-red-100 text-red-700",
    orange: "bg-orange-100 text-orange-700",
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        tones[tone] || tones.gray
      }`}
    >
      {text}
    </span>
  );
};

export const VarianceCell = ({ v }) => {
  if (v === 0) return <span className="text-gray-700">0</span>;

  return (
    <span
      className={
        v < 0 ? "font-semibold text-red-600" : "font-semibold text-green-700"
      }
    >
      {v}
    </span>
  );
};

export const AccuracyPill = ({ value }) => {
  const v = Number(value);
  const good = v >= 99.5;

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        good ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
      }`}
    >
      {value}%
    </span>
  );
};

export const UtilBar = ({ percent = 0 }) => {
  const p = Math.max(0, Math.min(120, percent)); // allow overfill >100
  const tone =
    p >= 100 ? "bg-red-500" : p >= 85 ? "bg-orange-500" : "bg-green-500";

  return (
    <div className="flex items-center gap-3">
      <div className="h-2 w-[120px] rounded-full bg-gray-100 overflow-hidden">
        <div
          className={`h-full ${tone}`}
          style={{ width: `${Math.min(p, 100)}%` }}
        />
      </div>
      <span
        className={p >= 100 ? "font-semibold text-red-600" : "text-gray-800"}
      >
        {percent}%
      </span>
    </div>
  );
};
