import React, { useMemo, useState, useEffect, useCallback } from "react";
import FilterBar from "../../components/FilterBar";
import CusTable from "../../components/CusTable";
import { Pencil, Trash2, RefreshCw, Package, Eye, Move } from "lucide-react";
import http from "../../../api/http";
import toast from "react-hot-toast";

const PalletTab = () => {
  const [pallets, setPallets] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [warehousesLoading, setWarehousesLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPallet, setSelectedPallet] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [filtersState, setFiltersState] = useState({
    search: "",
    pallet_type: "All Types",
    status: "All Status",
    is_mixed: "All",
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

  // Fetch pallets
  const fetchPallets = useCallback(async (showToast = false) => {
    try {
      setLoading(true);
      if (showToast) setRefreshing(true);
      setError(null);

      const response = await http.get("/pallets");
      if (response.data.success) {
        setPallets(response.data.data);
        if (showToast) {
          toast.success("Pallets refreshed successfully");
        }
      } else {
        throw new Error("Failed to fetch pallets");
      }
    } catch (err) {
      console.error("Error fetching pallets:", err);
      const errorMsg = "Failed to load pallets. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
      if (showToast) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPallets();
    fetchWarehouses();
  }, [fetchPallets, fetchWarehouses]);

  const palletTypes = ["STANDARD", "ECO", "PLASTIC", "WOODEN", "METAL"];
  // Updated to include EMPTY status from API
  const palletStatuses = [
    "IN_STORAGE",
    "IN_TRANSIT",
    "RESERVED",
    "DAMAGED",
    "AVAILABLE",
    "EMPTY",
  ];

  const filters = [
    {
      key: "search",
      type: "search",
      label: "Search",
      placeholder: "Search pallet ID...",
      value: filtersState.search,
      className: "w-[280px]",
    },
    {
      key: "pallet_type",
      label: "Pallet Type",
      value: filtersState.pallet_type,
      options: ["All Types", ...palletTypes],
      className: "w-[200px]",
    },
    {
      key: "status",
      label: "Status",
      value: filtersState.status,
      options: ["All Status", ...palletStatuses],
      className: "w-[200px]",
    },
    {
      key: "is_mixed",
      label: "Mixed",
      value: filtersState.is_mixed,
      options: ["All", "Mixed", "Not Mixed"],
      className: "w-[180px]",
    },
    {
      key: "warehouse_id",
      label: "Warehouse",
      value: filtersState.warehouse_id,
      options: [
        "All Warehouses",
        ...warehouses.map((wh) => ({
          label: `${wh.warehouse_name} (${wh.warehouse_code})`,
          value: wh.id,
        })),
      ],
      className: "w-[250px]",
    },
  ];

  const onFilterChange = (key, val) =>
    setFiltersState((p) => ({ ...p, [key]: val }));

  const onReset = () => {
    setFiltersState({
      search: "",
      pallet_type: "All Types",
      status: "All Status",
      is_mixed: "All",
      warehouse_id: "All Warehouses",
    });
    toast.success("Filters reset to default");
  };

  const onApply = () => {
    toast.success("Filters applied");
  };

  const handleAddPallet = () => {
    setSelectedPallet(null);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEditPallet = (pallet) => {
    setSelectedPallet(pallet);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleViewPallet = (pallet) => {
    toast.success(`Viewing pallet ${pallet.pallet_id}`);
    // You can implement a detailed view modal here
  };

  const handleMovePallet = (pallet) => {
    toast.success(`Moving pallet ${pallet.pallet_id}`);
    // Implement move pallet functionality
  };

  const handleDeletePallet = async (pallet) => {
    if (!deleteConfirm || deleteConfirm.id !== pallet.id) {
      setDeleteConfirm({
        id: pallet.id,
        code: pallet.pallet_id,
      });
      return;
    }

    const deletePromise = new Promise(async (resolve, reject) => {
      try {
        await http.delete(`/pallets/${pallet.id}`);
        setPallets((prev) => prev.filter((p) => p.id !== pallet.id));
        setDeleteConfirm(null);
        resolve();
      } catch (err) {
        console.error("Error deleting pallet:", err);
        setDeleteConfirm(null);
        reject(err);
      }
    });

    toast.promise(deletePromise, {
      loading: "Deleting pallet...",
      success: "Pallet deleted successfully",
      error: (err) =>
        `Failed to delete pallet: ${err.response?.data?.message || "Unknown error"}`,
    });
  };

  const handleRefresh = () => {
    fetchPallets(true);
  };

  const handleModalClose = (refresh = false) => {
    setShowModal(false);
    setSelectedPallet(null);
    if (refresh) {
      fetchPallets(true);
    }
  };

  const filteredRows = useMemo(() => {
    const q = (filtersState.search || "").toLowerCase().trim();

    return pallets.filter((pallet) => {
      const matchesSearch =
        !q ||
        `${pallet.pallet_id} ${pallet.warehouse?.warehouse_name || ""}`
          .toLowerCase()
          .includes(q);

      const matchesType =
        filtersState.pallet_type === "All Types" ||
        pallet.pallet_type === filtersState.pallet_type;

      const matchesStatus =
        filtersState.status === "All Status" ||
        pallet.status === filtersState.status;

      let matchesMixed = true;
      if (filtersState.is_mixed === "Mixed") {
        matchesMixed = pallet.is_mixed === true;
      } else if (filtersState.is_mixed === "Not Mixed") {
        matchesMixed = pallet.is_mixed === false;
      }

      const matchesWarehouse =
        filtersState.warehouse_id === "All Warehouses" ||
        pallet.warehouse_id === parseInt(filtersState.warehouse_id);

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus &&
        matchesMixed &&
        matchesWarehouse
      );
    });
  }, [pallets, filtersState]);

  const getStatusColor = (status) => {
    const statusColors = {
      IN_STORAGE: "bg-green-100 text-green-700",
      IN_TRANSIT: "bg-blue-100 text-blue-700",
      RESERVED: "bg-yellow-100 text-yellow-700",
      DAMAGED: "bg-red-100 text-red-700",
      AVAILABLE: "bg-gray-100 text-gray-700",
      EMPTY: "bg-gray-100 text-gray-700",
    };
    return statusColors[status] || "bg-gray-100 text-gray-700";
  };

  const getPalletTypeColor = (type) => {
    const typeColors = {
      STANDARD: "bg-blue-100 text-blue-700",
      ECO: "bg-green-100 text-green-700",
      PLASTIC: "bg-purple-100 text-purple-700",
      WOODEN: "bg-amber-100 text-amber-700",
      METAL: "bg-gray-100 text-gray-700",
    };
    return typeColors[type] || "bg-gray-100 text-gray-700";
  };

  const getLocationDisplay = (pallet) => {
    return pallet.current_location || "Not Assigned";
  };

  const columns = useMemo(
    () => [
      {
        key: "pallet_id",
        title: "Pallet ID",
        render: (row) => (
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-blue-500" />
            <span className="font-semibold text-blue-600">{row.pallet_id}</span>
          </div>
        ),
      },
      {
        key: "pallet_type",
        title: "Type",
        render: (row) => (
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getPalletTypeColor(row.pallet_type)}`}
          >
            {row.pallet_type}
          </span>
        ),
      },
      {
        key: "warehouse",
        title: "Warehouse",
        render: (row) => {
          const warehouse = warehouses.find((w) => w.id === row.warehouse_id);
          return (
            <div className="text-sm">
              <div className="font-medium">
                {warehouse?.warehouse_name || "Unknown"}
              </div>
              <div className="text-xs text-gray-500">
                {warehouse?.warehouse_code || ""}
              </div>
            </div>
          );
        },
      },
      {
        key: "current_location",
        title: "Current Location",
        render: (row) => (
          <span className="text-sm">{getLocationDisplay(row)}</span>
        ),
      },
      {
        key: "status",
        title: "Status",
        render: (row) => (
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(row.status)}`}
          >
            {row.status.replace("_", " ")}
          </span>
        ),
      },
      {
        key: "is_mixed",
        title: "Mixed",
        render: (row) => (
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${row.is_mixed ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"}`}
          >
            {row.is_mixed ? "Yes" : "No"}
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
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              className="rounded-md p-2 text-blue-600 hover:bg-blue-50"
              title="View Details"
              onClick={() => handleViewPallet(row)}
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="rounded-md p-2 text-green-600 hover:bg-green-50"
              title="Move Pallet"
              onClick={() => handleMovePallet(row)}
            >
              <Move className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
              title="Edit"
              onClick={() => handleEditPallet(row)}
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              className={`rounded-md p-2 hover:bg-gray-100 ${deleteConfirm?.id === row.id ? "text-white bg-red-600" : "text-red-600"}`}
              title={deleteConfirm?.id === row.id ? "Confirm Delete" : "Delete"}
              onClick={() => handleDeletePallet(row)}
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
    [deleteConfirm, warehouses],
  );

  // Add/Edit Pallet Modal
  const PalletModal = () => {
    const [formData, setFormData] = useState({
      pallet_id: "",
      pallet_type: "STANDARD",
      warehouse_id: warehouses.length > 0 ? warehouses[0].id : "",
      current_location: "",
      status: "EMPTY",
      is_mixed: false,
    });

    const [modalLoading, setModalLoading] = useState(false);
    const [modalError, setModalError] = useState("");

    useEffect(() => {
      if (selectedPallet && isEditing) {
        setFormData({
          pallet_id: selectedPallet.pallet_id,
          pallet_type: selectedPallet.pallet_type,
          warehouse_id: selectedPallet.warehouse_id,
          current_location: selectedPallet.current_location || "",
          status: selectedPallet.status,
          is_mixed: selectedPallet.is_mixed,
        });
      } else if (warehouses.length > 0) {
        setFormData({
          pallet_id: "",
          pallet_type: "STANDARD",
          warehouse_id: warehouses[0].id,
          current_location: "",
          status: "EMPTY",
          is_mixed: false,
        });
      }
      setModalError("");
    }, [selectedPallet, isEditing, warehouses]);

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
        // For create: use POST to /api/pallets
        // For update: use PUT to /api/pallets/{id}
        let response;

        if (isEditing && selectedPallet) {
          // For edit, only send current_location and status as per API docs
          const payload = {
            current_location: formData.current_location,
            status: formData.status,
          };
          response = await http.put(`/pallets/${selectedPallet.id}`, payload);
        } else {
          // For create, send all fields
          const payload = {
            ...formData,
            warehouse_id: parseInt(formData.warehouse_id),
            current_location: formData.current_location || null,
          };
          response = await http.post("/pallets", payload);
        }

        if (response.data.success) {
          toast.success(
            isEditing
              ? "Pallet updated successfully"
              : "Pallet created successfully",
          );
          handleModalClose(true);
        } else {
          throw new Error(response.data.message || "Operation failed");
        }
      } catch (err) {
        console.error("Error saving pallet:", err);
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          `Failed to ${isEditing ? "update" : "create"} pallet. Please try again.`;
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
              {isEditing ? "Edit Pallet" : "Add New Pallet"}
            </h2>
            <button
              onClick={() => handleModalClose(false)}
              className="rounded-md p-1 hover:bg-gray-100"
              disabled={modalLoading}
            >
              <Package className="h-5 w-5" />
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
                {!isEditing && (
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Pallet ID *
                    </label>
                    <input
                      type="text"
                      name="pallet_id"
                      value={formData.pallet_id}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      placeholder="e.g., P-00006"
                      required
                      disabled={isEditing}
                    />
                  </div>
                )}

                {!isEditing && (
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Pallet Type *
                    </label>
                    <select
                      name="pallet_type"
                      value={formData.pallet_type}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      required
                      disabled={isEditing}
                    >
                      {palletTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {!isEditing && (
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
                      disabled={isEditing || warehousesLoading}
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
                )}

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Status *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    required
                  >
                    {palletStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Current Location
                  </label>
                  <input
                    type="text"
                    name="current_location"
                    value={formData.current_location}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="e.g., ZONE-A-RACK-01"
                  />
                </div>

                {!isEditing && (
                  <div className="col-span-2 flex items-center pt-2">
                    <input
                      type="checkbox"
                      id="is_mixed"
                      name="is_mixed"
                      checked={formData.is_mixed}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      disabled={isEditing}
                    />
                    <label
                      htmlFor="is_mixed"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Mixed Pallet (Contains multiple SKUs)
                    </label>
                  </div>
                )}
              </div>

              <div className="mt-6 rounded-lg bg-gray-50 p-4">
                <h3 className="mb-2 text-sm font-semibold text-gray-700">
                  Quick Actions
                </h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, status: "IN_STORAGE" }))
                    }
                    className="rounded-md bg-green-100 px-3 py-1 text-xs font-medium text-green-700 hover:bg-green-200"
                  >
                    Mark as In Storage
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, status: "AVAILABLE" }))
                    }
                    className="rounded-md bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
                  >
                    Mark as Available
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, status: "EMPTY" }))
                    }
                    className="rounded-md bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-200"
                  >
                    Mark as Empty
                  </button>
                  {!isEditing && (
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          is_mixed: !prev.is_mixed,
                        }))
                      }
                      className="rounded-md bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700 hover:bg-purple-200"
                    >
                      Toggle Mixed
                    </button>
                  )}
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

  if (loading && pallets.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray-600">Loading pallets...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="text-red-800">{error}</div>
        <button
          onClick={() => fetchPallets(true)}
          className="mt-2 rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Pallet Management
          </h2>
          <p className="text-sm text-gray-600">
            Manage and track pallets in your warehouse
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <div className="rounded-lg bg-green-50 px-3 py-2">
              <div className="text-xs text-green-700">In Storage</div>
              <div className="text-sm font-semibold text-green-900">
                {pallets.filter((p) => p.status === "IN_STORAGE").length}
              </div>
            </div>
            <div className="rounded-lg bg-blue-50 px-3 py-2">
              <div className="text-xs text-blue-700">Total Pallets</div>
              <div className="text-sm font-semibold text-blue-900">
                {pallets.length}
              </div>
            </div>
            <div className="rounded-lg bg-purple-50 px-3 py-2">
              <div className="text-xs text-purple-700">Mixed</div>
              <div className="text-sm font-semibold text-purple-900">
                {pallets.filter((p) => p.is_mixed).length}
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
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
            <button
              type="button"
              onClick={handleAddPallet}
              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              <Package className="h-4 w-4" />+ Add Pallet
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
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              No pallets found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your filters or add a new pallet.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={handleAddPallet}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Package className="-ml-0.5 mr-1.5 h-4 w-4 inline" />
                Add New Pallet
              </button>
            </div>
          </div>
        )}
      </div>

      <PalletModal />

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-semibold">Confirm Delete</h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete pallet{" "}
              <strong>{deleteConfirm.code}</strong>? This action cannot be
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
                  const pallet = pallets.find((p) => p.id === deleteConfirm.id);
                  if (pallet) handleDeletePallet(pallet);
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

export default PalletTab;
