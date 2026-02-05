import React, { useState } from "react";

const RunBillingModal = ({ isOpen, onClose, onRunBilling }) => {
  const [formData, setFormData] = useState({
    startDate: "2024-03-01",
    endDate: "2024-03-31",
    warehouse: "WH-NYC-01",
    customerScope: "all",
    selectedCustomers: [],
    chargeTypes: ["storage", "inbound", "putaway", "packing", "shipping"],
    invoiceGrouping: "perCustomer",
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onRunBilling(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        ></div>

        <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">
            Run Billing
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    required
                  />
                </div>
              </div>

              {/* Warehouse */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Warehouse *
                </label>
                <select
                  value={formData.warehouse}
                  onChange={(e) =>
                    setFormData({ ...formData, warehouse: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  required
                >
                  <option value="WH-NYC-01">WH-NYC-01 (Main Hub)</option>
                  <option value="WH-LA-02">WH-LA-02</option>
                  <option value="WH-CHI-03">WH-CHI-03</option>
                </select>
              </div>

              {/* Customer Scope */}
              <div>
                <h3 className="mb-3 text-sm font-medium text-gray-900">
                  Customer Scope
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={formData.customerScope === "all"}
                      onChange={() =>
                        setFormData({ ...formData, customerScope: "all" })
                      }
                      className="mr-2"
                    />
                    All Customers
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={formData.customerScope === "specific"}
                      onChange={() =>
                        setFormData({ ...formData, customerScope: "specific" })
                      }
                      className="mr-2"
                    />
                    Select Specific Customers
                  </label>
                </div>
              </div>

              {/* Charge Types */}
              <div>
                <h3 className="mb-3 text-sm font-medium text-gray-900">
                  Include Charge Types
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Storage",
                    "Inbound Handling",
                    "Putaway",
                    "Packing",
                    "Shipping",
                  ].map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.chargeTypes.includes(
                          type.toLowerCase(),
                        )}
                        onChange={(e) => {
                          const newTypes = e.target.checked
                            ? [...formData.chargeTypes, type.toLowerCase()]
                            : formData.chargeTypes.filter(
                                (t) => t !== type.toLowerCase(),
                              );
                          setFormData({ ...formData, chargeTypes: newTypes });
                        }}
                        className="mr-2"
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              {/* Invoice Grouping */}
              <div>
                <h3 className="mb-3 text-sm font-medium text-gray-900">
                  Invoice Grouping
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={formData.invoiceGrouping === "perCustomer"}
                      onChange={() =>
                        setFormData({
                          ...formData,
                          invoiceGrouping: "perCustomer",
                        })
                      }
                      className="mr-2"
                    />
                    One invoice per customer
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={formData.invoiceGrouping === "splitWarehouse"}
                      onChange={() =>
                        setFormData({
                          ...formData,
                          invoiceGrouping: "splitWarehouse",
                        })
                      }
                      className="mr-2"
                    />
                    Split by Warehouse
                  </label>
                </div>
              </div>

              {/* Info Text */}
              <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-700">
                Running billing will calculate charges for all selected events.
                You can review the calculations in the "Ready to Invoice" tab
                before final generation.
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => console.log("Preview clicked")}
                  className="rounded-md border border-blue-300 bg-white px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50"
                >
                  Preview Run
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Run & Generate
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RunBillingModal;
