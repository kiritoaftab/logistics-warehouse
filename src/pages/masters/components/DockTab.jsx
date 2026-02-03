import React, { useMemo, useState, useEffect, useCallback } from "react";
import FilterBar from "../../components/FilterBar";
import CusTable from "../../components/CusTable";
import { Pencil, Trash2, RefreshCw, Anchor, Eye, Plus } from "lucide-react";
import http from "../../../api/http";
import toast from "react-hot-toast";

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

  const dockTypes = ["INBOUND", "OUTBOUND", "MIXED"];
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

  const handleModalClose = (refresh = false) => {
    setShowModal(false);
    setSelectedDock(null);
    if (refresh) {
      fetchDocks(true);
    }
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
      INBOUND: "bg-green-100 text-green-700",
      OUTBOUND: "bg-blue-100 text-blue-700",
      MIXED: "bg-purple-100 text-purple-700",
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

  // Add/Edit Dock Modal
  const DockModal = () => {
    const [formData, setFormData] = useState({
      dock_name: "",
      dock_code: "",
      dock_type: "OUTBOUND",
      warehouse_id: warehouses.length > 0 ? warehouses[0].id : "",
      capacity: 5,
      is_active: true,
    });

    const [modalLoading, setModalLoading] = useState(false);
    const [modalError, setModalError] = useState("");

    useEffect(() => {
      if (selectedDock && isEditing) {
        setFormData({
          dock_name: selectedDock.dock_name,
          dock_code: selectedDock.dock_code,
          dock_type: selectedDock.dock_type,
          warehouse_id: selectedDock.warehouse_id,
          capacity: selectedDock.capacity,
          is_active: selectedDock.is_active,
        });
      } else if (warehouses.length > 0) {
        setFormData({
          dock_name: "",
          dock_code: "",
          dock_type: "OUTBOUND",
          warehouse_id: warehouses[0].id,
          capacity: 5,
          is_active: true,
        });
      }
      setModalError("");
    }, [selectedDock, isEditing, warehouses]);

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setModalLoading(true);
      setModalError("");

      try {
        let response;
        const payload = {
          ...formData,
          warehouse_id: parseInt(formData.warehouse_id),
          capacity: parseInt(formData.capacity),
        };

        if (isEditing && selectedDock) {
          response = await http.put(`/docks/${selectedDock.id}`, payload);
        } else {
          response = await http.post("/docks", payload);
        }

        if (response.data.success) {
          toast.success(
            isEditing
              ? "Dock updated successfully"
              : "Dock created successfully",
          );
          handleModalClose(true);
        } else {
          throw new Error(response.data.message || "Operation failed");
        }
      } catch (err) {
        console.error("Error saving dock:", err);
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          `Failed to ${isEditing ? "update" : "create"} dock. Please try again.`;
        setModalError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setModalLoading(false);
      }
    };

    if (!showModal) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="w-full max-w-2xl rounded-lg bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold">
              {isEditing ? "Edit Dock" : "Add New Dock"}
            </h2>
            <button
              onClick={() => handleModalClose(false)}
              className="rounded-md p-1 hover:bg-gray-100"
              disabled={modalLoading}
            >
              <Anchor className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="max-h-[70vh] overflow-y-auto p-6">
              {modalError && (
                <div className="mb-4 rounded-md bg-red-50 p-3">
                  <p className="text-sm text-red-800">{modalError}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Dock Name *
                  </label>
                  <input
                    type="text"
                    name="dock_name"
                    value={formData.dock_name}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="e.g., Dock A"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Dock Code *
                  </label>
                  <input
                    type="text"
                    name="dock_code"
                    value={formData.dock_code}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="e.g., DOCK001"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Dock Type *
                  </label>
                  <select
                    name="dock_type"
                    value={formData.dock_type}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    required
                  >
                    {dockTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Warehouse *
                  </label>
                  <select
                    name="warehouse_id"
                    value={formData.warehouse_id}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    required
                    disabled={warehousesLoading}
                  >
                    {warehouses.map((wh) => (
                      <option key={wh.id} value={wh.id}>
                        {wh.warehouse_name} ({wh.warehouse_code})
                      </option>
                    ))}
                  </select>
                  {warehousesLoading && (
                    <p className="mt-1 text-xs text-gray-500">
                      Loading warehouses...
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Capacity *
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="e.g., 5"
                    min="1"
                    max="20"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Maximum number of trucks
                  </p>
                </div>

                <div className="flex items-center pt-8">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="is_active"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Active Dock
                  </label>
                </div>
              </div>

              <div className="mt-6 rounded-lg bg-gray-50 p-4">
                <h3 className="mb-2 text-sm font-semibold text-gray-700">
                  Quick Actions
                </h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, dock_type: "INBOUND" }))
                    }
                    className="rounded-md bg-green-100 px-3 py-1 text-xs font-medium text-green-700 hover:bg-green-200"
                  >
                    Set as Inbound
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, dock_type: "OUTBOUND" }))
                    }
                    className="rounded-md bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-200"
                  >
                    Set as Outbound
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, is_active: !prev.is_active }))
                    }
                    className="rounded-md bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
                  >
                    Toggle Status
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, capacity: 5 }))
                    }
                    className="rounded-md bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700 hover:bg-purple-200"
                  >
                    Default Capacity (5)
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 px-6 py-4">
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => handleModalClose(false)}
                  disabled={modalLoading}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {modalLoading ? "Saving..." : isEditing ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };

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
  const inboundDocks = docks.filter(d => d.dock_type === "INBOUND").length;
  const outboundDocks = docks.filter(d => d.dock_type === "OUTBOUND").length;

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

      <DockModal />

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