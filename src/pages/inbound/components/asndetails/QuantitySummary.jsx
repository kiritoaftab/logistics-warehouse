import React from "react";

const BarRow = ({
  label,
  valueLeft,
  valueRight,
  percent = 0,
  colorClass = "bg-gray-700",
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="text-gray-600">{label}</div>
        <div className="font-semibold text-gray-900">{valueRight}</div>
      </div>

      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <div
          className={`h-full ${colorClass}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {valueLeft && <div className="text-xs text-gray-500">{valueLeft}</div>}
    </div>
  );
};

const QuantitySummary = ({
  expectedUnits,
  receivedUnits,
  damagedUnits,
  shortageUnits,
  expectedLines,
  completionPercent,
}) => {
  const safePct = (n) => Math.max(0, Math.min(100, n || 0));
  const pctReceived = expectedUnits ? (receivedUnits / expectedUnits) * 100 : 0;
  const pctDamaged = expectedUnits ? (damagedUnits / expectedUnits) * 100 : 0;
  const pctShortage = expectedUnits ? (shortageUnits / expectedUnits) * 100 : 0;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="text-sm font-semibold text-gray-900 mb-4">
        Quantity Summary
      </div>

      <div className="space-y-4">
        <BarRow
          label="Expected Units"
          valueRight={expectedUnits?.toLocaleString?.() ?? expectedUnits}
          percent={100}
          colorClass="bg-gray-300"
        />

        <BarRow
          label="Received"
          valueRight={receivedUnits?.toLocaleString?.() ?? receivedUnits}
          percent={safePct(pctReceived)}
          colorClass="bg-green-500"
        />

        <BarRow
          label="Damaged"
          valueRight={damagedUnits?.toLocaleString?.() ?? damagedUnits}
          percent={safePct(pctDamaged)}
          colorClass="bg-red-500"
        />

        <BarRow
          label="Shortage"
          valueRight={shortageUnits?.toLocaleString?.() ?? shortageUnits}
          percent={safePct(pctShortage)}
          colorClass="bg-orange-500"
        />

        <div className="pt-3 border-t flex items-center justify-between text-sm">
          <div className="text-gray-600">Expected Lines</div>
          <div className="font-semibold text-gray-900">{expectedLines}</div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-600">Completion</div>
          <div className="font-semibold text-gray-900">
            {completionPercent}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuantitySummary;
