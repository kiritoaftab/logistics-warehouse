import React, { useState } from "react";
import FilterBar from "../components/FilterBar";
import CusTable from "../components/CusTable";

const PaymentsAging = ({ onOpenInvoice }) => {
  const [filters, setFilters] = useState({
    period: "This Quarter",
    warehouse: "WH-NYC-01",
    clients: "All Clients",
    status: "All",
    search: "",
  });

  const filterConfig = [
    {
      key: "period",
      label: "Period",
      value: filters.period,
      options: ["This Quarter", "Last Quarter", "This Year"],
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
      key: "status",
      label: "Status",
      value: filters.status,
      options: ["All", "High", "Medium", "Low", "Good"],
    },
    {
      key: "search",
      type: "search",
      label: "Search",
      placeholder: "Search Customer...",
      value: filters.search,
      className: "min-w-[300px]",
    },
  ];

  // Aging data
  const agingData = [
    {
      id: 1,
      customer: "Urban Styles",
      totalOutstanding: "₹18,450",
      overdueAmount: "₹8,350",
      oldestInvoice: "INV-2024-0998 (15 days overdue)",
      riskLevel: "High",
    },
    {
      id: 2,
      customer: "Global Foods Ltd.",
      totalOutstanding: "₹12,450",
      overdueAmount: "₹0",
      oldestInvoice: "INV-2024-1002 (Current)",
      riskLevel: "Low",
    },
    {
      id: 3,
      customer: "Acme Retail Inc.",
      totalOutstanding: "₹5,200",
      overdueAmount: "₹0",
      oldestInvoice: "INV-2024-1001 (Current)",
      riskLevel: "Low",
    },
    {
      id: 4,
      customer: "TechSource Logistics",
      totalOutstanding: "₹42,800",
      overdueAmount: "₹12,000",
      oldestInvoice: "INV-2024-1005 (3 days overdue)",
      riskLevel: "Medium",
    },
    {
      id: 5,
      customer: "NextGen Auto",
      totalOutstanding: "₹0",
      overdueAmount: "₹0",
      oldestInvoice: "-",
      riskLevel: "Good",
    },
  ];

  const columns = [
    { key: "customer", title: "Customer" },
    { key: "totalOutstanding", title: "Total Outstanding" },
    { key: "overdueAmount", title: "Overdue Amount" },
    {
      key: "oldestInvoice",
      title: "Oldest Invoice",
      render: (row) => (
        <button
          onClick={() => {
            // Extract invoice number from the text
            const match = row.oldestInvoice.match(/INV-\d+-\d+/);
            if (match) {
              onOpenInvoice?.(match[0]);
            }
          }}
          className="text-left text-blue-600 hover:text-blue-800 hover:underline"
        >
          {row.oldestInvoice}
        </button>
      ),
    },
    {
      key: "riskLevel",
      title: "Risk Level",
      render: (row) => {
        const riskColors = {
          High: "text-red-700",
          Medium: "text-amber-700",
          Low: "text-green-700",
          Good: "text-blue-700",
        };
        const bgColors = {
          High: "bg-red-100",
          Medium: "bg-amber-100",
          Low: "bg-green-100",
          Good: "bg-blue-100",
        };
        return (
          <span
            className={`inline-block rounded-full ${bgColors[row.riskLevel]} px-3 py-1 text-xs font-medium ${riskColors[row.riskLevel]}`}
          >
            {row.riskLevel}
          </span>
        );
      },
    },
    {
      key: "actions",
      title: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button className="rounded-md border border-gray-300 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50">
            Open Ledger
          </button>
          <button className="rounded-md bg-blue-600 px-3 py-1.5 text-xs text-white hover:bg-blue-700">
            Record Pay
          </button>
        </div>
      ),
    },
  ];

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({
      period: "This Quarter",
      warehouse: "WH-NYC-01",
      clients: "All Clients",
      status: "All",
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

      {/* Aging Table */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <CusTable columns={columns} data={agingData} />
      </div>
    </div>
  );
};

export default PaymentsAging;
