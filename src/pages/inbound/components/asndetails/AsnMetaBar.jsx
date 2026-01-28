import React from "react";

const Badge = ({ children }) => (
  <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
    {children}
  </span>
);

const Item = ({ label, value }) => (
  <div className="min-w-[120px]">
    <div className="text-[11px] font-medium text-gray-500 uppercase">
      {label}
    </div>
    <div className="text-sm font-medium text-gray-900">{value}</div>
  </div>
);

const AsnMetaBar = ({
  status,
  client,
  supplier,
  eta,
  dock,
  progressText,
  rightLinks = [],
}) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-6">
          <div className="min-w-[110px]">
            <div className="text-[11px] font-medium text-gray-500 uppercase">
              Status
            </div>
            <div className="mt-1">
              <Badge>{status}</Badge>
            </div>
          </div>

          <Item label="Client" value={client} />
          <Item label="Supplier" value={supplier} />
          <Item label="ETA" value={eta} />
          <Item label="Dock" value={dock} />
          <Item label="Progress" value={progressText} />
        </div>

        {rightLinks?.length > 0 && (
          <div className="flex items-center gap-6">
            {rightLinks.map((l, idx) => (
              <button
                key={idx}
                onClick={l.onClick}
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                {l.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AsnMetaBar;
