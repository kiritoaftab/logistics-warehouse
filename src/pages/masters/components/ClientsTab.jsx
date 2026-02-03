import React, { useEffect, useMemo, useState } from "react";
import FilterBar from "../../components/FilterBar";
import CusTable from "../../components/CusTable";
import Pagination from "../../components/Pagination";
import { Pencil, Plus } from "lucide-react";
import AddSkuModal from "./modals/AddSkuModal";
import ClientModal from "./modals/ClientModal";
import http from "../../../api/http";
import { useAccess } from "../../utils/useAccess";
import { getUserRole } from "../../utils/authStorage";

const ClientsTab = () => {
  const [filtersState, setFiltersState] = useState({
    status: "All Active",
    search: "",
  });

  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 10,
  });

  // Client modal
  const [showClientModal, setShowClientModal] = useState(false);
  const [clientMode, setClientMode] = useState("create"); // create | edit
  const [editingClient, setEditingClient] = useState(null);

  // SKU modal
  const [showSkuModal, setShowSkuModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const roleCode = getUserRole();
  const isAdmin = roleCode === "ADMIN";
  const access = useAccess("CLIENTs");
  const canCreate = isAdmin || access.canCreate;
  const canUpdate = isAdmin || access.canUpdate;
  const canDelete = isAdmin || access.canDelete;
  const showActionsColumn = canUpdate || canDelete;

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
      placeholder: "Search client name / code...",
      value: filtersState.search,
      className: "w-[420px]",
    },
  ];

  const onFilterChange = (key, val) =>
    setFiltersState((p) => ({ ...p, [key]: val }));

  const fetchClients = async (page = 1) => {
    try {
      setLoading(true);
      const limit = pagination.limit || 10;

      const res = await http.get(`/clients?page=${page}&limit=${limit}`);
      const payload = res?.data?.data;

      setClients(payload?.clients || []);
      setPagination(
        payload?.pagination || { total: 0, page: 1, pages: 1, limit },
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients(1);
  }, []);

  const onReset = () => {
    setFiltersState({ status: "All Active", search: "" });
    fetchClients(1);
  };

  const onApply = () => fetchClients(1);

  const filteredRows = useMemo(() => {
    const q = (filtersState.search || "").toLowerCase().trim();

    return (clients || []).filter((r) => {
      const matchesSearch =
        !q || `${r.client_name} ${r.client_code}`.toLowerCase().includes(q);

      const statusText = r.is_active ? "Active" : "Inactive";
      const matchesStatus =
        filtersState.status === "All Active" ||
        statusText === filtersState.status;

      return matchesSearch && matchesStatus;
    });
  }, [clients, filtersState]);

  const openAddClient = () => {
    setClientMode("create");
    setEditingClient(null);
    setShowClientModal(true);
  };

  const openEditClient = (row) => {
    setClientMode("edit");
    setEditingClient(row);
    setShowClientModal(true);
  };

  const openAddSku = (client) => {
    setSelectedClient(client);
    setShowSkuModal(true);
  };

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
            <div className="text-xs text-gray-500">
              Code: {row.client_code} • ID: {row.id}
            </div>
          </div>
        ),
      },
      {
        key: "billing_type",
        title: "Billing Type",
        render: (row) => (
          <span className="inline-flex items-center rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] font-medium text-gray-700">
            {row.billing_type || "-"}
          </span>
        ),
      },
      {
        key: "status",
        title: "Status",
        render: (row) => {
          const isActive = !!row.is_active;
          return (
            <span
              className={[
                "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold",
                isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700",
              ].join(" ")}
            >
              {isActive ? "Active" : "Inactive"}
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
                  {canCreate && (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
                      title="Add SKU"
                      onClick={() => openAddSku(row)}
                    >
                      <Plus className="h-4 w-4" />
                      Add SKU
                    </button>
                  )}
                  {canUpdate && (
                    <button
                      type="button"
                      className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
                      title="Edit Client"
                      onClick={() => openEditClient(row)}
                    >
                      <Pencil className="h-4 w-4" />
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
            onClick={openAddClient}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white"
          >
            + Add Client
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
        {loading ? (
          <div className="p-6 text-sm text-gray-600">Loading clients...</div>
        ) : (
          <CusTable columns={columns} data={filteredRows} />
        )}

        <Pagination
          pagination={pagination}
          onPageChange={(p) => fetchClients(p)}
        />
      </div>

      {/* Add / Edit Client */}
      <ClientModal
        open={showClientModal}
        mode={clientMode}
        client={editingClient}
        onClose={() => setShowClientModal(false)}
        onSaved={() => fetchClients(pagination.page)}
      />

      {/* Add SKU */}
      <AddSkuModal
        open={showSkuModal}
        client={selectedClient}
        onClose={() => setShowSkuModal(false)}
        onCreated={() => {}}
      />
    </div>
  );
};

export default ClientsTab;
