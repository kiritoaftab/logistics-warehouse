import React, { useMemo, useState, useEffect, useCallback } from "react";
import FilterBar from "../../components/FilterBar";
import CusTable from "../../components/CusTable";
import { Pencil, Lock, Trash2, RefreshCw } from "lucide-react";
import http from "../../../api/http";
import AddEditBinModal from "./modals/AddEditBinModal";

const LocationsBinsTab = () => {
  const [locations, setLocations] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [filtersState, setFiltersState] = useState({
    search: "",
    zone: "All Zones",
    type: "All Types",
    status: "All Status",
    warehouse_id: "All Warehouses",
  });

  // Fetch warehouses
  const fetchWarehouses = useCallback(async () => {
    try {
      const response = await http.get("/warehouses");
      if (response.data.success) {
        setWarehouses(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching warehouses:", err);
    }
  }, []);

  // Fetch locations
  const fetchLocations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await http.get("/locations");
      if (response.data.success) {
        setLocations(response.data.data.locations);
      } else {
        throw new Error("Failed to fetch locations");
      }
    } catch (err) {
      console.error("Error fetching locations:", err);
      setError("Failed to load locations. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWarehouses();
    fetchLocations();
  }, [fetchWarehouses, fetchLocations]);

  // Update filters with dynamic options
  const filters = [
    {
      key: "search",
      type: "search",
      label: "Search",
      placeholder: "Search location code...",
      value: filtersState.search,
      className: "w-[280px]",
    },
    {
      key: "warehouse_id",
      label: "Warehouse",
      value: filtersState.warehouse_id,
      options: [
        "All Warehouses",
        ...warehouses.map((w) => ({
          label: w.warehouse_name,
          value: w.id,
        })),
      ],
      className: "w-[220px]",
    },
    {
      key: "zone",
      label: "Zone",
      value: filtersState.zone,
      options: [
        "All Zones",
        ...Array.from(
          new Set(locations.map((l) => l.zone).filter(Boolean)),
        ).sort(),
      ],
      className: "w-[220px]",
    },
    {
      key: "type",
      label: "Type",
      value: filtersState.type,
      options: [
        "All Types",
        ...Array.from(
          new Set(locations.map((l) => l.location_type).filter(Boolean)),
        ).sort(),
      ],
      className: "w-[220px]",
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
      warehouse_id: "All Warehouses",
      zone: "All Zones",
      type: "All Types",
      status: "All Status",
    });

  const onApply = () => {}; // UI only

  const handleAddBin = () => {
    setSelectedLocation(null);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEditBin = (location) => {
    setSelectedLocation(location);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleToggleStatus = async (location) => {
    try {
      const newStatus = !location.is_active;
      // You'll need an API endpoint for updating status
      // For now, we'll just update locally
      setLocations((prev) =>
        prev.map((loc) =>
          loc.id === location.id ? { ...loc, is_active: newStatus } : loc,
        ),
      );
    } catch (err) {
      console.error("Error toggling status:", err);
      setError("Failed to update location status");
    }
  };

  const handleDeleteBin = async (location) => {
    if (!deleteConfirm || deleteConfirm.id !== location.id) {
      setDeleteConfirm({
        id: location.id,
        code: location.location_code,
      });
      return;
    }

    try {
      await http.delete(`/locations/${location.id}`);
      setLocations((prev) => prev.filter((loc) => loc.id !== location.id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error("Error deleting location:", err);
      setError("Failed to delete location");
      setDeleteConfirm(null);
    }
  };

  const handleRefresh = () => {
    fetchLocations();
  };

  const handleModalClose = (refresh = false) => {
    setShowModal(false);
    setSelectedLocation(null);
    if (refresh) {
      fetchLocations();
    }
  };

  const filteredRows = useMemo(() => {
    const q = (filtersState.search || "").toLowerCase().trim();

    return locations.filter((location) => {
      const matchesSearch =
        !q ||
        `${location.location_code} ${location.zone || ""} ${location.location_type || ""}`
          .toLowerCase()
          .includes(q);

      const matchesWarehouse =
        filtersState.warehouse_id === "All Warehouses" ||
        location.warehouse_id.toString() === filtersState.warehouse_id;

      const matchesZone =
        filtersState.zone === "All Zones" ||
        location.zone === filtersState.zone ||
        (!location.zone && filtersState.zone === "All Zones");

      const matchesType =
        filtersState.type === "All Types" ||
        location.location_type === filtersState.type;

      const statusText = location.is_active ? "Active" : "Inactive";
      const matchesStatus =
        filtersState.status === "All Status" ||
        statusText === filtersState.status;

      return (
        matchesSearch &&
        matchesWarehouse &&
        matchesZone &&
        matchesType &&
        matchesStatus
      );
    });
  }, [locations, filtersState]);

  const UtilBar = ({ pct }) => (
    <div className="flex items-center gap-2">
      <div className="h-2 w-[110px] overflow-hidden rounded-full bg-blue-100">
        <div
          className="h-full rounded-full bg-blue-600"
          style={{ width: `${Math.max(0, Math.min(100, pct || 0))}%` }}
        />
      </div>
      <span className="text-xs text-gray-600">{pct || 0}%</span>
    </div>
  );

  const getLocationTypeDisplay = (type) => {
    const typeMap = {
      STORAGE: "Storage",
      RECEIVING: "Receiving",
      SHIPPING: "Shipping",
      DOCK: "Dock",
      STAGING: "Staging",
      QUARANTINE: "Quarantine",
      PICKING: "Picking",
    };
    return typeMap[type] || type;
  };

  const getCapacityDisplay = (capacity, currentUsage, locationType) => {
    if (
      locationType === "RECEIVING" ||
      locationType === "SHIPPING" ||
      locationType === "DOCK"
    ) {
      return "N/A";
    }
    return `${currentUsage || 0} / ${capacity} units`;
  };

  const getWarehouseName = (warehouseId) => {
    const warehouse = warehouses.find((w) => w.id === warehouseId);
    return warehouse ? warehouse.warehouse_name : "Unknown";
  };

  const columns = useMemo(
    () => [
      {
        key: "warehouse",
        title: "Warehouse",
        render: (row) => getWarehouseName(row.warehouse_id),
      },
      {
        key: "zone",
        title: "Zone",
        render: (row) => row.zone || "-",
      },
      {
        key: "location_code",
        title: "Location Code",
        render: (row) => (
          <span className="text-sm font-semibold text-blue-600">
            {row.location_code}
          </span>
        ),
      },
      {
        key: "location_type",
        title: "Type",
        render: (row) => getLocationTypeDisplay(row.location_type),
      },
      {
        key: "capacity",
        title: "Capacity",
        render: (row) =>
          getCapacityDisplay(
            row.capacity,
            row.current_usage,
            row.location_type,
          ),
      },
      {
        key: "utilization",
        title: "Utilization",
        render: (row) => <UtilBar pct={row.utilization_percent} />,
      },
      {
        key: "is_pickable",
        title: "Pickable",
        render: (row) => (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${row.is_pickable ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
          >
            {row.is_pickable ? "Yes" : "No"}
          </span>
        ),
      },
      {
        key: "is_putawayable",
        title: "Putawayable",
        render: (row) => (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${row.is_putawayable ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
          >
            {row.is_putawayable ? "Yes" : "No"}
          </span>
        ),
      },
      {
        key: "status",
        title: "Status",
        render: (row) => {
          const isActive = row.is_active;
          return (
            <span
              className={[
                "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold",
                isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700",
              ].join(" ")}
            >
              {isActive ? "Active" : "Inactive"}
            </span>
          );
        },
      },
      {
        key: "actions",
        title: "Actions",
        render: (row) => (
          <div className="flex items-center justify-start gap-2">
            <button
              type="button"
              className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
              title="Edit"
              onClick={() => handleEditBin(row)}
            >
              <Pencil className="h-4 w-4" />
            </button>
            {/* <button
              type="button"
              className={`rounded-md p-2 hover:bg-gray-100 ${row.is_active ? "text-yellow-600" : "text-green-600"}`}
              title={row.is_active ? "Deactivate" : "Activate"}
              onClick={() => handleToggleStatus(row)}
            >
              <Lock className="h-4 w-4" />
            </button> */}
            <button
              type="button"
              className={`rounded-md p-2 hover:bg-gray-100 ${deleteConfirm?.id === row.id ? "text-white bg-red-600" : "text-red-600"}`}
              title={deleteConfirm?.id === row.id ? "Confirm Delete" : "Delete"}
              onClick={() => handleDeleteBin(row)}
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
    [warehouses, deleteConfirm],
  );

  if (loading && locations.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray-600">Loading locations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="text-red-800">{error}</div>
        <button
          onClick={fetchLocations}
          className="mt-2 rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {filteredRows.length} of {locations.length} locations
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRefresh}
            className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button
            type="button"
            onClick={handleAddBin}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            + Add Location
          </button>
        </div>
      </div>

      <FilterBar
        filters={filters}
        onFilterChange={onFilterChange}
        onApply={onApply}
        onReset={onReset}
      />

      <div className="rounded-lg border border-gray-200 bg-white p-2">
        {filteredRows.length > 0 ? (
          <CusTable columns={columns} data={filteredRows} />
        ) : (
          <div className="py-8 text-center text-gray-600">
            No locations found. Try adjusting your filters or add a new
            location.
          </div>
        )}
      </div>

      {showModal && (
        <AddEditBinModal
          isOpen={showModal}
          onClose={handleModalClose}
          location={selectedLocation}
          isEditing={isEditing}
          warehouses={warehouses}
        />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-semibold">Confirm Delete</h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete location{" "}
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
                  const location = locations.find(
                    (l) => l.id === deleteConfirm.id,
                  );
                  if (location) handleDeleteBin(location);
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

export default LocationsBinsTab;
