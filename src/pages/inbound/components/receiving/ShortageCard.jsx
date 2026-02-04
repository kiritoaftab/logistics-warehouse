//src/pages/inbound/components/receiving/ShortageCard
const ShortageCard = ({ shortageUnits = 0, reasons = [], value, onChange }) => {
  const enabled = shortageUnits > 0;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-gray-900">Shortage</div>
        <div
          className={`text-sm font-semibold ${enabled ? "text-red-600" : "text-gray-400"}`}
        >
          {shortageUnits} Units
        </div>
      </div>

      <div className="mt-3">
        <label className="text-xs text-gray-500">Reason</label>
        <select
          disabled={!enabled}
          value={value?.reason || ""}
          onChange={(e) => onChange({ ...value, reason: e.target.value })}
          className="w-full mt-1 rounded-md border px-3 py-2 text-sm disabled:bg-gray-100"
        >
          <option value="">Select</option>
          {reasons.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-3">
        <label className="text-xs text-gray-500">Notes</label>
        <textarea
          disabled={!enabled}
          value={value?.notes || ""}
          onChange={(e) => onChange({ ...value, notes: e.target.value })}
          className="w-full mt-1 rounded-md border px-3 py-2 text-sm disabled:bg-gray-100"
          rows={3}
          placeholder={
            enabled ? "Enter shortage notes" : "No shortage for this line"
          }
        />
      </div>
    </div>
  );
};

export default ShortageCard;
