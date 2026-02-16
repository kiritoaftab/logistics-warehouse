import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import http from "../../../../api/http";
import toast from "react-hot-toast";

const AddEditCarrierModal = ({
  isOpen,
  onClose,
  selectedCarrier,
  isEditing,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    carrier_name: "",
    carrier_code: "",
    carrier_type: "COURIER",
    contact_person: "",
    email: "",
    phone: "",
    website: "",
    tracking_url_template: "",
    account_no: "",
    is_active: true,
  });

  const [errors, setErrors] = useState({});

  // Updated carrier types to match API documentation
  const carrierTypes = [
    { value: "COURIER", label: "Courier" },
    { value: "FREIGHT", label: "Freight" },
    { value: "OWN_FLEET", label: "Own Fleet" },
    { value: "AGGREGATOR", label: "Aggregator" },
  ];

  useEffect(() => {
    if (selectedCarrier && isEditing) {
      setFormData({
        carrier_name: selectedCarrier.carrier_name || "",
        carrier_code: selectedCarrier.carrier_code || "",
        carrier_type: selectedCarrier.carrier_type || "COURIER",
        contact_person: selectedCarrier.contact_person || "",
        email: selectedCarrier.email || "",
        phone: selectedCarrier.phone || "",
        website: selectedCarrier.website || "",
        tracking_url_template: selectedCarrier.tracking_url_template || "",
        account_no: selectedCarrier.account_no || "",
        is_active: selectedCarrier.is_active ?? true,
      });
    } else {
      // Reset form for add mode
      setFormData({
        carrier_name: "",
        carrier_code: "",
        carrier_type: "COURIER",
        contact_person: "",
        email: "",
        phone: "",
        website: "",
        tracking_url_template: "",
        account_no: "",
        is_active: true,
      });
    }
    setErrors({});
  }, [selectedCarrier, isEditing, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.carrier_name.trim()) {
      newErrors.carrier_name = "Carrier name is required";
    }

    if (!formData.carrier_code.trim()) {
      newErrors.carrier_code = "Carrier code is required";
    }

    if (!formData.carrier_type) {
      newErrors.carrier_type = "Carrier type is required";
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = "Website must start with http:// or https://";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      let response;
      if (isEditing) {
        response = await http.put(`/carriers/${selectedCarrier.id}`, formData);
      } else {
        response = await http.post("/carriers", formData);
      }

      if (response.data.success) {
        toast.success(
          isEditing ? "Carrier updated successfully" : "Carrier created successfully"
        );
        onSuccess();
        onClose();
      } else {
        throw new Error(response.data.message || "Operation failed");
      }
    } catch (err) {
      console.error("Error saving carrier:", err);
      toast.error(
        err.response?.data?.message || 
        `Failed to ${isEditing ? "update" : "create"} carrier`
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">
            {isEditing ? "Edit Carrier" : "Add New Carrier"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-md"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Carrier Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="carrier_name"
                  value={formData.carrier_name}
                  onChange={handleChange}
                  className={`w-full rounded-md border ${
                    errors.carrier_name ? "border-red-500" : "border-gray-300"
                  } px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter carrier name"
                />
                {errors.carrier_name && (
                  <p className="mt-1 text-xs text-red-500">{errors.carrier_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Carrier Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="carrier_code"
                  value={formData.carrier_code}
                  onChange={handleChange}
                  className={`w-full rounded-md border ${
                    errors.carrier_code ? "border-red-500" : "border-gray-300"
                  } px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter carrier code"
                />
                {errors.carrier_code && (
                  <p className="mt-1 text-xs text-red-500">{errors.carrier_code}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Carrier Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="carrier_type"
                  value={formData.carrier_type}
                  onChange={handleChange}
                  className={`w-full rounded-md border ${
                    errors.carrier_type ? "border-red-500" : "border-gray-300"
                  } px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  {carrierTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.carrier_type && (
                  <p className="mt-1 text-xs text-red-500">{errors.carrier_type}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Person
                </label>
                <input
                  type="text"
                  name="contact_person"
                  value={formData.contact_person}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter contact person name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full rounded-md border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className={`w-full rounded-md border ${
                    errors.website ? "border-red-500" : "border-gray-300"
                  } px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="https://example.com"
                />
                {errors.website && (
                  <p className="mt-1 text-xs text-red-500">{errors.website}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tracking URL Template
                </label>
                <input
                  type="text"
                  name="tracking_url_template"
                  value={formData.tracking_url_template}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://track.com/{awb}"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Use {'{awb}'} as placeholder for tracking number
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  name="account_no"
                  value={formData.account_no}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter account number"
                />
              </div>

              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  name="is_active"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                  Active
                </label>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Saving..." : isEditing ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditCarrierModal;