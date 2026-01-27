import React from "react";
import { ChevronDown } from "lucide-react";

const SelectBox = ({ label, value, className = "" }) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    <span className="text-[11px] font-medium text-gray-500">{label}</span>
    <div className="flex items-center justify-between gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700">
      <span className="truncate">{value}</span>
      <ChevronDown size={16} className="text-gray-400" />
    </div>
  </div>
);

const SearchBox = ({
  label = "Search",
  placeholder = "Search",
  className = "",
}) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    <span className="text-[11px] font-medium text-gray-500">{label}</span>
    <input
      className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
      placeholder={placeholder}
    />
  </div>
);

/**
 * props:
 * - filters: [{ type:'select'|'search', label, value, placeholder, className }]
 * - showActions: boolean
 */
const FilterBar = ({ filters = [], showActions = true }) => {
  return (
    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex flex-wrap items-end gap-4">
        {/* Filters row */}
        <div className="flex flex-1 flex-wrap items-end gap-4">
          {filters.map((f, idx) => {
            if (f.type === "search") {
              return (
                <SearchBox
                  key={idx}
                  label={f.label}
                  placeholder={f.placeholder}
                  className={f.className}
                />
              );
            }
            return (
              <SelectBox
                key={idx}
                label={f.label}
                value={f.value}
                className={f.className}
              />
            );
          })}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="ml-auto flex items-center gap-2">
            <button className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700">
              Reset
            </button>
            <button className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white">
              Apply
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
