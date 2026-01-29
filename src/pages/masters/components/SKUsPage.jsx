import React, { useMemo, useState } from "react";
import FilterBar from "../../components/FilterBar";
import CusTable from "../../components/CusTable";

const SKUsPage = () => {
  const [filtersState, setFiltersState] = useState({
    client: "Acme Corp",
    category: "All Categories",
    controls: "Any",
    search: "",
  });

  const filters = [
    {
      key: "client",
      label: "Client",
      value: filtersState.client,
      options: ["Acme Corp", "All Clients"],
      className: "w-[220px]",
    },
    {
      key: "category",
      label: "Category",
      value: filtersState.category,
      options: ["All Categories", "Electronics", "Food", "FMCG", "Home"],
      className: "w-[220px]",
    },
    {
      key: "controls",
      label: "Controls",
      value: filtersState.controls,
      options: ["Any", "Serial", "Batch", "Expiry", "Fragile"],
      className: "w-[220px]",
    },
    {
      key: "search",
      type: "search",
      label: "Search",
      placeholder: "Search SKU code / name...",
      value: filtersState.search,
      className: "w-[320px]",
    },
  ];

  const onFilterChange = (key, val) =>
    setFiltersState((p) => ({ ...p, [key]: val }));

  const onApply = () => console.log("apply sku filters", filtersState);
  const onReset = () =>
    setFiltersState({
      client: "Acme Corp",
      category: "All Categories",
      controls: "Any",
      search: "",
    });

  const columns = useMemo(
    () => [
      { key: "sku", title: "SKU Code" },
      { key: "name", title: "Name" },
      { key: "category", title: "Category" },
      { key: "uom", title: "UOM" },
      { key: "controls", title: "Controls" },
      { key: "zone", title: "Putaway Zone" },
      { key: "pickRule", title: "Pick Rule" },
      { key: "status", title: "Status" },
    ],
    [],
  );

  const data = [
    {
      id: 1,
      sku: "SKU-10045",
      name: "Wireless Headphones XL",
      category: "Electronics",
      uom: "Units",
      controls: "Serial",
      zone: "High Value Cage",
      pickRule: "FIFO",
      status: "Active",
    },
  ];

  return (
    <div>
      <FilterBar
        filters={filters}
        onFilterChange={onFilterChange}
        onApply={onApply}
        onReset={onReset}
      />

      <div className="rounded-lg border border-gray-200 bg-white p-2">
        <CusTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default SKUsPage;
