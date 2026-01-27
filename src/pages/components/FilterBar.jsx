import React from "react";
import { ChevronDown } from "lucide-react";

const FilterSelect = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs font-medium text-gray-500 uppercase">{label}</span>
    <div className="flex items-center justify-between gap-2 border rounded-md px-3 py-2 text-sm bg-white cursor-pointer">
      <span>{value}</span>
      <ChevronDown size={16} className="text-gray-400" />
    </div>
  </div>
);

const FilterBar = () => {
  return (
    <div className="bg-[#F6F8FA] border rounded-lg p-4 mb-6">
      <div className="flex flex-wrap items-end gap-4 justify-between">
        <div className="flex flex-wrap gap-4">
          <FilterSelect label="Time Period" value="Today" />
          <FilterSelect label="Warehouse" value="WH-NYC-01" />
          <FilterSelect label="Client" value="All Clients" />
        </div>

        <div className="flex gap-2">
          <button className="px-4 py-2 border rounded-md text-sm bg-white">
            Reset
          </button>
          <button className="px-4 py-2 rounded-md text-sm bg-primary text-white">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
