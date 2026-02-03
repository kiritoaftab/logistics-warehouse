import React, { useMemo, useState, useEffect, useCallback } from "react";
import FilterBar from "../../components/FilterBar";
import CusTable from "../../components/CusTable";
import { Pencil, Trash2, RefreshCw, Anchor, Eye, Plus } from "lucide-react";
import http from "../../../api/http";
import toast from "react-hot-toast";
import AddEditDockModal from "./modals/AddEditDockModal"; 

const DockTab = () => {
  const [docks, setDocks] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [warehousesLoading, setWarehousesLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDock, setSelectedDock] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [filtersState, setFiltersState] = useState({
    search: "",
    dock_type: "All Types",
    status: "All Status",
    warehouse_id: "All Warehouses",
  });

  // Fetch warehouses
  const fetchWarehouses = useCallback(async () => {
    try {
      setWarehousesLoading(true);
      const response = await http.get("/warehouses");
      if (response.data.success) {
        setWarehouses(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching warehouses:", err);
      toast.error("Failed to load warehouses");
    } finally {
      setWarehousesLoading(false);
    }
  }, []);

  // Fetch docks
  const fetchDocks = useCallback(async (showToast = false) => {
    try {
      setLoading(true);
      if (showToast) setRefreshing(true);
      setError(null);

      const response = await http.get("/docks/?showIsActive=true");
      if (response.data.success) {
        setDocks(response.data.data);
        if (showToast) {
          toast.success("Docks refreshed successfully");
        }
      } else {
        throw new Error("Failed to fetch docks");
      }
    } catch (err) {
      console.error("Error fetching docks:", err);
      const errorMsg = "Failed to load docks. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
      if (showToast) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDocks();
    fetchWarehouses();
  }, [fetchDocks, fetchWarehouses]);

  const dockTypes = ["Inbound", "Outbound", "Mixed"];
  const statusOptions = ["All Status", "Active", "Inactive"];

  // Warehouse options for filter
  const warehouseOptions = useMemo(() => {
    const baseOptions = ["All Warehouses"];
    const warehouseList = warehouses.map((wh) => `${wh.warehouse_name} (${wh.warehouse_code})`);
    return [...baseOptions, ...warehouseList];
  }, [warehouses]);

  // Get warehouse ID from display name
  const getWarehouseIdFromName = (displayName) => {
    if (displayName === "All Warehouses") return null;
    const match = displayName.match(/\(([^)]+)\)/);
    if (match) {
      const code = match[1];
      const warehouse = warehouses.find((wh) => wh.warehouse_code === code);
      return warehouse ? warehouse.id : null;
    }
    return null;
  };

  // Get display name from warehouse ID
  const getWarehouseDisplayName = (warehouseId) => {
    if (warehouseId === "All Warehouses" || !warehouseId) return "All Warehouses";
    const warehouse = warehouses.find((wh) => wh.id === parseInt(warehouseId));
    return warehouse ? `${warehouse.warehouse_name} (${warehouse.warehouse_code})` : "All Warehouses";
  };

  const filters = [
    {
      key: "search",
      type: "search",
      label: "Search",
      placeholder: "Search dock name or code...",
      value: filtersState.search,
      className: "w-[300px]",
    },
    {
      key: "dock_type",
      label: "Dock Type",
      value: filtersState.dock_type,
      options: ["All Types", ...dockTypes],
      className: "w-[200px]",
    },
    {
      key: "status",
      label: "Status",
      value: filtersState.status,
      options: statusOptions,
      className: "w-[180px]",
    },
    {
      key: "warehouse_id",
      label: "Warehouse",
      value: getWarehouseDisplayName(filtersState.warehouse_id),
      options: warehouseOptions,
      className: "w-[250px]",
    },
  ];

  // Handle warehouse filter change
  const onFilterChange = (key, val) => {
    if (key === "warehouse_id") {
      // Convert display name back to ID
      const warehouseId = val === "All Warehouses" ? "All Warehouses" : getWarehouseIdFromName(val);
      setFiltersState((p) => ({ ...p, [key]: warehouseId }));
    } else {
      setFiltersState((p) => ({ ...p, [key]: val }));
    }
  };

  const onReset = () => {
    setFiltersState({
      search: "",
      dock_type: "All Types",
      status: "All Status",
      warehouse_id: "All Warehouses",
    });
    toast.success("Filters reset to default");
  };

  const onApply = () => {
    toast.success("Filters applied");
  };

  const handleAddDock = () => {
    setSelectedDock(null);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEditDock = (dock) => {
    setSelectedDock(dock);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleViewDock = (dock) => {
    toast.success(`Viewing dock ${dock.dock_name}`);
    // You can implement a detailed view modal here
  };

  const handleDeleteDock = async (dock) => {
    if (!deleteConfirm || deleteConfirm.id !== dock.id) {
      setDeleteConfirm({
        id: dock.id,
        name: dock.dock_name,
      });
      return;
    }

    const deletePromise = new Promise(async (resolve, reject) => {
      try {
        await http.delete(`/docks/${dock.id}`);
        setDocks((prev) => prev.filter((d) => d.id !== dock.id));
        setDeleteConfirm(null);
        resolve();
      } catch (err) {
        console.error("Error deleting dock:", err);
        setDeleteConfirm(null);
        reject(err);
      }
    });

    toast.promise(deletePromise, {
      loading: "Deleting dock...",
      success: "Dock deleted successfully",
      error: (err) =>
        `Failed to delete dock: ${err.response?.data?.message || "Unknown error"}`,
    });
  };

  const handleRefresh = () => {
    fetchDocks(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedDock(null);
  };

  const handleModalSuccess = () => {
    fetchDocks(true);
  };

  const filteredRows = useMemo(() => {
    const q = (filtersState.search || "").toLowerCase().trim();

    return docks.filter((dock) => {
      const matchesSearch =
        !q ||
        `${dock.dock_name} ${dock.dock_code} ${dock.warehouse?.warehouse_name || ""}`
          .toLowerCase()
          .includes(q);

      const matchesType =
        filtersState.dock_type === "All Types" ||
        dock.dock_type === filtersState.dock_type;

      const matchesStatus =
        filtersState.status === "All Status" ||
        (filtersState.status === "Active" && dock.is_active === true) ||
        (filtersState.status === "Inactive" && dock.is_active === false);

      // Warehouse filter logic
      const matchesWarehouse =
        filtersState.warehouse_id === "All Warehouses" ||
        dock.warehouse_id?.toString() === filtersState.warehouse_id?.toString();

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus &&
        matchesWarehouse
      );
    });
  }, [docks, filtersState]);

  const getDockTypeColor = (type) => {
    const typeColors = {
      Inbound: "bg-green-100 text-green-700",
      Outbound: "bg-blue-100 text-blue-700",
      Mixed: "bg-purple-100 text-purple-700",
    };
    return typeColors[type] || "bg-gray-100 text-gray-700";
  };

  const getStatusColor = (isActive) => {
    return isActive
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";
  };

  const columns = useMemo(
    () => [
      {
        key: "dock_code",
        title: "Dock Code",
        render: (row) => (
          <div className="flex items-center gap-2">
            <Anchor className="h-4 w-4 text-blue-500" />
            <span className="font-semibold text-blue-600">{row.dock_code}</span>
          </div>
        ),
      },
      {
        key: "dock_name",
        title: "Dock Name",
        render: (row) => (
          <div className="text-sm">
            <div className="font-medium">{row.dock_name}</div>
          </div>
        ),
      },
      {
        key: "dock_type",
        title: "Type",
        render: (row) => (
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getDockTypeColor(row.dock_type)}`}
          >
            {row.dock_type}
          </span>
        ),
      },
      {
        key: "warehouse",
        title: "Warehouse",
        render: (row) => (
          <div className="text-sm">
            <div className="font-medium">
              {row.warehouse?.warehouse_name || "Unknown"}
            </div>
            <div className="text-xs text-gray-500">
              {row.warehouse?.warehouse_code || ""}
            </div>
          </div>
        ),
      },
      {
        key: "capacity",
        title: "Capacity",
        render: (row) => (
          <div className="text-center">
            <span className="text-sm font-semibold">{row.capacity}</span>
            <div className="text-xs text-gray-500">trucks</div>
          </div>
        ),
      },
      {
        key: "is_active",
        title: "Status",
        render: (row) => (
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(row.is_active)}`}
          >
            {row.is_active ? "Active" : "Inactive"}
          </span>
        ),
      },
      {
        key: "updated_at",
        title: "Last Updated",
        render: (row) => (
          <div className="text-sm">
            <div>{new Date(row.updated_at).toLocaleDateString()}</div>
            <div className="text-xs text-gray-500">
              {new Date(row.updated_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        ),
      },
      {
        key: "actions",
        title: "Actions",
        render: (row) => (
          <div className="flex items-center justify-start gap-1">
            <button
              type="button"
              className="rounded-md p-2 text-blue-600 hover:bg-blue-50"
              title="View Details"
              onClick={() => handleViewDock(row)}
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
              title="Edit"
              onClick={() => handleEditDock(row)}
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              className={`rounded-md p-2 hover:bg-gray-100 ${deleteConfirm?.id === row.id ? "text-white bg-red-600" : "text-red-600"}`}
              title={deleteConfirm?.id === row.id ? "Confirm Delete" : "Delete"}
              onClick={() => handleDeleteDock(row)}
            >
              {deleteConfirm?.id === row.id ? (
                <span className="text-xs font-medium">Confirm</span>
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </button>
          </div>
        ),
      },
    ],
    [deleteConfirm],
  );

  if (loading && docks.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray-600">Loading docks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="text-red-800">{error}</div>
        <button
          onClick={() => fetchDocks(true)}
          className="mt-2 rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // Statistics
  const activeDocks = docks.filter(d => d.is_active).length;
  const inboundDocks = docks.filter(d => d.dock_type === "Inbound").length;
  const outboundDocks = docks.filter(d => d.dock_type === "Outbound").length;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Dock Management
          </h2>
          <p className="text-sm text-gray-600">
            Manage loading docks and their configurations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <div className="rounded-lg bg-green-50 px-3 py-2">
              <div className="text-xs text-green-700">Active Docks</div>
              <div className="text-sm font-semibold text-green-900">
                {activeDocks}
              </div>
            </div>
            <div className="rounded-lg bg-blue-50 px-3 py-2">
              <div className="text-xs text-blue-700">Total Docks</div>
              <div className="text-sm font-semibold text-blue-900">{docks.length}</div>
            </div>
            <div className="rounded-lg bg-amber-50 px-3 py-2">
              <div className="text-xs text-amber-700">Inbound/Outbound</div>
              <div className="text-sm font-semibold text-amber-900">
                {inboundDocks}/{outboundDocks}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className={`flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 ${refreshing ? "opacity-50 cursor-not-allowed" : ""}`}
              title="Refresh"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
            <button
              type="button"
              onClick={handleAddDock}
              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Add Dock
            </button>
          </div>
        </div>
      </div>

      <FilterBar
        filters={filters}
        onFilterChange={onFilterChange}
        onApply={onApply}
        onReset={onReset}
      />

      <div className="mt-4 rounded-lg border border-gray-200 bg-white">
        {filteredRows.length > 0 ? (
          <CusTable columns={columns} data={filteredRows} />
        ) : (
          <div className="py-12 text-center">
            <Anchor className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              No docks found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your filters or add a new dock.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={handleAddDock}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Anchor className="-ml-0.5 mr-1.5 h-4 w-4 inline" />
                Add New Dock
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Component */}
      <AddEditDockModal
        isOpen={showModal}
        onClose={handleModalClose}
        selectedDock={selectedDock}
        isEditing={isEditing}
        warehouses={warehouses}
        warehousesLoading={warehousesLoading}
        onSuccess={handleModalSuccess}
      />

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-semibold">Confirm Delete</h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete dock{" "}
              <strong>{deleteConfirm.name}</strong>? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const dock = docks.find((d) => d.id === deleteConfirm.id);
                  if (dock) handleDeleteDock(dock);
                }}
                className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DockTab;