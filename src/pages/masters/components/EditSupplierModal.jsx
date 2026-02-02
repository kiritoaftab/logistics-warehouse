import React, { useState, useEffect } from "react";
import http from "../../../api/http";
import { User, X, MapPin, Search, Mail, Phone, FileText } from "lucide-react";

const EditSupplierModal = ({ isOpen, onClose, supplier, onSuccess }) => {
  const [formData, setFormData] = useState({
    supplier_name: "",
    supplier_code: "",
    contact_person: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
    tax_id: "",
    payment_terms: "Net 30",
    is_active: true,
  });

  const [loading, setLoading] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [pincodeSuggestions, setPincodeSuggestions] = useState([]);
  const [showPincodeSuggestions, setShowPincodeSuggestions] = useState(false);
  const [originalPincode, setOriginalPincode] = useState("");

  useEffect(() => {
    if (supplier) {
      setFormData({
        supplier_name: supplier.supplier_name || "",
        supplier_code: supplier.supplier_code || "",
        contact_person: supplier.contact_person || "",
        email: supplier.email || "",
        phone: supplier.phone || "",
        address: supplier.address || "",
        city: supplier.city || "",
        state: supplier.state || "",
        country: supplier.country || "India",
        pincode: supplier.pincode || "",
        tax_id: supplier.tax_id || "",
        payment_terms: supplier.payment_terms || "Net 30",
        is_active: supplier.is_active ?? true,
      });
      setOriginalPincode(supplier.pincode || "");
    }
  }, [supplier]);

  if (!isOpen || !supplier) return null;

  const paymentTermsOptions = [
    "Net 15",
    "Net 30",
    "Net 45",
    "Net 60",
    "Net 90",
    "Due on Receipt",
    "Advance Payment",
  ];

  // Fetch pincode details from API
  const fetchPincodeDetails = async (pincode) => {
    if (pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
      setPincodeSuggestions([]);
      return;
    }

    setPincodeLoading(true);
    try {
      const response = await fetch(
        `https://medicine.uur.co.in:4036/api/v1/pincode/${pincode}`,
      );
      const data = await response.json();

      if (data.success && data.data && data.data.length > 0) {
        setPincodeSuggestions(data.data);
        setShowPincodeSuggestions(true);

        // Auto-fill with first suggestion
        const firstSuggestion = data.data[0];
        setFormData((prev) => ({
          ...prev,
          city: firstSuggestion.city || "",
          state: firstSuggestion.state || "",
          country: firstSuggestion.country || "India",
        }));
      } else {
        setPincodeSuggestions([]);
        setShowPincodeSuggestions(false);
      }
    } catch (error) {
      console.error("Error fetching pincode details:", error);
      setPincodeSuggestions([]);
      setShowPincodeSuggestions(false);
    } finally {
      setPincodeLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.supplier_name.trim()) {
      newErrors.supplier_name = "Supplier name is required";
    }

    if (!formData.supplier_code.trim()) {
      newErrors.supplier_code = "Supplier code is required";
    }

    if (!formData.contact_person.trim()) {
      newErrors.contact_person = "Contact person is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9+\-\s]{10,15}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid phone number (10-15 digits)";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

    if (!formData.tax_id.trim()) {
      newErrors.tax_id = "Tax ID is required";
    }

    if (!formData.payment_terms.trim()) {
      newErrors.payment_terms = "Payment terms are required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const payload = {
        supplier_name: formData.supplier_name,
        supplier_code: formData.supplier_code,
        contact_person: formData.contact_person,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        pincode: formData.pincode,
        tax_id: formData.tax_id,
        payment_terms: formData.payment_terms,
        is_active: formData.is_active,
      };

      const response = await http.put(`/suppliers/${supplier.id}`, payload);

      if (response.data.success) {
        onSuccess?.(response.data.data);
        onClose();
      } else {
        throw new Error(response.data.message || "Failed to update supplier");
      }
    } catch (error) {
      console.error("Error updating supplier:", error);

      if (error.response?.data?.errors) {
        const apiErrors = {};
        Object.keys(error.response.data.errors).forEach((key) => {
          apiErrors[key] = error.response.data.errors[key][0];
        });
        setErrors(apiErrors);
      } else {
        alert(
          error.response?.data?.message ||
            "Error updating supplier. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    // Trigger pincode lookup when pincode is entered/changed
    if (field === "pincode") {
      // Only fetch if pincode is different from original and valid
      if (
        value.length === 6 &&
        /^\d{6}$/.test(value) &&
        value !== originalPincode
      ) {
        fetchPincodeDetails(value);
      } else if (value.length !== 6) {
        setPincodeSuggestions([]);
        setShowPincodeSuggestions(false);
      }
    }
  };

  const selectPincodeSuggestion = (suggestion) => {
    setFormData((prev) => ({
      ...prev,
      city: suggestion.city,
      state: suggestion.state,
      country: suggestion.country || "India",
    }));
    setShowPincodeSuggestions(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-4xl rounded-lg bg-white shadow-xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-blue-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Edit Supplier
              </h2>
              <p className="text-xs text-gray-500">
                ID: {supplier.supplier_code}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 hover:bg-gray-100"
            disabled={loading}
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Modal Body */}
        <form
          onSubmit={handleSubmit}
          className="max-h-[80vh] overflow-y-auto p-6"
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left Column - Basic Information */}
            <div className="space-y-6">
              <div>
                <h3 className="mb-4 text-sm font-semibold text-gray-700">
                  Basic Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Supplier Name *
                    </label>
                    <input
                      type="text"
                      value={formData.supplier_name}
                      onChange={(e) =>
                        handleInputChange("supplier_name", e.target.value)
                      }
                      className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                        errors.supplier_name
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      }`}
                    />
                    {errors.supplier_name && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.supplier_name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Supplier Code *
                    </label>
                    <input
                      type="text"
                      value={formData.supplier_code}
                      onChange={(e) =>
                        handleInputChange("supplier_code", e.target.value)
                      }
                      className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                        errors.supplier_code
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      }`}
                    />
                    {errors.supplier_code && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.supplier_code}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Contact Person *
                    </label>
                    <input
                      type="text"
                      value={formData.contact_person}
                      onChange={(e) =>
                        handleInputChange("contact_person", e.target.value)
                      }
                      className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                        errors.contact_person
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      }`}
                    />
                    {errors.contact_person && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.contact_person}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="mb-4 text-sm font-semibold text-gray-700">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className={`w-full rounded-md border pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                          errors.email
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        className={`w-full rounded-md border pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                          errors.phone
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        }`}
                        maxLength={10}
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Address & Business Info */}
            <div className="space-y-6">
              {/* Address Information */}
              <div>
                <h3 className="mb-4 text-sm font-semibold text-gray-700">
                  Address Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Address *
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                        errors.address
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      }`}
                    />
                    {errors.address && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.address}
                      </p>
                    )}
                  </div>

                  {/* Pincode with lookup */}
                  <div className="relative">
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Pincode *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.pincode}
                        onChange={(e) =>
                          handleInputChange(
                            "pincode",
                            e.target.value.replace(/\D/g, ""),
                          )
                        }
                        className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                          errors.pincode
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        }`}
                        maxLength="6"
                      />
                      {pincodeLoading && (
                        <div className="absolute right-3 top-2.5">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                        </div>
                      )}
                      {!pincodeLoading &&
                        formData.pincode.length === 6 &&
                        formData.pincode !== originalPincode && (
                          <button
                            type="button"
                            onClick={() =>
                              fetchPincodeDetails(formData.pincode)
                            }
                            className="absolute right-3 top-2.5 text-gray-400 hover:text-blue-600"
                            title="Lookup pincode"
                          >
                            <Search className="h-4 w-4" />
                          </button>
                        )}
                    </div>
                    {errors.pincode && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.pincode}
                      </p>
                    )}

                    {/* Pincode Suggestions Dropdown */}
                    {showPincodeSuggestions &&
                      pincodeSuggestions.length > 0 && (
                        <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-60 overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
                          <div className="p-2 text-xs text-gray-500 border-b border-gray-100">
                            Select a location for pincode {formData.pincode}:
                          </div>
                          {pincodeSuggestions.map((suggestion, index) => (
                            <button
                              key={suggestion._id || index}
                              type="button"
                              onClick={() =>
                                selectPincodeSuggestion(suggestion)
                              }
                              className="w-full px-3 py-2 text-left text-sm hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                            >
                              <div className="font-medium">
                                {suggestion.city}
                              </div>
                              <div className="text-xs text-gray-500">
                                {suggestion.district}, {suggestion.state}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        City *
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) =>
                          handleInputChange("city", e.target.value)
                        }
                        className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                          errors.city
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        }`}
                      />
                      {errors.city && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.city}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        State *
                      </label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) =>
                          handleInputChange("state", e.target.value)
                        }
                        className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                          errors.state
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        }`}
                      />
                      {errors.state && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.state}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Country *
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) =>
                        handleInputChange("country", e.target.value)
                      }
                      className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                        errors.country
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      }`}
                    />
                    {errors.country && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.country}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Business Information */}
              <div>
                <h3 className="mb-4 text-sm font-semibold text-gray-700">
                  Business Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Tax ID (GSTIN) *
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={formData.tax_id}
                        onChange={(e) =>
                          handleInputChange(
                            "tax_id",
                            e.target.value.toUpperCase(),
                          )
                        }
                        className={`w-full rounded-md border pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                          errors.tax_id
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        }`}
                      />
                    </div>
                    {errors.tax_id && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.tax_id}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Payment Terms *
                    </label>
                    <select
                      value={formData.payment_terms}
                      onChange={(e) =>
                        handleInputChange("payment_terms", e.target.value)
                      }
                      className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                        errors.payment_terms
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      }`}
                    >
                      {paymentTermsOptions.map((term) => (
                        <option key={term} value={term}>
                          {term}
                        </option>
                      ))}
                    </select>
                    {errors.payment_terms && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.payment_terms}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center pt-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) =>
                          handleInputChange("is_active", e.target.checked)
                        }
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        Active Supplier
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="mt-8 flex justify-end gap-3 border-t border-gray-200 pt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Updating...
                </>
              ) : (
                <>
                  <User className="h-4 w-4" />
                  Update Supplier
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSupplierModal;
