// components/SideNav.jsx
import React from "react";

const SideNav = ({ active, onChange, items }) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <div className="space-y-1">
        {items.map((it) => {
          const isActive = active === it.key;
          return (
            <button
              key={it.key}
              type="button"
              onClick={() => onChange(it.key)}
              className={[
                "w-full flex items-center justify-between rounded-md px-3 py-2 text-sm",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-50",
              ].join(" ")}
            >
              <span>{it.label}</span>
              <span
                className={[
                  "min-w-[26px] h-6 px-2 inline-flex items-center justify-center rounded-full text-xs",
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-600",
                ].join(" ")}
              >
                {it.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SideNav;
