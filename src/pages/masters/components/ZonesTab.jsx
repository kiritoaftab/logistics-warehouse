import React, { useMemo, useState } from "react";
import FilterBar from "../../components/FilterBar";
import CusTable from "../../components/CusTable";
import { Pencil, Ban } from "lucide-react";

const ZonesTab = () => {
  const [filtersState, setFiltersState] = useState({
    zoneType: "All Types",
    tempType: "All",
    status: "Active",
    search: "",
  });

  const filters = [
    {
      key: "zoneType",
      label: "Zone Type",
      value: filtersState.zoneType,
      options: [
        "All Types",
        "Receiving",
        "Storage",
        "Pick Face",
        "Packing",
        "Dispatch",
        "Hold",
      ],
      className: "w-[220px]",
    },
    {
      key: "tempType",
      label: "Temp Type",
      value: filtersState.tempType,
      options: ["All", "Ambient", "Cold Storage", "Frozen"],
      className: "w-[220px]",
    },
    {
      key: "status",
      label: "Status",
      value: filtersState.status,
      options: ["All", "Active", "Inactive"],
      className: "w-[220px]",
    },
    {
      key: "search",
      type: "search",
      label: "Search",
      placeholder: "Search zones...",
      value: filtersState.search,
      className: "w-[320px]",
    },
  ];

  const onFilterChange = (key, val) =>
    setFiltersState((p) => ({ ...p, [key]: val }));

  const onReset = () =>
    setFiltersState({
      zoneType: "All Types",
      tempType: "All",
      status: "Active",
      search: "",
    });

  const onApply = () => {}; // UI only

  // UI-only sample data (no APIs yet)
  const rows = useMemo(
    () => [
      {
        id: "ZONE-A-REC",
        zone_name: "ZONE-A-REC",
        zone_type: "Receiving",
        temp_type: "Ambient",
        utilization_rule: "Flexible",
        status: "Active",
      },
      {
        id: "ZONE-B-STORAGE",
        zone_name: "ZONE-B-STORAGE",
        zone_type: "Storage",
        temp_type: "Ambient",
        utilization_rule: "Standard Pallet",
        status: "Active",
      },
      {
        id: "ZONE-C-PICK",
        zone_name: "ZONE-C-PICK",
        zone_type: "Pick Face",
        temp_type: "Ambient",
        utilization_rule: "Carton Flow",
        status: "Active",
      },
      {
        id: "ZONE-D-COLD",
        zone_name: "ZONE-D-COLD",
        zone_type: "Storage",
        temp_type: "Cold Storage",
        utilization_rule: "Standard Pallet",
        status: "Active",
      },
      {
        id: "ZONE-E-PACK",
        zone_name: "ZONE-E-PACK",
        zone_type: "Packing",
        temp_type: "Ambient",
        utilization_rule: "Workstation",
        status: "Active",
      },
      {
        id: "ZONE-F-DISPATCH",
        zone_name: "ZONE-F-DISPATCH",
        zone_type: "Dispatch",
        temp_type: "Ambient",
        utilization_rule: "Staging Lane",
        status: "Active",
      },
      {
        id: "ZONE-H-HOLD",
        zone_name: "ZONE-H-HOLD",
        zone_type: "Hold",
        temp_type: "Ambient",
        utilization_rule: "Cage",
        status: "Active",
      },
      {
        id: "ZONE-X-OBSOLETE",
        zone_name: "ZONE-X-OBSOLETE",
        zone_type: "Storage",
        temp_type: "Ambient",
        utilization_rule: "Standard Pallet",
        status: "Inactive",
      },
    ],
    [],
  );

  const filteredRows = useMemo(() => {
    const q = (filtersState.search || "").toLowerCase().trim();

    return rows.filter((r) => {
      const matchesSearch =
        !q ||
        `${r.zone_name} ${r.zone_type} ${r.temp_type} ${r.utilization_rule}`
          .toLowerCase()
          .includes(q);

      const matchesZoneType =
        filtersState.zoneType === "All Types" ||
        r.zone_type === filtersState.zoneType;

      const matchesTempType =
        filtersState.tempType === "All" ||
        r.temp_type === filtersState.tempType;

      const matchesStatus =
        filtersState.status === "All" || r.status === filtersState.status;

      return (
        matchesSearch && matchesZoneType && matchesTempType && matchesStatus
      );
    });
  }, [rows, filtersState]);

  const columns = useMemo(
    () => [
      {
        key: "zone_name",
        title: "Zone Name",
        render: (row) => (
          <span className="text-sm font-semibold text-blue-600">
            {row.zone_name}
          </span>
        ),
      },
      { key: "zone_type", title: "Zone Type" },
      { key: "temp_type", title: "Temp Type" },
      { key: "utilization_rule", title: "Utilization Rule" },
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
              title="Disable"
              onClick={() => {}}
            >
              <Ban className="h-4 w-4" />
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
          + Add Zone
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

export default ZonesTab;
