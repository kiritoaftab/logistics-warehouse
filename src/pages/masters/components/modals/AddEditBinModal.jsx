import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import http from "../../../../api/http";
import toast from "react-hot-toast";

const AddEditBinModal = ({
  isOpen,
  onClose,
  location,
  isEditing,
  warehouses,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    warehouse_id: warehouses.length > 0 ? warehouses[0].id : "",
    location_code: "",
    zone: "",
    aisle: "",
    rack: "",
    level: "",
    location_type: "STORAGE",
    capacity: 1000,
    is_pickable: true,
    is_putawayable: true,
  });

  useEffect(() => {
    if (warehouses.length > 0 && !formData.warehouse_id) {
      setFormData((prev) => ({
        ...prev,
        warehouse_id: warehouses[0].id,
      }));
    }
  }, [warehouses, formData.warehouse_id]);

  useEffect(() => {
    if (location && isEditing) {
      setFormData({
        warehouse_id:
          location.warehouse_id ||
          (warehouses.length > 0 ? warehouses[0].id : ""),
        location_code: location.location_code || "",
        zone: location.zone || "",
        aisle: location.aisle || "",
        rack: location.rack || "",
        level: location.level || "",
        location_type: location.location_type || "STORAGE",
        capacity: location.capacity || 1000,
        is_pickable: location.is_pickable ?? true,
        is_putawayable: location.is_putawayable ?? true,
      });
    } else {
      // Reset form for add mode
      setFormData({
        warehouse_id: warehouses.length > 0 ? warehouses[0].id : "",
        location_code: "",
        zone: "",
        aisle: "",
        rack: "",
        level: "",
        location_type: "STORAGE",
        capacity: 1000,
        is_pickable: true,
        is_putawayable: true,
      });
    }
    setError("");
  }, [location, isEditing, warehouses]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? "" : Number(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const savePromise = new Promise(async (resolve, reject) => {
      try {
        // Clean up empty strings for optional fields
        const payload = {
          ...formData,
          warehouse_id: Number(formData.warehouse_id),
          zone: formData.zone || null,
          aisle: formData.aisle || null,
          rack: formData.rack || null,
          level: formData.level || null,
          capacity: Number(formData.capacity),
        };

        if (isEditing && location) {
          // Remove warehouse_id from update payload if it shouldn't be changed
          const updatePayload = { ...payload };
          delete updatePayload.warehouse_id; // Usually warehouse can't be changed
          await http.put(`/locations/${location.id}`, updatePayload);
        } else {
          await http.post("/locations", payload);
        }
        resolve();
      } catch (err) {
        console.error("Error saving location:", err);
        reject(err);
      }
    });

    toast.promise(savePromise, {
      loading: isEditing ? "Updating location..." : "Creating location...",
      success: isEditing
        ? "Location updated successfully"
        : "Location created successfully",
      error: (err) =>
        err.response?.data?.message ||
        (isEditing ? "Failed to update location" : "Failed to create location"),
    });

    try {
      await savePromise;
      onClose(true); // Close and refresh
    } catch (err) {
      setError(
        err.response?.data?.message ||
          `Failed to ${isEditing ? "update" : "create"} location. Please try again.`,
      );
      setLoading(false);
    }
  };

  const locationTypeOptions = [
    { value: "STORAGE", label: "Storage" },
    { value: "RECEIVING", label: "Receiving" },
    { value: "SHIPPING", label: "Shipping" },
    { value: "DOCK", label: "Dock" },
    { value: "STAGING", label: "Staging" },
    { value: "QUARANTINE", label: "Quarantine" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl rounded-lg bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold">
            {isEditing ? "Edit Location" : "Add New Location"}
          </h2>
          <button
            onClick={() => onClose(false)}
            className="rounded-md p-1 hover:bg-gray-100"
            disabled={loading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="max-h-[70vh] overflow-y-auto p-6">
            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
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
                    disabled={isEditing}
                  >
                    {warehouses.map((warehouse) => (
                      <option key={warehouse.id} value={warehouse.id}>
                        {warehouse.warehouse_name} ({warehouse.warehouse_code})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Location Code *
                </label>
                <input
                  type="text"
                  name="location_code"
                  value={formData.location_code}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., B-01-01-01"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Zone
                </label>
                <input
                  type="text"
                  name="zone"
                  value={formData.zone}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., B"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Aisle
                </label>
                <input
                  type="text"
                  name="aisle"
                  value={formData.aisle}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., 01"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Rack
                </label>
                <input
                  type="text"
                  name="rack"
                  value={formData.rack}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., 01"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Level
                </label>
                <input
                  type="text"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., 01"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Location Type *
                </label>
                <select
                  name="location_type"
                  value={formData.location_type}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  required
                >
                  {locationTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Capacity *
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleNumberChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  min="1"
                  required
                />
              </div>

              <div className="col-span-2 grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_pickable"
                    name="is_pickable"
                    checked={formData.is_pickable}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="is_pickable"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Pickable
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_putawayable"
                    name="is_putawayable"
                    checked={formData.is_putawayable}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="is_putawayable"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Putawayable
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 px-6 py-4">
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => onClose(false)}
                disabled={loading}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Saving..." : isEditing ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditBinModal;
