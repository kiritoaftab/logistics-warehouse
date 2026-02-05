import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import http from "../../../../api/http";
import toast from "react-hot-toast";

const AddEditDockModal = ({ 
  isOpen, 
  onClose, 
  selectedDock, 
  isEditing, 
  warehouses = [],
  warehousesLoading = false,
  onSuccess 
}) => {
  const [formData, setFormData] = useState({
    warehouse_id: "",
    dock_name: "",
    dock_code: "",
    dock_type: "Outbound",
    capacity: 5,
    is_active: true,
  });

  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  // Dock type options
  const dockTypes = ["Inbound", "Outbound", "Mixed"];

  useEffect(() => {
    if (selectedDock && isEditing) {
      setFormData({
        warehouse_id: selectedDock.warehouse_id,
        dock_name: selectedDock.dock_name,
        dock_code: selectedDock.dock_code,
        dock_type: selectedDock.dock_type,
        capacity: selectedDock.capacity,
        is_active: selectedDock.is_active,
      });
    } else if (warehouses.length > 0) {
      setFormData({
        warehouse_id: warehouses[0].id,
        dock_name: "",
        dock_code: "",
        dock_type: "Outbound",
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
        warehouse_id: parseInt(formData.warehouse_id),
        dock_name: formData.dock_name,
        dock_code: formData.dock_code,
        dock_type: formData.dock_type,
        capacity: parseInt(formData.capacity),
        is_active: formData.is_active,
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
        onSuccess();
        onClose();
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditing ? "Edit Dock" : "Add New Dock"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            disabled={modalLoading}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="max-h-[70vh] overflow-y-auto p-6">
            {modalError && (
              <div className="mb-4 rounded-md bg-red-50 p-3">
                <p className="text-sm text-red-800">{modalError}</p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Dock Name *
                  </label>
                  <input
                    type="text"
                    name="dock_name"
                    value={formData.dock_name}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g., Dock A"
                    required
                    disabled={modalLoading}
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
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g., DOCK001"
                    required
                    disabled={modalLoading}
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
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                    disabled={modalLoading}
                  >
                    {dockTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Warehouse *
                  </label>
                  <select
                    name="warehouse_id"
                    value={formData.warehouse_id}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                    disabled={modalLoading || warehousesLoading}
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
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g., 5"
                    min="1"
                    max="20"
                    required
                    disabled={modalLoading}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Maximum number of trucks
                  </p>
                </div>

                <div className="flex items-center pt-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={modalLoading}
                  />
                  <label
                    htmlFor="is_active"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Active Dock
                  </label>
                </div>
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
                    setFormData((prev) => ({ ...prev, dock_type: "Inbound" }))
                  }
                  className="rounded-md bg-green-100 px-3 py-1 text-xs font-medium text-green-700 hover:bg-green-200 disabled:opacity-50"
                  disabled={modalLoading}
                >
                  Set as Inbound
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, dock_type: "Outbound" }))
                  }
                  className="rounded-md bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-200 disabled:opacity-50"
                  disabled={modalLoading}
                >
                  Set as Outbound
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, is_active: !prev.is_active }))
                  }
                  className="rounded-md bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                  disabled={modalLoading}
                >
                  Toggle Status
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, capacity: 5 }))
                  }
                  className="rounded-md bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700 hover:bg-purple-200 disabled:opacity-50"
                  disabled={modalLoading}
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
                onClick={onClose}
                disabled={modalLoading}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={modalLoading}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {modalLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Saving...
                  </span>
                ) : isEditing ? (
                  "Update Dock"
                ) : (
                  "Create Dock"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditDockModal;