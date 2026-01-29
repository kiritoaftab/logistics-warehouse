// ClientsTab.jsx (UI only)
import React, { useMemo, useState } from "react";
import FilterBar from "../../components/FilterBar";
import CusTable from "../../components/CusTable";
import { Pencil, MoreHorizontal } from "lucide-react";

const ClientsTab = () => {
  const [filtersState, setFiltersState] = useState({
    status: "All Active",
    search: "",
  });

  const filters = [
    {
      key: "status",
      label: "Status",
      value: filtersState.status,
      options: ["All Active", "Active", "Inactive"],
      className: "w-[220px]",
    },
    {
      key: "search",
      type: "search",
      label: "Search",
      placeholder: "Search client name...",
      value: filtersState.search,
      className: "w-[420px]",
    },
  ];

  const onFilterChange = (key, val) =>
    setFiltersState((p) => ({ ...p, [key]: val }));

  const onReset = () => setFiltersState({ status: "All Active", search: "" });

  const onApply = () => {}; // UI only

  const rows = useMemo(
    () => [
      {
        id: "CL-001",
        client_name: "Acme Corp",
        billing_model: ["Storage", "Handling", "Pick/Pack"],
        status: "Active",
      },
      {
        id: "CL-002",
        client_name: "Globex Inc",
        billing_model: ["Storage (Volume)", "Handling"],
        status: "Active",
      },
      {
        id: "CL-003",
        client_name: "Soylent Corp",
        billing_model: ["Fixed Fee"],
        status: "Active",
      },
      {
        id: "CL-004",
        client_name: "Umbrella Corp",
        billing_model: ["Storage", "Handling", "Cold Chain Surcharge"],
        status: "Inactive",
      },
      {
        id: "CL-005",
        client_name: "Cyberdyne Systems",
        billing_model: ["Storage", "Handling"],
        status: "Active",
      },
    ],
    [],
  );

  const filteredRows = useMemo(() => {
    const q = (filtersState.search || "").toLowerCase().trim();

    return rows.filter((r) => {
      const matchesSearch =
        !q || `${r.client_name} ${r.id}`.toLowerCase().includes(q);

      const matchesStatus =
        filtersState.status === "All Active" ||
        r.status === filtersState.status;

      return matchesSearch && matchesStatus;
    });
  }, [rows, filtersState]);

  const columns = useMemo(
    () => [
      {
        key: "client_name",
        title: "Client Name",
        render: (row) => (
          <div>
            <div className="text-sm font-semibold text-gray-900">
              {row.client_name}
            </div>
            <div className="text-xs text-gray-500">ID: {row.id}</div>
          </div>
        ),
      },
      {
        key: "billing_model",
        title: "Billing Model",
        render: (row) => (
          <div className="flex flex-wrap gap-1">
            {(row.billing_model || []).map((b) => (
              <span
                key={b}
                className="inline-flex items-center rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] font-medium text-gray-700"
              >
                {b}
              </span>
            ))}
          </div>
        ),
      },
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
              title="More"
              onClick={() => {}}
            >
              <MoreHorizontal className="h-4 w-4" />
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
          + Add Client
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

export default ClientsTab;
