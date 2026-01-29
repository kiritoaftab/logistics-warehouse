import React, { useMemo, useState } from "react";
import FilterBar from "../../components/FilterBar";
import CusTable from "../../components/CusTable";
import { Pencil, MoreVertical } from "lucide-react";

const SKUsTab = () => {
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
      options: ["Acme Corp", "Globex", "Umbrella"],
      className: "w-[220px]",
    },
    {
      key: "category",
      label: "Category",
      value: filtersState.category,
      options: [
        "All Categories",
        "Electronics",
        "FMCG",
        "Apparel",
        "Food",
        "Home",
        "Furniture",
      ],
      className: "w-[220px]",
    },
    {
      key: "controls",
      label: "Controls",
      value: filtersState.controls,
      options: ["Any", "With Controls", "No Controls"],
      className: "w-[220px]",
    },
    {
      key: "search",
      type: "search",
      label: "Search",
      placeholder: "Search SKU code / name...",
      value: filtersState.search,
      className: "w-[360px]",
    },
  ];

  const onFilterChange = (key, val) =>
    setFiltersState((p) => ({ ...p, [key]: val }));

  const onReset = () =>
    setFiltersState({
      client: "Acme Corp",
      category: "All Categories",
      controls: "Any",
      search: "",
    });

  const onApply = () => {}; // UI only

  // UI only sample data
  const rows = useMemo(
    () => [
      {
        id: "SKU-10045",
        sku_code: "SKU-10045",
        barcode: "8901234567890",
        name: "Wireless Headphones XL",
        category: "Electronics",
        uom: "Units",
        controls: ["Serial"],
        putaway_zone: "High Value Cage",
        pick_rule: "FIFO",
        status: "Active",
      },
      {
        id: "SKU-20221",
        sku_code: "SKU-20221",
        barcode: "8909876543210",
        name: "Organic Green Tea 100g",
        category: "FMCG",
        uom: "Pack",
        controls: ["Batch", "Expiry"],
        putaway_zone: "Ambient Storage",
        pick_rule: "FEFO",
        status: "Active",
      },
      {
        id: "SKU-55001",
        sku_code: "SKU-55001",
        barcode: "N/A",
        name: "Cotton T-Shirt Large",
        category: "Apparel",
        uom: "Units",
        controls: [],
        putaway_zone: "Apparel Mezzanine",
        pick_rule: "FIFO",
        status: "Active",
      },
      {
        id: "SKU-99100",
        sku_code: "SKU-99100",
        barcode: "778899001122",
        name: "Frozen Peas 1kg",
        category: "Food",
        uom: "Bag",
        controls: ["Batch", "Expiry"],
        putaway_zone: "Cold Storage A",
        pick_rule: "FEFO",
        status: "Inactive",
      },
      {
        id: "SKU-88002",
        sku_code: "SKU-88002",
        barcode: "556677889900",
        name: "Glass Vase Decorative",
        category: "Home",
        uom: "Box",
        controls: ["Fragile"],
        putaway_zone: "Fragile Zone",
        pick_rule: "FIFO",
        status: "Active",
      },
      {
        id: "SKU-30045",
        sku_code: "SKU-30045",
        barcode: "998877665544",
        name: "Almond Milk 1L",
        category: "Food",
        uom: "Carton",
        controls: ["Batch", "Expiry"],
        putaway_zone: "Ambient Storage",
        pick_rule: "FEFO",
        status: "Active",
      },
      {
        id: "SKU-70707",
        sku_code: "SKU-70707",
        barcode: "111222333444",
        name: "Office Chair Ergonomic",
        category: "Furniture",
        uom: "Units",
        controls: [],
        putaway_zone: "Bulk Storage",
        pick_rule: "FIFO",
        status: "Active",
      },
    ],
    [],
  );

  const filteredRows = useMemo(() => {
    const q = (filtersState.search || "").toLowerCase().trim();

    return rows.filter((r) => {
      const matchesSearch =
        !q || `${r.sku_code} ${r.barcode} ${r.name}`.toLowerCase().includes(q);

      const matchesCategory =
        filtersState.category === "All Categories" ||
        r.category === filtersState.category;

      const hasControls = (r.controls || []).length > 0;
      const matchesControls =
        filtersState.controls === "Any" ||
        (filtersState.controls === "With Controls" && hasControls) ||
        (filtersState.controls === "No Controls" && !hasControls);

      return matchesSearch && matchesCategory && matchesControls;
    });
  }, [rows, filtersState]);

  const columns = useMemo(
    () => [
      {
        key: "sku_code",
        title: "SKU Code",
        render: (row) => (
          <div>
            <div className="text-sm font-semibold text-blue-600">
              {row.sku_code}
            </div>
            <div className="text-xs text-gray-500">{row.barcode}</div>
          </div>
        ),
      },
      { key: "name", title: "Name" },
      { key: "category", title: "Category" },
      { key: "uom", title: "UOM" },
      {
        key: "controls",
        title: "Controls",
        render: (row) => {
          const list = row.controls || [];
          if (!list.length) return <span className="text-gray-500">-</span>;
          return (
            <div className="flex flex-wrap gap-1">
              {list.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] font-medium text-gray-700"
                >
                  {c}
                </span>
              ))}
            </div>
          );
        },
      },
      { key: "putaway_zone", title: "Putaway Zone" },
      { key: "pick_rule", title: "Pick Rule" },
      {
        key: "status",
        title: "Status",
        render: (row) => {
          const isActive = row.status === "Active";
          return (
            <span
              className={[
                "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold",
                isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700",
              ].join(" ")}
            >
              {row.status}
            </span>
          );
        },
      },
      {
        key: "actions",
        title: "Actions",
        render: () => (
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
              title="Edit"
              onClick={() => {}}
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
              title="More"
              onClick={() => {}}
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div>
      <div className="mb-4 flex items-center justify-end">
        <button
          type="button"
          onClick={() => {}}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white"
        >
          + Add SKU
        </button>
      </div>

      <FilterBar
        filters={filters}
        onFilterChange={onFilterChange}
        onApply={onApply}
        onReset={onReset}
      />

      <div className="rounded-lg border border-gray-200 bg-white p-2">
        <CusTable columns={columns} data={filteredRows} />
      </div>
    </div>
  );
};

export default SKUsTab;
