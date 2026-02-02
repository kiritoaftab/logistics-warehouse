// WarehouseTab.jsx
import React, { useState, useEffect } from "react";
import FilterBar from "../../components/FilterBar";
import CusTable from "../../components/CusTable";
import http from "../../../api/http";
import AddWarehouseModal from "./AddWarehouseModal";
import EditWarehouseModal from "./EditWarehouseModal";
// import ViewWarehouseModal from "./ViewWarehouseModal";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Building,
  MapPin,
  Calendar,
  Search,
  RefreshCw,
} from "lucide-react";

// ViewWarehouseModal component
const ViewWarehouseModal = ({
  isOpen,
  onClose,
  warehouse,
  onDeleteSuccess,
}) => {
  const [deleting, setDeleting] = useState(false);

  if (!isOpen || !warehouse) return null;

  const handleDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete warehouse "${warehouse.warehouse_name}"? This action cannot be undone.`,
      )
    )
      return;

    setDeleting(true);
    try {
      const response = await http.delete(`/warehouses/${warehouse.id}`);
      if (response.data.success) {
        onDeleteSuccess?.();
        onClose();
        alert("Warehouse deleted successfully!");
      } else {
        throw new Error(response.data.message || "Failed to delete warehouse");
      }
    } catch (error) {
      console.error("Error deleting warehouse:", error);
      alert(
        error.response?.data?.message ||
          "Error deleting warehouse. Please try again.",
      );
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <Building className="h-5 w-5 text-blue-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Warehouse Details
              </h2>
              <p className="text-xs text-gray-500">
                ID: {warehouse.warehouse_code}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 hover:bg-gray-100"
          >
            <span className="text-2xl text-gray-400">&times;</span>
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-700">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-gray-500">Warehouse Name</p>
                  <p className="font-medium text-gray-900">
                    {warehouse.warehouse_name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Warehouse Code</p>
                  <p className="font-medium text-gray-900">
                    {warehouse.warehouse_code}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                      warehouse.is_active
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {warehouse.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-700">
                Address
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <p className="text-xs text-gray-500">Full Address</p>
                  <p className="font-medium text-gray-900">
                    {warehouse.address}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">City</p>
                  <p className="font-medium text-gray-900">{warehouse.city}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">State</p>
                  <p className="font-medium text-gray-900">{warehouse.state}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Country</p>
                  <p className="font-medium text-gray-900">
                    {warehouse.country}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Pincode</p>
                  <p className="font-medium text-gray-900">
                    {warehouse.pincode}
                  </p>
                </div>
              </div>
            </div>

            {/* Configuration */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-700">
                Configuration
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-gray-500">Capacity</p>
                  <p className="font-medium text-gray-900">
                    {warehouse.capacity_sqft?.toLocaleString()} sq. ft.
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Timezone</p>
                  <p className="font-medium text-gray-900">
                    {warehouse.timezone}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Warehouse Type</p>
                  <p className="font-medium text-gray-900">
                    {warehouse.warehouse_type?.replace(/_/g, " ")}
                  </p>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-700">
                Timestamps
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-gray-500">Created At</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(warehouse.created_at)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Updated At</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(warehouse.updated_at)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 border-t border-gray-200 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              {deleting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Delete Warehouse
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const WarehouseTab = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    status: "All Statuses",
    city: "All Cities",
  });

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

  // Fetch warehouses on component mount
  const fetchWarehouses = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await http.get("/warehouses");
      if (response.data.success) {
        setWarehouses(response.data.data || []);
      } else {
        throw new Error("Failed to fetch warehouses");
      }
    } catch (err) {
      console.error("Error fetching warehouses:", err);
      setError(err.response?.data?.message || "Failed to load warehouses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Apply filters
  const handleApplyFilters = () => {
    console.log("Applying filters:", filters);
    // In a real app, you would make an API call with filters
    // For now, we'll just refetch
    fetchWarehouses();
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      search: "",
      status: "All Statuses",
      city: "All Cities",
    });
    fetchWarehouses();
  };

  // Open modals
  const openAddModal = () => {
    setAddModalOpen(true);
  };

  const openEditModal = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setEditModalOpen(true);
  };

  const openViewModal = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setViewModalOpen(true);
  };

  const closeModals = () => {
    setAddModalOpen(false);
    setEditModalOpen(false);
    setViewModalOpen(false);
    setSelectedWarehouse(null);
  };

  // Handle successful CRUD operation
  const handleOperationSuccess = () => {
    fetchWarehouses(); // Refresh the list
  };

  // Handle delete success
  const handleDeleteSuccess = () => {
    fetchWarehouses(); // Refresh the list
  };

  // Handle direct delete from table
  const handleDirectDelete = async (warehouse) => {
    if (
      !confirm(
        `Are you sure you want to delete warehouse "${warehouse.warehouse_name}"? This action cannot be undone.`,
      )
    )
      return;

    try {
      const response = await http.delete(`/warehouses/${warehouse.id}`);
      if (response.data.success) {
        fetchWarehouses(); // Refresh the list
        alert("Warehouse deleted successfully!");
      } else {
        throw new Error(response.data.message || "Failed to delete warehouse");
      }
    } catch (error) {
      console.error("Error deleting warehouse:", error);
      alert(
        error.response?.data?.message ||
          "Error deleting warehouse. Please try again.",
      );
    }
  };

  // Prepare filter options
  const statusOptions = ["All Statuses", "Active", "Inactive"];
  const cityOptions = [
    "All Cities",
    ...new Set(warehouses.map((w) => w.city).filter(Boolean)),
  ];

  // Filter warehouses based on current filters
  const filteredWarehouses = warehouses.filter((warehouse) => {
    const matchesSearch =
      !filters.search ||
      warehouse.warehouse_name
        .toLowerCase()
        .includes(filters.search.toLowerCase()) ||
      warehouse.warehouse_code
        .toLowerCase()
        .includes(filters.search.toLowerCase()) ||
      warehouse.city.toLowerCase().includes(filters.search.toLowerCase()) ||
      warehouse.state.toLowerCase().includes(filters.search.toLowerCase());

    const matchesStatus =
      filters.status === "All Statuses" ||
      (filters.status === "Active" && warehouse.is_active) ||
      (filters.status === "Inactive" && !warehouse.is_active);

    const matchesCity =
      filters.city === "All Cities" || warehouse.city === filters.city;

    return matchesSearch && matchesStatus && matchesCity;
  });

  // Table columns configuration
  const columns = [
    {
      key: "warehouse_code",
      title: "Warehouse Code",
      render: (row) => (
        <div className="font-medium text-gray-900">{row.warehouse_code}</div>
      ),
    },
    {
      key: "warehouse_name",
      title: "Warehouse Name",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-gray-400" />
          <span>{row.warehouse_name}</span>
        </div>
      ),
    },
    {
      key: "location",
      title: "Location",
      render: (row) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span>
            {row.city}, {row.state}
          </span>
        </div>
      ),
    },
    {
      key: "type",
      title: "Type",
      render: (row) => (
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
          {row.warehouse_type?.replace(/_/g, " ") || "GENERAL"}
        </span>
      ),
    },
    {
      key: "capacity",
      title: "Capacity",
      render: (row) => (
        <div className="text-sm text-gray-600">
          {row.capacity_sqft?.toLocaleString() || 0} sq. ft.
        </div>
      ),
    },
    {
      key: "status",
      title: "Status",
      render: (row) => (
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
            row.is_active
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {row.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          {/* <button
            onClick={() => openViewModal(row)}
            className="rounded-md p-1.5 hover:bg-gray-100"
            title="View Details"
          >
            <Eye className="h-4 w-4 text-gray-500" />
          </button> */}
          <button
            onClick={() => openEditModal(row)}
            className="rounded-md p-1.5 hover:bg-gray-100"
            title="Edit"
          >
            <Edit2 className="h-4 w-4 text-blue-500" />
          </button>
          <button
            onClick={() => handleDirectDelete(row)}
            className="rounded-md p-1.5 hover:bg-gray-100"
            title="Delete"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Warehouses</h1>
          <p className="text-sm text-gray-600">
            Manage your warehouse locations and details
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* <button
            onClick={fetchWarehouses}
            className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button> */}
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Warehouse
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        filters={[
          {
            type: "search",
            key: "search",
            label: "Search",
            placeholder: "Search by name, code, city, or state...",
            value: filters.search,
            icon: <Search className="h-4 w-4" />,
          },
          {
            type: "select",
            key: "status",
            label: "Status",
            value: filters.status,
            options: statusOptions,
          },
          {
            type: "select",
            key: "city",
            label: "City",
            value: filters.city,
            options: cityOptions,
          },
        ]}
        showActions={true}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        onApply={handleApplyFilters}
      />

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white py-12">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-2 text-sm text-gray-500">Loading warehouses...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading warehouses
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <button
                onClick={fetchWarehouses}
                className="mt-3 rounded-md bg-red-100 px-3 py-1.5 text-sm font-medium text-red-800 hover:bg-red-200"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading &&
        !error &&
        filteredWarehouses.length === 0 &&
        warehouses.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white py-12">
            <Building className="h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-sm font-semibold text-gray-900">
              No warehouses found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first warehouse.
            </p>
            <button
              onClick={openAddModal}
              className="mt-4 flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Add Warehouse
            </button>
          </div>
        )}

      {/* No Results State */}
      {!loading &&
        !error &&
        warehouses.length > 0 &&
        filteredWarehouses.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white py-12">
            <Search className="h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-sm font-semibold text-gray-900">
              No matching warehouses
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your filters to find what you're looking for.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Reset Filters
            </button>
          </div>
        )}

      {/* Data Table */}
      {!loading && !error && filteredWarehouses.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-sm font-semibold text-gray-900">
                All Warehouses ({filteredWarehouses.length})
              </h3>
              <div className="text-xs text-gray-500">
                Showing {filteredWarehouses.length} of {warehouses.length}{" "}
                warehouses
              </div>
            </div>
          </div>
          <CusTable columns={columns} data={filteredWarehouses} />

          {/* Pagination or additional info could go here */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div>Page 1 of 1</div>
              <div className="flex items-center gap-2">
                <button
                  className="rounded-md border border-gray-300 px-3 py-1 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled
                >
                  Previous
                </button>
                <button
                  className="rounded-md border border-gray-300 px-3 py-1 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Warehouse Modal */}
      <AddWarehouseModal
        isOpen={addModalOpen}
        onClose={closeModals}
        onSuccess={handleOperationSuccess}
      />

      {/* Edit Warehouse Modal */}
      {selectedWarehouse && (
        <EditWarehouseModal
          isOpen={editModalOpen}
          onClose={closeModals}
          warehouse={selectedWarehouse}
          onSuccess={handleOperationSuccess}
        />
      )}

      {/* View Warehouse Modal */}
      {/* {selectedWarehouse && (
        <ViewWarehouseModal
          isOpen={viewModalOpen}
          onClose={closeModals}
          warehouse={selectedWarehouse}
          onDeleteSuccess={handleDeleteSuccess}
        />
      )} */}
    </div>
  );
};

export default WarehouseTab;
