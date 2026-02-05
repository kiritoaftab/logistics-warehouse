import React, { useState } from "react";
import FilterBar from "../components/FilterBar";

const ReadyToInvoice = () => {
  const [filters, setFilters] = useState({
    period: "This Month",
    warehouse: "WH-NYC-01",
    clients: "All Clients",
    customer: "All",
    search: "",
  });

  const filterConfig = [
    {
      key: "period",
      label: "Period",
      value: filters.period,
      options: ["This Month", "Last Month", "This Quarter"],
    },
    {
      key: "warehouse",
      label: "Warehouse",
      value: filters.warehouse,
      options: ["WH-NYC-01", "WH-LA-02", "WH-CHI-03"],
    },
    {
      key: "clients",
      label: "Clients",
      value: filters.clients,
      options: ["All Clients", "Acme Retail", "Global Foods"],
    },
    {
      key: "customer",
      label: "Customer",
      value: filters.customer,
      options: ["All", "Acme Retail Inc.", "Global Foods Ltd."],
    },
    {
      key: "search",
      type: "search",
      label: "Search",
      placeholder: "Search Invoice, Customer...",
      value: filters.search,
      className: "min-w-[300px]",
    },
  ];

  // Customer data
  const customersData = [
    {
      id: 1,
      name: "Acme Retail Inc.",
      events: [
        {
          type: "Storage",
          period: "Oct 1 - Oct 15",
          details: "450 Pallets × 15 Days",
          amount: "₹18,000",
        },
        {
          type: "Inbound Handling",
          reference: "ASN-2024-088",
          details: "2,400 Units",
          amount: "₹4,800",
        },
        {
          type: "Inbound Handling",
          reference: "ASN-2024-092",
          details: "1,200 Units",
          amount: "₹2,400",
        },
        {
          type: "Picking",
          reference: "ORD-10045, ORD-10048...",
          details: "450 Lines",
          amount: "₹13,500",
        },
        {
          type: "Shipping Admin",
          reference: "12 Shipments",
          details: "Standard Rate",
          amount: "₹6,500",
        },
      ],
      readyEvents: 8,
      readyAmount: "₹12,450",
    },
    {
      id: 2,
      name: "Global Foods Ltd.",
      events: [],
      readyEvents: 0,
      readyAmount: "₹0",
    },
    {
      id: 3,
      name: "TechSource Solutions",
      events: [],
      readyEvents: 42,
      readyAmount: "₹28,800",
    },
  ];

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({
      period: "This Month",
      warehouse: "WH-NYC-01",
      clients: "All Clients",
      customer: "All",
      search: "",
    });
  };

  const handleApply = () => {
    console.log("Filters applied:", filters);
  };

  return (
    <div className="space-y-6">
      <FilterBar
        filters={filterConfig}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
        onApply={handleApply}
      />

      <div className="space-y-6">
        {customersData.map((customer) => (
          <div
            key={customer.id}
            className="rounded-lg border border-gray-200 bg-white p-6"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {customer.name}
                </h3>
                {customer.events.length === 0 && (
                  <p className="text-gray-500">No billable events ready</p>
                )}
              </div>

              {customer.readyEvents > 0 && (
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">EVENTS</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {customer.readyEvents}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">READY AMOUNT</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {customer.readyAmount}
                    </p>
                  </div>
                  <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    Create Invoice
                  </button>
                </div>
              )}
            </div>

            {customer.events.length > 0 && (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                          Type
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                          Period/Reference
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                          Details
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {customer.events.map((event, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {event.type}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {event.period || event.reference}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {event.details}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {event.amount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {customer.events.length > 3 && (
                  <div className="mt-4 text-center">
                    <button className="text-blue-600 hover:text-blue-800">
                      View all {customer.events.length} events
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReadyToInvoice;
