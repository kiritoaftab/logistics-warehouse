import React from "react";
import { CheckCircle2 } from "lucide-react";

const StepDot = ({ state }) => {
  // state: "done" | "active" | "todo"
  if (state === "done") {
    return (
      <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm transition-all duration-200">
        <CheckCircle2 size={18} />
      </div>
    );
  }
  if (state === "active") {
    return (
      <div className="h-9 w-9 rounded-full border-2 border-blue-600 bg-white flex items-center justify-center shadow-sm transition-all duration-200">
        <div className="h-2.5 w-2.5 rounded-full bg-blue-600 animate-pulse" />
      </div>
    );
  }
  return (
    <div className="h-9 w-9 rounded-full border border-gray-300 bg-white flex items-center justify-center transition-all duration-200">
      <div className="h-2.5 w-2.5 rounded-full bg-gray-300" />
    </div>
  );
};

const ShipmentJourney = ({ steps = [] }) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 lg:p-6">
      <div className="text-sm font-semibold text-gray-900 mb-4 lg:mb-6">
        Shipment Journey
      </div>

      <div className="hidden lg:block">
        <div className="relative">
          <div className="absolute left-0 right-0 top-4 h-[2px] bg-gray-200 z-0" />

          <div
            className="absolute left-0 top-4 h-[2px] bg-blue-600 z-0 transition-all duration-500"
            style={{
              width: `${(steps.filter((s) => s.state === "done").length / (steps.length - 1)) * 100}%`,
            }}
          />

          <div
            className="relative z-10 grid gap-4 lg:gap-6"
            style={{
              gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))`,
            }}
          >
            {steps.map((s, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <StepDot state={s.state} />
                <div className="mt-2 text-xs lg:text-sm font-semibold text-gray-900 leading-tight px-1">
                  {s.label}
                </div>
                <div className="mt-1 text-xs text-gray-500 whitespace-nowrap">
                  {s.time || "-"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:hidden space-y-4">
        {steps.map((s, idx) => (
          <div key={idx} className="relative flex items-start gap-3">
            {idx < steps.length - 1 && (
              <div className="absolute left-[18px] top-9 bottom-0 w-[2px] bg-gray-200">
                {s.state === "done" && (
                  <div className="absolute inset-0 bg-blue-600" />
                )}
              </div>
            )}

            <div className="relative z-10">
              <StepDot state={s.state} />
            </div>

            <div className="flex-1 pt-1.5 min-w-0">
              <div className="text-sm font-semibold text-gray-900">
                {s.label}
              </div>
              <div className="mt-0.5 text-xs text-gray-500">
                {s.time || "Pending"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShipmentJourney;
