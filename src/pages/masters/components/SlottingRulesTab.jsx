// SlottingRulesTab.jsx (UI only)
import React, { useMemo, useState } from "react";
import FilterBar from "../../components/FilterBar";
import CusTable from "../../components/CusTable";
import { Pencil, Copy, Trash2 } from "lucide-react";
import { getUserRole } from "../../utils/authStorage";
import { useAccess } from "../../utils/useAccess";

const SlottingRulesTab = () => {
  const [filtersState, setFiltersState] = useState({
    search: "",
    client: "All Clients",
    strategy: "All Strategies",
    status: "All Status",
  });

  const roleCode = getUserRole();
  const isAdmin = roleCode === "ADMIN";
  const access = useAccess("LOCATIONS");
  const canCreate = isAdmin || access.canCreate;
  const canUpdate = isAdmin || access.canUpdate;
  const canDelete = isAdmin || access.canDelete;
  const showActionsColumn = canUpdate || canDelete;

  const filters = [
    {
      key: "search",
      type: "search",
      label: "Search",
      placeholder: "Search rules...",
      value: filtersState.search,
      className: "w-[280px]",
    },
    {
      key: "client",
      label: "Client",
      value: filtersState.client,
      options: ["All Clients", "TechCorp", "Pharma Plus", "Fashion Retailers"],
      className: "w-[220px]",
    },
    {
      key: "strategy",
      label: "Strategy",
      value: filtersState.strategy,
      options: [
        "All Strategies",
        "Velocity (Fast)",
        "FEFO (First Expired First Out)",
        "Space Utilization",
        "Weight Limit Constraint",
        "Promotional Staging",
      ],
      className: "w-[240px]",
    },
    {
      key: "status",
      label: "Status",
      value: filtersState.status,
      options: ["All Status", "Active", "Inactive"],
      className: "w-[220px]",
    },
  ];

  const onFilterChange = (key, val) =>
    setFiltersState((p) => ({ ...p, [key]: val }));

  const onReset = () =>
    setFiltersState({
      search: "",
      client: "All Clients",
      strategy: "All Strategies",
      status: "All Status",
    });

  const onApply = () => {}; // UI only

  const rows = useMemo(
    () => [
      {
        id: "SR-001",
        rule_name: "Fast Movers - Tech",
        applies_to: "TechCorp / Electronics",
        client: "TechCorp",
        strategy: "Velocity (Fast)",
        target_zone: "Pick Face",
        priority: 1,
        status: "Active",
      },
      {
        id: "SR-002",
        rule_name: "Cold Chain - Vaccines",
        applies_to: "Pharma Plus / Vaccines",
        client: "Pharma Plus",
        strategy: "FEFO (First Expired First Out)",
        target_zone: "Cold Storage",
        priority: 1,
        status: "Active",
      },
      {
        id: "SR-003",
        rule_name: "Bulk Storage Defaults",
        applies_to: "All Clients / General",
        client: "All Clients",
        strategy: "Space Utilization",
        target_zone: "Storage Zone B",
        priority: 5,
        status: "Active",
      },
      {
        id: "SR-004",
        rule_name: "Heavy Items Logic",
        applies_to: "All Clients / Heavy Equip",
        client: "All Clients",
        strategy: "Weight Limit Constraint",
        target_zone: "Storage Zone A",
        priority: 2,
        status: "Active",
      },
      {
        id: "SR-005",
        rule_name: "Seasonal Promo - Winter",
        applies_to: "Fashion Retailers / Coats",
        client: "Fashion Retailers",
        strategy: "Promotional Staging",
        target_zone: "Pick Face",
        priority: 3,
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
        `${r.rule_name} ${r.applies_to} ${r.strategy} ${r.target_zone}`
          .toLowerCase()
          .includes(q);

      const matchesClient =
        filtersState.client === "All Clients" ||
        r.client === filtersState.client;

      const matchesStrategy =
        filtersState.strategy === "All Strategies" ||
        r.strategy === filtersState.strategy;

      const matchesStatus =
        filtersState.status === "All Status" ||
        r.status === filtersState.status;

      return matchesSearch && matchesClient && matchesStrategy && matchesStatus;
    });
  }, [rows, filtersState]);

  const columns = useMemo(
    () => [
      {
        key: "rule_name",
        title: "Rule Name",
        render: (row) => (
          <span className="text-sm font-semibold text-blue-600">
            {row.rule_name}
          </span>
        ),
      },
      { key: "applies_to", title: "Applies To" },
      { key: "strategy", title: "Strategy" },
      { key: "target_zone", title: "Target Zone" },
      { key: "priority", title: "Priority" },
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
      ...(showActionsColumn
        ? [
            {
              key: "actions",
              title: "Actions",
              render: (row) => (
                <div className="flex items-center justify-end gap-2">
                  {canUpdate && (
                    <>
                      <button
                        type="button"
                        className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
                        title="Edit"
                        onClick={() => {}}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
                    title="Duplicate"
                    onClick={() => {}}
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  {canDelete && (
                    <button
                      type="button"
                      className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
                      title="Delete"
                      onClick={() => {}}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ),
            },
          ]
        : []),
    ],
    [],
  );

  return (
    <div>
      <div className="mb-4 flex items-center justify-end">
        {canCreate && (
          <button
            type="button"
            onClick={() => {}}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white"
          >
            + Add Rule
          </button>
        )}
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

export default SlottingRulesTab;
