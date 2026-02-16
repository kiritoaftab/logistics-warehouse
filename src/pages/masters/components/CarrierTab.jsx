import React, { useMemo, useState, useEffect, useCallback } from "react";
import FilterBar from "../../components/FilterBar";
import CusTable from "../../components/CusTable";
import Pagination from "../../components/Pagination";
import { Pencil, Trash2, RefreshCw, Truck, Eye, Plus } from "lucide-react";
import http from "../../../api/http";
import toast from "react-hot-toast";
import AddEditCarrierModal from "./modals/AddEditCarrierModal";
import { getUserRole } from "../../utils/authStorage";
import { useAccess } from "../../utils/useAccess";

const CarrierTab = () => {
  const [carriers, setCarriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCarrier, setSelectedCarrier] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 10
  });

  const [filtersState, setFiltersState] = useState({
    search: "",
    carrier_type: "All Types",
    status: "All Status",
  });

  const roleCode = getUserRole();
  const isAdmin = roleCode === "ADMIN";
  const access = useAccess("CARRIERS");
  const canCreate = isAdmin || access.canCreate;
  const canUpdate = isAdmin || access.canUpdate;
  const canDelete = isAdmin || access.canDelete;
  const showActionsColumn = canUpdate || canDelete;

  // Fetch carriers with pagination and filters
  const fetchCarriers = useCallback(async (showToast = false, page = pagination.page) => {
    try {
      setLoading(true);
      if (showToast) setRefreshing(true);
      setError(null);

      // Build query params
      const params = new URLSearchParams({
        page: page,
        limit: pagination.limit
      });

      // Add filters if they're not default
      if (filtersState.search) {
        params.append('search', filtersState.search);
      }
      if (filtersState.carrier_type !== "All Types") {
        params.append('carrier_type', filtersState.carrier_type);
      }
      if (filtersState.status !== "All Status") {
        params.append('is_active', filtersState.status === "Active" ? 'true' : 'false');
      }

      const response = await http.get(`/carriers/?${params.toString()}`);
      
      if (response.data.success) {
        setCarriers(response.data.data.carriers);
        setPagination(response.data.data.pagination);
        if (showToast) {
          toast.success("Carriers refreshed successfully");
        }
      } else {
        throw new Error("Failed to fetch carriers");
      }
    } catch (err) {
      console.error("Error fetching carriers:", err);
      const errorMsg = "Failed to load carriers. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
      if (showToast) setRefreshing(false);
    }
  }, [filtersState, pagination.limit]);

  // Initial fetch
  useEffect(() => {
    fetchCarriers();
  }, [fetchCarriers]);

  // Handle page change
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    fetchCarriers(false, newPage);
  };

  const carrierTypes = ["COURIER", "FREIGHT", "EXPRESS", "OCEAN", "AIR"];
  const statusOptions = ["All Status", "Active", "Inactive"];

  const filters = [
    {
      key: "search",
      type: "search",
      label: "Search",
      placeholder: "Search carrier name, code or contact...",
      value: filtersState.search,
      className: "w-[300px]",
    },
    {
      key: "carrier_type",
      label: "Carrier Type",
      value: filtersState.carrier_type,
      options: ["All Types", ...carrierTypes],
      className: "w-[200px]",
    },
    {
      key: "status",
      label: "Status",
      value: filtersState.status,
      options: statusOptions,
      className: "w-[180px]",
    },
  ];

  const onFilterChange = (key, val) => {
    setFiltersState((p) => ({ ...p, [key]: val }));
  };

  const onReset = () => {
    setFiltersState({
      search: "",
      carrier_type: "All Types",
      status: "All Status",
    });
    // Reset to page 1 and fetch
    setPagination(prev => ({ ...prev, page: 1 }));
    toast.success("Filters reset to default");
  };

  const onApply = () => {
    // Reset to page 1 and fetch with new filters
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchCarriers(true, 1);
    toast.success("Filters applied");
  };

  const handleAddCarrier = () => {
    setSelectedCarrier(null);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEditCarrier = (carrier) => {
    setSelectedCarrier(carrier);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleViewCarrier = (carrier) => {
    toast.success(`Viewing carrier ${carrier.carrier_name}`);
    // You can implement a detailed view modal here
  };

  const handleDeleteCarrier = async (carrier) => {
    if (!deleteConfirm || deleteConfirm.id !== carrier.id) {
      setDeleteConfirm({
        id: carrier.id,
        name: carrier.carrier_name,
      });
      return;
    }

    const deletePromise = new Promise(async (resolve, reject) => {
      try {
        await http.delete(`/carriers/${carrier.id}`);
        // If current page has only 1 item and it's not the first page, go to previous page
        if (carriers.length === 1 && pagination.page > 1) {
          const newPage = pagination.page - 1;
          setPagination(prev => ({ ...prev, page: newPage }));
          await fetchCarriers(true, newPage);
        } else {
          await fetchCarriers(true, pagination.page);
        }
        setDeleteConfirm(null);
        resolve();
      } catch (err) {
        console.error("Error deleting carrier:", err);
        setDeleteConfirm(null);
        reject(err);
      }
    });

    toast.promise(deletePromise, {
      loading: "Deleting carrier...",
      success: "Carrier deleted successfully",
      error: (err) =>
        `Failed to delete carrier: ${err.response?.data?.message || "Unknown error"}`,
    });
  };

  const handleRefresh = () => {
    fetchCarriers(true, pagination.page);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedCarrier(null);
  };

  const handleModalSuccess = () => {
    fetchCarriers(true, pagination.page);
  };

  const getCarrierTypeColor = (type) => {
    const typeColors = {
      COURIER: "bg-green-100 text-green-700",
      FREIGHT: "bg-blue-100 text-blue-700",
      EXPRESS: "bg-purple-100 text-purple-700",
      OCEAN: "bg-cyan-100 text-cyan-700",
      AIR: "bg-amber-100 text-amber-700",
    };
    return typeColors[type] || "bg-gray-100 text-gray-700";
  };

  const getStatusColor = (isActive) => {
    return isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
  };

  const columns = useMemo(
    () => [
      {
        key: "carrier_code",
        title: "Carrier Code",
        render: (row) => (
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-blue-500" />
            <span className="font-semibold text-blue-600">{row.carrier_code}</span>
          </div>
        ),
      },
      {
        key: "carrier_name",
        title: "Carrier Name",
        render: (row) => (
          <div className="text-sm">
            <div className="font-medium">{row.carrier_name}</div>
          </div>
        ),
      },
      {
        key: "carrier_type",
        title: "Type",
        render: (row) => (
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getCarrierTypeColor(row.carrier_type)}`}
          >
            {row.carrier_type}
          </span>
        ),
      },
      {
        key: "contact_person",
        title: "Contact Person",
        render: (row) => (
          <div className="text-sm">
            <div className="font-medium">{row.contact_person || "—"}</div>
            <div className="text-xs text-gray-500">{row.email || "—"}</div>
          </div>
        ),
      },
      {
        key: "phone",
        title: "Phone",
        render: (row) => (
          <div className="text-sm">
            <div>{row.phone || "—"}</div>
          </div>
        ),
      },
      {
        key: "account_no",
        title: "Account No.",
        render: (row) => (
          <div className="text-sm">
            <span className="font-mono">{row.account_no || "—"}</span>
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
        key: "updatedAt",
        title: "Last Updated",
        render: (row) => (
          <div className="text-sm">
            <div>{new Date(row.updatedAt).toLocaleDateString()}</div>
            <div className="text-xs text-gray-500">
              {new Date(row.updatedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        ),
      },
      ...(showActionsColumn
        ? [
            {
              key: "actions",
              title: "Actions",
              render: (row) => (
                <div className="flex items-center justify-start gap-1">
               
                  {canUpdate && (
                    <button
                      type="button"
                      className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
                      title="Edit"
                      onClick={() => handleEditCarrier(row)}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  )}
                  {canDelete && (
                    <button
                      type="button"
                      className={`rounded-md p-2 hover:bg-gray-100 ${
                        deleteConfirm?.id === row.id 
                          ? "text-white bg-red-600" 
                          : "text-red-600"
                      }`}
                      title={
                        deleteConfirm?.id === row.id
                          ? "Confirm Delete"
                          : "Delete"
                      }
                      onClick={() => handleDeleteCarrier(row)}
                    >
                      {deleteConfirm?.id === row.id ? (
                        <span className="text-xs font-medium">Confirm</span>
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </div>
              ),
            },
          ]
        : []),
    ],
    [deleteConfirm, canUpdate, canDelete, showActionsColumn]
  );

  if (loading && carriers.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray-600">Loading carriers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="text-red-800">{error}</div>
        <button
          onClick={() => fetchCarriers(true, pagination.page)}
          className="mt-2 rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // Statistics
  const activeCarriers = carriers.filter((c) => c.is_active).length;
  const courierCount = carriers.filter((c) => c.carrier_type === "COURIER").length;
  const freightCount = carriers.filter((c) => c.carrier_type === "FREIGHT").length;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Carrier Management
          </h2>
          <p className="text-sm text-gray-600">
            Manage carriers and their configurations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <div className="rounded-lg bg-green-50 px-3 py-2">
              <div className="text-xs text-green-700">Active Carriers</div>
              <div className="text-sm font-semibold text-green-900">
                {activeCarriers}
              </div>
            </div>
            <div className="rounded-lg bg-blue-50 px-3 py-2">
              <div className="text-xs text-blue-700">Total Carriers</div>
              <div className="text-sm font-semibold text-blue-900">
                {pagination.total}
              </div>
            </div>
            <div className="rounded-lg bg-amber-50 px-3 py-2">
              <div className="text-xs text-amber-700">Courier/Freight</div>
              <div className="text-sm font-semibold text-amber-900">
                {courierCount}/{freightCount}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className={`flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 ${
                refreshing ? "opacity-50 cursor-not-allowed" : ""
              }`}
              title="Refresh"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
            {canCreate && (
              <button
                type="button"
                onClick={handleAddCarrier}
                className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                Add Carrier
              </button>
            )}
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
        {carriers.length > 0 ? (
          <>
            <CusTable columns={columns} data={carriers} />
            {pagination.pages > 1 && (
              <Pagination
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            )}
          </>
        ) : (
          <div className="py-12 text-center">
            <Truck className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              No carriers found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your filters or add a new carrier.
            </p>
            {canCreate && (
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleAddCarrier}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <Truck className="-ml-0.5 mr-1.5 h-4 w-4 inline" />
                  Add New Carrier
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Component */}
      <AddEditCarrierModal
        isOpen={showModal}
        onClose={handleModalClose}
        selectedCarrier={selectedCarrier}
        isEditing={isEditing}
        onSuccess={handleModalSuccess}
      />

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-6 shadow-lg max-w-md w-full">
            <h3 className="mb-4 text-lg font-semibold">Confirm Delete</h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete carrier{" "}
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
                  const carrier = carriers.find((c) => c.id === deleteConfirm.id);
                  if (carrier) handleDeleteCarrier(carrier);
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

export default CarrierTab;