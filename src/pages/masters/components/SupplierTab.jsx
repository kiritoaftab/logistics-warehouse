// SupplierTab.jsx
import React, { useState, useEffect } from "react";
import FilterBar from "../../components/FilterBar";
import CusTable from "../../components/CusTable";
import http from "../../../api/http";
import AddSupplierModal from "./AddSupplierModal";
import EditSupplierModal from "./EditSupplierModal";
// import ViewSupplierModal from "./ViewSupplierModal";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  User,
  Phone,
  Mail,
  Building,
  Search,
  RefreshCw,
} from "lucide-react";

const SupplierTab = () => {
  const [suppliers, setSuppliers] = useState([]);
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
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  // Fetch suppliers on component mount
  const fetchSuppliers = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await http.get(
        `/suppliers?page=${page}&limit=${pagination.limit}`,
      );
      if (response.data.success) {
        setSuppliers(response.data.data.suppliers || []);
        setPagination(
          response.data.data.pagination || {
            page: 1,
            limit: 10,
            total: 0,
            pages: 0,
          },
        );
      } else {
        throw new Error("Failed to fetch suppliers");
      }
    } catch (err) {
      console.error("Error fetching suppliers:", err);
      setError(err.response?.data?.message || "Failed to load suppliers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Apply filters
  const handleApplyFilters = () => {
    console.log("Applying filters:", filters);
    fetchSuppliers(1);
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      search: "",
      status: "All Statuses",
      city: "All Cities",
    });
    fetchSuppliers(1);
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      fetchSuppliers(newPage);
    }
  };

  // Open modals
  const openAddModal = () => {
    setAddModalOpen(true);
  };

  const openEditModal = (supplier) => {
    setSelectedSupplier(supplier);
    setEditModalOpen(true);
  };

  const openViewModal = (supplier) => {
    setSelectedSupplier(supplier);
    setViewModalOpen(true);
  };

  const closeModals = () => {
    setAddModalOpen(false);
    setEditModalOpen(false);
    setViewModalOpen(false);
    setSelectedSupplier(null);
  };

  // Handle successful CRUD operation
  const handleOperationSuccess = () => {
    fetchSuppliers(pagination.page); // Refresh the current page
  };

  // Handle delete success
  const handleDeleteSuccess = () => {
    fetchSuppliers(pagination.page); // Refresh the current page
  };

  // Handle direct delete from table
  const handleDirectDelete = async (supplier) => {
    if (
      !confirm(
        `Are you sure you want to delete supplier "${supplier.supplier_name}"? This action cannot be undone.`,
      )
    )
      return;

    try {
      const response = await http.delete(`/suppliers/${supplier.id}`);
      if (response.data.success) {
        fetchSuppliers(pagination.page); // Refresh the current page
        alert("Supplier deleted successfully!");
      } else {
        throw new Error(response.data.message || "Failed to delete supplier");
      }
    } catch (error) {
      console.error("Error deleting supplier:", error);
      alert(
        error.response?.data?.message ||
          "Error deleting supplier. Please try again.",
      );
    }
  };

  // Prepare filter options
  const statusOptions = ["All Statuses", "Active", "Inactive"];
  const cityOptions = [
    "All Cities",
    ...new Set(suppliers.map((s) => s.city).filter(Boolean)),
  ];

  // Filter suppliers based on current filters
  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      !filters.search ||
      supplier.supplier_name
        .toLowerCase()
        .includes(filters.search.toLowerCase()) ||
      supplier.supplier_code
        .toLowerCase()
        .includes(filters.search.toLowerCase()) ||
      supplier.contact_person
        ?.toLowerCase()
        .includes(filters.search.toLowerCase()) ||
      supplier.email?.toLowerCase().includes(filters.search.toLowerCase()) ||
      supplier.city?.toLowerCase().includes(filters.search.toLowerCase());

    const matchesStatus =
      filters.status === "All Statuses" ||
      (filters.status === "Active" && supplier.is_active) ||
      (filters.status === "Inactive" && !supplier.is_active);

    const matchesCity =
      filters.city === "All Cities" || supplier.city === filters.city;

    return matchesSearch && matchesStatus && matchesCity;
  });

  // Table columns configuration
  const columns = [
    {
      key: "supplier_code",
      title: "Supplier Code",
      render: (row) => (
        <div className="font-medium text-gray-900">{row.supplier_code}</div>
      ),
    },
    {
      key: "supplier_name",
      title: "Supplier Name",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-gray-400" />
          <span>{row.supplier_name}</span>
        </div>
      ),
    },
    {
      key: "contact_info",
      title: "Contact Info",
      render: (row) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm">
            <User className="h-3 w-3 text-gray-400" />
            <span>{row.contact_person || "N/A"}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Phone className="h-3 w-3" />
            <span>{row.phone || "N/A"}</span>
          </div>
        </div>
      ),
    },
    {
      key: "location",
      title: "Location",
      render: (row) => (
        <div className="text-sm text-gray-600">
          {row.city || "N/A"}, {row.state || "N/A"}
        </div>
      ),
    },
    {
      key: "payment_terms",
      title: "Payment Terms",
      render: (row) => (
        <div className="text-sm text-gray-600">
          {row.payment_terms || "N/A"}
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
          <h1 className="text-2xl font-semibold text-gray-800">Suppliers</h1>
          <p className="text-sm text-gray-600">
            Manage your supplier information and details
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* <button
            onClick={() => fetchSuppliers(pagination.page)}
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
            Add Supplier
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
            placeholder: "Search by name, code, contact, email, or city...",
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
            <p className="mt-2 text-sm text-gray-500">Loading suppliers...</p>
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
                Error loading suppliers
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <button
                onClick={() => fetchSuppliers(pagination.page)}
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
        filteredSuppliers.length === 0 &&
        suppliers.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white py-12">
            <User className="h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-sm font-semibold text-gray-900">
              No suppliers found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first supplier.
            </p>
            <button
              onClick={openAddModal}
              className="mt-4 flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Add Supplier
            </button>
          </div>
        )}

      {/* No Results State */}
      {!loading &&
        !error &&
        suppliers.length > 0 &&
        filteredSuppliers.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white py-12">
            <Search className="h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-sm font-semibold text-gray-900">
              No matching suppliers
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
      {!loading && !error && filteredSuppliers.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-sm font-semibold text-gray-900">
                All Suppliers ({filteredSuppliers.length})
              </h3>
              <div className="text-xs text-gray-500">
                Showing {filteredSuppliers.length} of {pagination.total}{" "}
                suppliers
              </div>
            </div>
          </div>
          <CusTable columns={columns} data={filteredSuppliers} />

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div>
                Page {pagination.page} of {pagination.pages}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="rounded-md border border-gray-300 px-3 py-1 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.pages}
                  className="rounded-md border border-gray-300 px-3 py-1 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <AddSupplierModal
        isOpen={addModalOpen}
        onClose={closeModals}
        onSuccess={handleOperationSuccess}
      />

      {/* Edit Supplier Modal */}
      {selectedSupplier && (
        <EditSupplierModal
          isOpen={editModalOpen}
          onClose={closeModals}
          supplier={selectedSupplier}
          onSuccess={handleOperationSuccess}
        />
      )}

      {/* View Supplier Modal */}
      {/* {selectedSupplier && (
        <ViewSupplierModal
          isOpen={viewModalOpen}
          onClose={closeModals}
          supplier={selectedSupplier}
          onDeleteSuccess={handleDeleteSuccess}
        />
      )} */}
    </div>
  );
};

export default SupplierTab;
