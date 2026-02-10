import React, { useMemo, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import FilterBar from "../components/FilterBar";
import CusTable from "../components/CusTable";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/toast/ToastProvider";

const OutboundOrders = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [selectedRows, setSelectedRows] = useState([]);
  const [filterState, setFilterState] = useState({
    dateRange: "Today",
    status: "All Statuses",
    priority: "All",
    carrier: "All",
    search: "",
  });

  const handleFilterChange = (key, value) => {
    setFilterState((p) => ({ ...p, [key]: value }));
  };

  const handleReset = () => {
    setFilterState({
      dateRange: "Today",
      status: "All Statuses",
      priority: "All",
      carrier: "All",
      search: "",
    });
  };

  const handleApply = () => {
    console.log("apply filters", filterState);
    // later: call API using filterState
  };

  const stats = [
    { title: "Total Orders", value: "152" },
    { title: "Pending Allocation", value: "24" },
    { title: "Picking Pending", value: "38" },
    { title: "Packed Ready", value: "12" },
    { title: "Shipped Today", value: "45" },
    { title: "SLA Breach Risk", value: "3" },
  ];

  const filters = [
    {
      key: "dateRange",
      type: "select",
      label: "Date Range",
      value: filterState.dateRange,
      options: ["Today", "Yesterday", "Last 7 Days", "Last 30 Days"],
      className: "w-[160px]",
    },
    {
      key: "status",
      type: "select",
      label: "Status",
      value: filterState.status,
      options: ["All Statuses", "Confirmed", "Allocated", "Picking", "Packed"],
      className: "w-[160px]",
    },
    {
      key: "priority",
      type: "select",
      label: "Priority",
      value: filterState.priority,
      options: ["All", "High", "Normal"],
      className: "w-[160px]",
    },
    {
      key: "carrier",
      type: "select",
      label: "Carrier",
      value: filterState.carrier,
      options: ["All", "DHL", "FedEx", "UPS Freight", "USPS"],
      className: "w-[160px]",
    },
    {
      key: "search",
      type: "search",
      label: "Search",
      value: filterState.search,
      placeholder: "Order No, Customer, Reference",
      className: "flex-1 min-w-[260px]",
    },
  ];

  const data = useMemo(
    () => [
      {
        id: "SO-2023-1001",
        orderNo: "SO-2023-1001",
        ref: "PO-9981",
        client: "Acme Corp",
        shipTo: "Tech Retailers Inc.",
        shipToSub: "Chicago, IL",
        lines: 12,
        units: 150,
        priority: "High",
        slaDue: "Today, 04:00 PM",
        status: "Confirmed",
        allocation: "None",
        carrier: "DHL",
        actionLabel: "Allocate",
      },
      {
        id: "SO-2023-1002",
        orderNo: "SO-2023-1002",
        ref: "-",
        client: "Acme Corp",
        shipTo: "Urban Outfitters",
        shipToSub: "New York, NY",
        lines: 5,
        units: 24,
        priority: "Normal",
        slaDue: "Tomorrow, 10:00 AM",
        status: "Allocated",
        allocation: "Full",
        carrier: "FedEx",
        actionLabel: "Release",
      },
      {
        id: "SO-2023-1003",
        orderNo: "SO-2023-1003",
        ref: "-",
        client: "Globex",
        shipTo: "Best Buy Store #22",
        shipToSub: "Miami, FL",
        lines: 45,
        units: 1200,
        priority: "High",
        slaDue: "Overdue 2h",
        status: "Picking",
        allocation: "Full",
        carrier: "UPS Freight",
        actionLabel: "Track",
      },
    ],
    [],
  );

  const Pill = ({ text, tone = "gray" }) => {
    const map = {
      gray: "bg-gray-100 text-gray-700",
      blue: "bg-blue-50 text-blue-700",
      green: "bg-green-50 text-green-700",
      orange: "bg-orange-50 text-orange-700",
      red: "bg-red-50 text-red-700",
    };
    return (
      <span
        className={`text-xs px-2 py-1 rounded-full font-medium ${map[tone] || map.gray}`}
      >
        {text}
      </span>
    );
  };

  const columns = useMemo(
    () => [
      {
        key: "select",
        title: (
          <input
            type="checkbox"
            onChange={(e) => {
              if (e.target.checked) setSelectedRows(data.map((x) => x.id));
              else setSelectedRows([]);
            }}
          />
        ),
        render: (row) => (
          <input
            type="checkbox"
            checked={selectedRows.includes(row.id)}
            onChange={(e) => {
              if (e.target.checked) setSelectedRows((p) => [...p, row.id]);
              else setSelectedRows((p) => p.filter((id) => id !== row.id));
            }}
          />
        ),
      },
      {
        key: "orderNo",
        title: "Order No",
        render: (row) => (
          <div>
            <button
              className="text-blue-600 hover:underline font-medium"
              onClick={() => navigate(`/orderDetails/${row.id}`)}
            >
              {row.orderNo}
            </button>
            <div className="text-xs text-gray-400">Ref: {row.ref}</div>
          </div>
        ),
      },
      { key: "client", title: "Client" },
      {
        key: "shipTo",
        title: "Ship-to",
        render: (row) => (
          <div>
            <div className="text-sm font-semibold text-gray-900">
              {row.shipTo}
            </div>
            <div className="text-xs text-gray-500">{row.shipToSub}</div>
          </div>
        ),
      },
      { key: "lines", title: "Lines" },
      { key: "units", title: "Units" },
      {
        key: "priority",
        title: "Priority",
        render: (row) => (
          <Pill
            text={row.priority}
            tone={row.priority === "High" ? "orange" : "blue"}
          />
        ),
      },
      {
        key: "slaDue",
        title: "SLA Due",
        render: (row) => (
          <span
            className={
              String(row.slaDue).toLowerCase().includes("overdue")
                ? "text-red-500 font-medium"
                : ""
            }
          >
            {row.slaDue}
          </span>
        ),
      },
      {
        key: "status",
        title: "Status",
        render: (row) => {
          const tone =
            row.status === "Allocated"
              ? "green"
              : row.status === "Picking"
                ? "orange"
                : "blue";
          return <Pill text={row.status} tone={tone} />;
        },
      },
      {
        key: "allocation",
        title: "Allocation",
        render: (row) => (
          <Pill
            text={row.allocation}
            tone={
              row.allocation === "Full"
                ? "green"
                : row.allocation === "Partial"
                  ? "orange"
                  : "gray"
            }
          />
        ),
      },
      { key: "carrier", title: "Carrier" },
      {
        key: "actions",
        title: "Actions",
        render: (row) => (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => toast.info("feature coming soon!")}
              className="px-3 py-1.5 text-xs rounded-md border bg-white"
            >
              {row.actionLabel}
            </button>
            <button
              onClick={() => navigate(`/orderDetails/:${row.id}`)}
              className="px-2 py-1.5 rounded-md border bg-white"
            >
              <MoreHorizontal size={16} />
            </button>
          </div>
        ),
      },
    ],
    [data, selectedRows],
  );

  return (
    <div className="max-w-full">
      <PageHeader
        title="Outbound Orders"
        subtitle="Create and manage outbound orders"
        actions={
          <>
            <button className="px-4 py-2 border rounded-md text-sm bg-white">
              Export
            </button>
            <button className="px-4 py-2 border rounded-md text-sm bg-white">
              Bulk Allocate
            </button>
            <button
              onClick={() => navigate("/outbound/saleOrderCreate/new")}
              className="px-4 py-2 rounded-md text-sm bg-blue-600 text-white"
            >
              + Create Sales Order
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {stats.map((s) => (
          <StatCard key={s.title} title={s.title} value={s.value} />
        ))}
      </div>

      <div className="mt-4">
        <FilterBar
          filters={filters}
          showActions
          onFilterChange={handleFilterChange}
          onReset={handleReset}
          onApply={handleApply}
        />{" "}
      </div>

      <div className="mt-6 rounded-lg border border-gray-200 bg-white overflow-hidden">
        <CusTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default OutboundOrders;
