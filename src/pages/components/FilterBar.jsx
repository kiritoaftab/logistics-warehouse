// src/pages/components/FilterBar.jsx
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

const normalizeOption = (opt) => {
  if (typeof opt === "string") {
    return { label: opt, value: opt };
  }
  return opt;
};

const useOutsideClick = (ref, handler) => {
  useEffect(() => {
    const listener = (e) => {
      if (!ref.current || ref.current.contains(e.target)) return;
      handler();
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
};

const SelectBox = ({
  label,
  value,
  options = [],
  className = "",
  isOpen,
  onToggle,
  onSelect,
  pagination,
  onPageChange,
}) => {
  const wrapRef = useRef(null);
  useOutsideClick(wrapRef, () => isOpen && onToggle(false));

  const normalizedOptions = options.map(normalizeOption);

  const selectedLabel =
    normalizedOptions.find((opt) => opt.value === value)?.label || "Select";

  return (
    <div
      ref={wrapRef}
      className={`relative flex w-full flex-col gap-1 ${className}`}
    >
      <span className="text-[11px] font-medium text-gray-500">{label}</span>

      <button
        type="button"
        onClick={() => onToggle(!isOpen)}
        className="flex w-full items-center justify-between gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown size={16} className="text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-full rounded-md border border-gray-200 bg-white shadow-sm z-50 max-h-[300px] flex flex-col">
          <div className="overflow-y-auto flex-1">
            {normalizedOptions.map((opt) => (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => {
                  onSelect(opt.value);
                  onToggle(false);
                }}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                  value === opt.value ? 'bg-blue-50 text-blue-700' : ''
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          
          {/* Pagination controls */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 px-2 py-2">
              <button
                onClick={() => onPageChange?.(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              
              <span className="text-xs text-gray-600">
                Page {pagination.page} of {pagination.pages}
              </span>
              
              <button
                onClick={() => onPageChange?.(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SearchBox = ({
  label = "Search",
  placeholder = "Search",
  className = "",
  value,
  onChange,
}) => (
  <div className={`flex w-full flex-col gap-1 ${className}`}>
    <span className="text-[11px] font-medium text-gray-500">{label}</span>
    <input
      value={value || ""}
      onChange={(e) => onChange?.(e.target.value)}
      className="h-9 w-full min-w-0 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
      placeholder={placeholder}
    />
  </div>
);

const FilterBar = ({
  filters = [],
  children,
  showActions = true,
  onFilterChange,
  onReset,
  onApply,
}) => {
  const [openKey, setOpenKey] = useState(null);

  return (
    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex flex-wrap items-start gap-4">
        <div className="flex flex-1 flex-wrap items-end gap-4">
          {filters.map((f, idx) => {
            const k = f.key || idx;

            if (f.type === "search") {
              return (
                <SearchBox
                  key={k}
                  label={f.label}
                  placeholder={f.placeholder}
                  className={`w-full sm:w-[220px] ${f.className || ""}`}
                  value={f.value}
                  onChange={(val) => onFilterChange?.(f.key, val)}
                />
              );
            }

            return (
              <SelectBox
                key={k}
                label={f.label}
                value={f.value}
                options={f.options || []}
                className={`w-full sm:w-[220px] ${f.className || ""}`}
                isOpen={openKey === k}
                onToggle={(open) => setOpenKey(open ? k : null)}
                onSelect={(val) => onFilterChange?.(f.key, val)}
                pagination={f.pagination}
                onPageChange={f.onPageChange}
              />
            );
          })}

          {children}

          {showActions && (
            <div className="sm:flex items-center gap-2 pt-4 space-y-2 sm:space-y-0 ">
              <button
                type="button"
                onClick={onApply}
                className="w-[120px] me-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 transition-colors"
              >
                Apply
              </button>
              <button
                type="button"
                onClick={onReset}
                className="w-[120px] rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;