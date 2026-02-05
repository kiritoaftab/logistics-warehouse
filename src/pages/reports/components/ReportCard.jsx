// src/pages/reports/components/ReportCard.jsx
import React, { use } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ReportCard({
  title,
  Icon,
  leftLabel,
  leftValue,
  rightLabel,
  rightValue,
  rightSub,
  rightSubTone = "muted", // "muted" | "danger"
  footerText = "View Detailed Report",
  route = "/",
}) {
  const navigate = useNavigate();
  const rightSubClass =
    rightSubTone === "danger" ? "text-red-600" : "text-gray-500";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50">
            <Icon className="h-5 w-5 text-gray-700" />
          </div>
          <h3 className="text-[15px] font-semibold text-gray-900">{title}</h3>
        </div>

        <button
          type="button"
          className="rounded-md p-1 text-gray-400 hover:bg-gray-50 hover:text-gray-700"
          title="Open"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-6">
        <div>
          <div className="text-[11px] font-medium text-gray-500">
            {leftLabel}
          </div>
          <div className="mt-1 text-2xl font-semibold text-gray-900">
            {leftValue}
          </div>
        </div>

        <div>
          <div className="text-[11px] font-medium text-gray-500">
            {rightLabel}
          </div>
          <div className="mt-1 text-2xl font-semibold text-gray-900">
            {rightValue}
          </div>
          {rightSub ? (
            <div className={`mt-1 text-xs font-medium ${rightSubClass}`}>
              {rightSub}
            </div>
          ) : null}
        </div>
      </div>

      <button
        onClick={() => navigate(route)}
        type="button"
        className="mt-5 text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        {footerText}
      </button>
    </div>
  );
}
