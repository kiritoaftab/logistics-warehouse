import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";

const ShortageCard = ({ shortageUnits = 0 }) => {
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  if (!shortageUnits) return null;

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-red-700 mb-3">
        <AlertTriangle size={16} />
        Shortage: {shortageUnits} Units
      </div>

      <div className="mb-3">
        <div className="text-xs font-medium text-red-700 mb-1">Reason</div>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full rounded-md border border-red-200 bg-white px-3 py-2 text-sm"
        >
          <option value="">Select Reason...</option>
          <option value="short-shipped">Short Shipped</option>
          <option value="damage-in-transit">Damage in Transit</option>
          <option value="missing-pallet">Missing Pallet</option>
          <option value="count-variance">Count Variance</option>
        </select>
      </div>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add notes..."
        className="w-full rounded-md border border-red-200 bg-white px-3 py-2 text-sm min-h-[90px]"
      />
    </div>
  );
};

export default ShortageCard;
