import React, { useMemo, useState } from "react";
import FilterBar from "../../components/FilterBar";
import CusTable from "../../components/CusTable";
import { Pencil, Lock } from "lucide-react";

const LocationsBinsTab = () => {
  const [filtersState, setFiltersState] = useState({
    search: "",
    zone: "All Zones",
    type: "All Types",
    status: "All Status",
  });

  const filters = [
    {
      key: "search",
      type: "search",
      label: "Search",
      placeholder: "Search bin code...",
      value: filtersState.search,
      className: "w-[280px]",
    },
    {
      key: "zone",
      label: "Zone",
      value: filtersState.zone,
      options: [
        "All Zones",
        "Storage Zone A",
        "Storage Zone B",
        "Pick Face",
        "Receiving Zone",
        "Cold Storage",
      ],
      className: "w-[220px]",
    },
    {
      key: "type",
      label: "Type",
      value: filtersState.type,
      options: ["All Types", "Pallet Racking", "Shelf Bin", "Floor Stack"],
      className: "w-[220px]",
    },
    {
      key: "status",
      label: "Status",
      value: filtersState.status,
      options: ["All Status", "Active", "Blocked"],
      className: "w-[220px]",
    },
  ];

  const onFilterChange = (key, val) =>
    setFiltersState((p) => ({ ...p, [key]: val }));

  const onReset = () =>
    setFiltersState({
      search: "",
      zone: "All Zones",
      type: "All Types",
      status: "All Status",
    });

  const onApply = () => {}; // UI only

  // UI-only sample data (no APIs yet)
  const rows = useMemo(
    () => [
      {
        id: "A-01-01-01",
        zone: "Storage Zone A",
        bin_code: "A-01-01-01",
        type: "Pallet Racking",
        capacity: "2 Pallets",
        utilization: 50,
        allowed_skus: "Any",
        status: "Active",
      },
      {
        id: "A-01-01-02",
        zone: "Storage Zone A",
        bin_code: "A-01-01-02",
        type: "Pallet Racking",
        capacity: "2 Pallets",
        utilization: 0,
        allowed_skus: "Any",
        status: "Active",
      },
      {
        id: "B-04-02-10",
        zone: "Storage Zone B",
        bin_code: "B-04-02-10",
        type: "Pallet Racking",
        capacity: "2 Pallets",
        utilization: 100,
        allowed_skus: "Heavy Items",
        status: "Active",
      },
      {
        id: "P-02-05",
        zone: "Pick Face",
        bin_code: "P-02-05",
        type: "Shelf Bin",
        capacity: "50 Liters",
        utilization: 75,
        allowed_skus: "Small Parts",
        status: "Active",
      },
      {
        id: "REC-DOCK-1",
        zone: "Receiving Zone",
        bin_code: "REC-DOCK-1",
        type: "Floor Stack",
        capacity: "N/A",
        utilization: 20,
        allowed_skus: "Any",
        status: "Blocked",
      },
      {
        id: "C-01-05",
        zone: "Cold Storage",
        bin_code: "C-01-05",
        type: "Pallet Racking",
        capacity: "1 Pallet",
        utilization: 0,
        allowed_skus: "Frozen Goods",
        status: "Active",
      },
      {
        id: "P-02-06",
        zone: "Pick Face",
        bin_code: "P-02-06",
        type: "Shelf Bin",
        capacity: "50 Liters",
        utilization: 90,
        allowed_skus: "Small Parts",
        status: "Active",
      },
      {
        id: "B-04-02-11",
        zone: "Storage Zone B",
        bin_code: "B-04-02-11",
        type: "Pallet Racking",
        capacity: "2 Pallets",
        utilization: 10,
        allowed_skus: "Heavy Items",
        status: "Active",
      },
    ],
    [],
  );

  const filteredRows = useMemo(() => {
    const q = (filtersState.search || "").toLowerCase().trim();

    return rows.filter((r) => {
      const matchesSearch =
        !q ||
        `${r.bin_code} ${r.zone} ${r.type} ${r.allowed_skus}`
          .toLowerCase()
          .includes(q);

      const matchesZone =
        filtersState.zone === "All Zones" || r.zone === filtersState.zone;

      const matchesType =
        filtersState.type === "All Types" || r.type === filtersState.type;

      const matchesStatus =
        filtersState.status === "All Status" ||
        r.status === filtersState.status;

      return matchesSearch && matchesZone && matchesType && matchesStatus;
    });
  }, [rows, filtersState]);

  const UtilBar = ({ pct }) => (
    <div className="flex items-center gap-2">
      <div className="h-2 w-[110px] overflow-hidden rounded-full bg-blue-100">
        <div
          className="h-full rounded-full bg-blue-600"
          style={{ width: `${Math.max(0, Math.min(100, pct || 0))}%` }}
        />
      </div>
      <span className="text-xs text-gray-600">{pct || 0}%</span>
    </div>
  );

  const columns = useMemo(
    () => [
      { key: "zone", title: "Zone" },
      {
        key: "bin_code",
        title: "Bin Code",
        render: (row) => (
          <span className="text-sm font-semibold text-blue-600">
            {row.bin_code}
          </span>
        ),
      },
      { key: "type", title: "Type" },
      { key: "capacity", title: "Capacity" },
      {
        key: "utilization",
        title: "Utilization",
        render: (row) => <UtilBar pct={row.utilization} />,
      },
      { key: "allowed_skus", title: "Allowed SKUs" },
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
                  : "bg-red-100 text-red-700",
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
          <div className="flex items-center justify-end gap-2">
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
              title="Lock / Block"
              onClick={() => {}}
            >
              <Lock className="h-4 w-4" />
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
          + Add Bin
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

export default LocationsBinsTab;
