import React, { useState } from "react";
import FilterBar from "../components/FilterBar";
import CusTable from "../components/CusTable";
import { Eye, Download, Share2, MoreHorizontal } from "lucide-react";

const Invoiced = ({ onOpenInvoice }) => {
  const [filters, setFilters] = useState({
    period: "This Month",
    warehouse: "WH-NYC-01",
    clients: "All Clients",
    status: "All",
    search: "",
  });

  const filterConfig = [
    {
      key: "period",
      label: "",
      value: filters.period,
      options: ["This Month", "Last Month", "This Quarter"],
    },
    {
      key: "warehouse",
      label: "",
      value: filters.warehouse,
      options: ["WH-NYC-01", "WH-LA-02", "WH-CHI-03"],
    },
    {
      key: "clients",
      label: "",
      value: filters.clients,
      options: [
        "All Clients",
        "Acme Retail",
        "Global Foods",
        "TechSource Logistics",
        "Urban Styles",
      ],
    },
    {
      key: "status",
      label: "",
      value: filters.status,
      options: ["All", "Paid", "Part Paid", "Sent", "Overdue"],
    },
    {
      key: "search",
      type: "search",
      label: "",
      placeholder: "Search Invoice, Order, ASN...",
      value: filters.search,
      className: "min-w-[320px]",
    },
  ];

  const invoicesData = [
    {
      id: 1,
      invoiceNo: "INV-2024-1001",
      customer: "Acme Retail Inc.",
      invoiceDate: "Oct 01, 2024",
      periodCovered: "Sep 01 - Sep 30",
      amount: "₹45,200",
      status: "Paid",
    },
    {
      id: 2,
      invoiceNo: "INV-2024-1002",
      customer: "Global Foods Ltd.",
      invoiceDate: "Oct 01, 2024",
      periodCovered: "Sep 01 - Sep 30",
      amount: "₹12,450",
      status: "Part Paid",
    },
    {
      id: 3,
      invoiceNo: "INV-2024-1005",
      customer: "TechSource Logistics",
      invoiceDate: "Oct 02, 2024",
      periodCovered: "Sep 15 - Sep 30",
      amount: "₹28,800",
      status: "Sent",
    },
    {
      id: 4,
      invoiceNo: "INV-2024-0998",
      customer: "Urban Styles",
      invoiceDate: "Sep 28, 2024",
      periodCovered: "Sep 01 - Sep 15",
      amount: "₹8,350",
      status: "Overdue",
    },
    {
      id: 5,
      invoiceNo: "INV-2024-0990",
      customer: "NextGen Auto",
      invoiceDate: "Sep 25, 2024",
      periodCovered: "Aug 01 - Aug 31",
      amount: "₹152,000",
      status: "Paid",
    },
  ];

  const StatusPill = ({ value }) => {
    const map = {
      Paid: "bg-green-50 text-green-700",
      "Part Paid": "bg-orange-50 text-orange-700",
      Sent: "bg-blue-50 text-blue-700",
      Overdue: "bg-red-50 text-red-700",
    };
    return (
      <span
        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
          map[value] || "bg-gray-100 text-gray-700"
        }`}
      >
        {value}
      </span>
    );
  };

  const columns = [
    {
      key: "invoiceNo",
      title: "Invoice No",
      render: (row) => (
        <button
          onClick={() => onOpenInvoice?.(row.invoiceNo)}
          className="font-semibold text-blue-600 hover:text-blue-700"
        >
          {row.invoiceNo}
        </button>
      ),
    },
    { key: "customer", title: "Customer" },
    { key: "invoiceDate", title: "Invoice Date" },
    { key: "periodCovered", title: "Period Covered" },
    { key: "amount", title: "Amount" },
    {
      key: "status",
      title: "Status",
      render: (row) => <StatusPill value={row.status} />,
    },
    {
      key: "actions",
      title: "Actions",
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onOpenInvoice?.(row.invoiceNo)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            title="View"
          >
            <Eye size={16} />
          </button>

          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            title="Download"
          >
            <Download size={16} />
          </button>

          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            title="Share"
          >
            <Share2 size={16} />
          </button>

          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            title="More"
          >
            <MoreHorizontal size={16} />
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
      period: "This Month",
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
    <div className="space-y-5">
      {/* Filter bar row (tight like Figma) */}
      <div className="rounded-xl border border-gray-200 bg-white p-3">
        <FilterBar
          filters={filterConfig}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
          onApply={handleApply}
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <CusTable columns={columns} data={invoicesData} />
      </div>
    </div>
  );
};

export default Invoiced;
