// OrderDetail.jsx
import React, { useMemo, useState } from "react";
import { Printer, Pencil, Layers, Play, Truck } from "lucide-react";
import Breadcrumbs from "../components/header/Breadcrumbs";
import PageHeader from "../components/PageHeader";
import CusTable from "../components/CusTable";
import KeyValueCard from "../inbound/components/asndetails/KeyValueCard";

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

const SideNav = ({ active, onChange, items }) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <div className="space-y-1">
        {items.map((it) => {
          const isActive = active === it.key;
          return (
            <button
              key={it.key}
              type="button"
              onClick={() => onChange(it.key)}
              className={[
                "w-full flex items-center justify-between rounded-md px-3 py-2 text-sm",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-50",
              ].join(" ")}
            >
              <span>{it.label}</span>
              <span
                className={[
                  "min-w-[26px] h-6 px-2 inline-flex items-center justify-center rounded-full text-xs",
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-600",
                ].join(" ")}
              >
                {it.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const OrderSummaryBar = ({ order }) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-xl font-semibold text-gray-900">
              {order.orderNo}
            </div>
            <Pill text={order.status} tone="blue" />
            <Pill text={order.allocationBadge} tone="blue" />
            <Pill text={order.priorityBadge} tone="orange" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <div className="text-[11px] font-medium text-gray-500">
                CLIENT
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {order.client}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-medium text-gray-500">
                SHIP TO
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {order.shipTo}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-medium text-gray-500">
                SLA DUE
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {order.slaDue}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-medium text-gray-500">
                LINES / UNITS
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {order.lines} / {order.units}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 lg:justify-end">
          <button className="px-3 py-1.5 text-xs rounded-md bg-blue-50 text-blue-700">
            Open Picking
          </button>
          <button className="px-3 py-1.5 text-xs rounded-md bg-blue-50 text-blue-700">
            Open Packing
          </button>
          <button className="px-3 py-1.5 text-xs rounded-md bg-blue-50 text-blue-700">
            Open Billing
          </button>
        </div>
      </div>
    </div>
  );
};

const StepDot = ({ active }) => (
  <div
    className={[
      "h-8 w-8 rounded-full flex items-center justify-center border",
      active
        ? "border-blue-600 text-blue-600"
        : "border-gray-200 text-gray-400",
    ].join(" ")}
  >
    <div
      className={[
        "h-2 w-2 rounded-full",
        active ? "bg-blue-600" : "bg-gray-300",
      ].join(" ")}
    />
  </div>
);

const OrderProgress = () => {
  const steps = [
    { no: 1, label: "Created", sub: "Oct 24, 10:00" },
    { no: 2, label: "Confirmed", sub: "Oct 24, 10:05" },
    { no: 3, label: "Allocating", sub: "In Progress", active: true },
    { no: 4, label: "Picking", sub: "" },
    { no: 5, label: "Packing", sub: "" },
    { no: 6, label: "Shipped", sub: "" },
  ];

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="text-sm font-semibold text-gray-900 mb-4">
        Order Progress
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-6 gap-4">
        {steps.map((s) => (
          <div
            key={s.no}
            className="flex flex-col items-center text-center gap-2"
          >
            <StepDot active={!!s.active} />
            <div className="text-xs font-semibold text-gray-900">{s.label}</div>
            <div className="text-[11px] text-gray-500">{s.sub || "\u00A0"}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const OverviewTab = ({ onEditShipTo, onEditShipping }) => {
  return (
    <div className="space-y-6">
      <OrderProgress />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <KeyValueCard
          title="Ship-to Details"
          onEdit={onEditShipTo}
          items={[
            { label: "Company Name", value: "Tech Retailers Inc." },
            { label: "Contact", value: "John Doe (+1 555-0123)" },
            {
              label: "Address",
              value: "123 Commerce Blvd, Suite 400\nNew York, NY, 10001",
            },
            {
              label: "Instructions",
              value: "Deliver to rear dock. Call security upon arrival.",
            },
          ]}
        />

        <KeyValueCard
          title="Shipping & Carrier"
          onEdit={onEditShipping}
          items={[
            {
              label: "Carrier Service",
              value: "FedEx Express (Client Account)",
            },
            { label: "Service Level", value: "Overnight / Priority" },
            { label: "Packaging", value: "Standard Carton" },
            { label: "Tracking No", value: "Pending Generation" },
          ]}
        />
      </div>
    </div>
  );
};

const LinesTab = () => {
  const rows = useMemo(
    () => [
      {
        id: "1",
        sku: "SKU-10045",
        name: "Wireless Mouse - Black",
        requested: 50,
        allocated: 50,
        picked: 0,
        packed: 0,
        shipped: 0,
        rule: "FIFO",
        status: "Fully Allocated",
      },
      {
        id: "2",
        sku: "SKU-10299",
        name: "Mechanical Keyboard",
        requested: 20,
        allocated: 10,
        picked: 0,
        packed: 0,
        shipped: 0,
        rule: "FIFO",
        status: "Partial",
      },
      {
        id: "3",
        sku: "SKU-20441",
        name: "USB-C Hub 4-Port",
        requested: 10,
        allocated: 0,
        picked: 0,
        packed: 0,
        shipped: 0,
        rule: "Batch",
        status: "Pending",
      },
      {
        id: "4",
        sku: "SKU-30012",
        name: "Monitor Stand",
        requested: 5,
        allocated: 5,
        picked: 0,
        packed: 0,
        shipped: 0,
        rule: "FEFO",
        status: "Fully Allocated",
      },
      {
        id: "5",
        sku: "SKU-99102",
        name: "Webcam 1080p",
        requested: 35,
        allocated: 0,
        picked: 0,
        packed: 0,
        shipped: 0,
        rule: "FIFO",
        status: "No Stock",
      },
    ],
    [],
  );

  const columns = useMemo(
    () => [
      {
        key: "sku",
        title: "SKU",
        render: (r) => (
          <div>
            <div className="text-sm font-semibold text-gray-900">{r.sku}</div>
            <div className="text-xs text-gray-500">{r.name}</div>
          </div>
        ),
      },
      { key: "requested", title: "Requested" },
      { key: "allocated", title: "Allocated" },
      { key: "picked", title: "Picked" },
      { key: "packed", title: "Packed" },
      { key: "shipped", title: "Shipped" },
      { key: "rule", title: "Rule" },
      {
        key: "status",
        title: "Status",
        render: (r) => {
          const tone =
            r.status === "Fully Allocated"
              ? "green"
              : r.status === "Partial"
                ? "orange"
                : r.status === "No Stock"
                  ? "red"
                  : "gray";
          return <Pill text={r.status} tone={tone} />;
        },
      },
      {
        key: "actions",
        title: "Actions",
        render: () => (
          <button className="h-8 w-8 inline-flex items-center justify-center rounded-md bg-gray-100 text-gray-700">
            <Layers size={16} />
          </button>
        ),
      },
    ],
    [],
  );

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <CusTable columns={columns} data={rows} />
    </div>
  );
};

const AllocationTab = () => {
  const stats = { full: 1, partial: 1, unallocated: 0 };

  const rows = useMemo(
    () => [
      {
        id: "1",
        sku: "SKU-1001-A",
        name: "Wireless Mouse Black",
        requested: 50,
        allocated: 50,
        short: 0,
        rule: "FIFO",
        status: "Full",
        action: "View Bins",
      },
      {
        id: "2",
        sku: "SKU-2040-X",
        name: "Mechanical Keyboard",
        requested: 20,
        allocated: 20,
        short: 0,
        rule: "FIFO",
        status: "Full",
        action: "View Bins",
      },
      {
        id: "3",
        sku: "SKU-8820-B",
        name: "Monitor Stand Pro",
        requested: 20,
        allocated: 10,
        short: 10,
        rule: "FIFO",
        status: "Partial",
        action: "View Bins",
        badge: "Manual",
      },
      {
        id: "4",
        sku: "SKU-9900-Q",
        name: "Webcam 4K Ultra",
        requested: 15,
        allocated: 0,
        short: 15,
        rule: "FIFO",
        status: "None",
        action: "Manual Allocate",
      },
    ],
    [],
  );

  const columns = useMemo(
    () => [
      {
        key: "sku",
        title: "SKU",
        render: (r) => (
          <div>
            <div className="text-sm font-semibold text-blue-600">{r.sku}</div>
            <div className="text-xs text-gray-500">{r.name}</div>
          </div>
        ),
      },
      { key: "requested", title: "Requested" },
      { key: "allocated", title: "Allocated" },
      {
        key: "short",
        title: "Short",
        render: (r) => (
          <span className={r.short > 0 ? "text-red-600 font-semibold" : ""}>
            {r.short}
          </span>
        ),
      },
      { key: "rule", title: "Rule" },
      {
        key: "status",
        title: "Status",
        render: (r) => {
          const tone =
            r.status === "Full"
              ? "green"
              : r.status === "Partial"
                ? "orange"
                : "red";
          return <Pill text={r.status} tone={tone} />;
        },
      },
      {
        key: "actions",
        title: "Actions",
        render: (r) => (
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-xs rounded-md border bg-white">
              {r.action}
            </button>
            {r.badge && (
              <span className="px-2 py-1 text-xs rounded-md bg-blue-50 text-blue-700">
                {r.badge}
              </span>
            )}
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-4">
      {/* top summary + buttons */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 flex flex-wrap items-center gap-3 justify-between">
        <div className="flex flex-wrap items-center gap-6">
          <div className="text-sm text-gray-600">
            Full Lines{" "}
            <span className="ml-2 font-semibold text-gray-900">
              {stats.full}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            Partial Lines{" "}
            <span className="ml-2 font-semibold text-red-600">
              {stats.partial}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            Unallocated{" "}
            <span className="ml-2 font-semibold text-gray-900">
              {stats.unallocated}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-4 py-2 border rounded-md text-sm bg-white inline-flex items-center gap-2">
            <Play size={16} />
            Run Allocation
          </button>
          <button className="px-4 py-2 rounded-md text-sm bg-blue-600 text-white">
            Release to Picking
          </button>
        </div>
      </div>

      {/* results table */}
      <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
        <div className="px-4 py-3 border-b">
          <div className="text-sm font-semibold text-gray-900">
            Allocation Results
          </div>
        </div>
        <CusTable columns={columns} data={rows} />
      </div>
    </div>
  );
};

const EmptyState = ({ title, subtitle, actionLabel }) => (
  <div className="rounded-lg border border-gray-200 bg-white p-6">
    <div className="flex items-start gap-3">
      <div className="h-9 w-9 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center">
        <Truck size={16} />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-blue-700">{title}</div>
        <div className="text-sm text-gray-600 mt-1">{subtitle}</div>
      </div>
    </div>

    <div className="mt-5 rounded-lg border border-gray-100 bg-white p-6 text-center text-sm text-gray-500">
      No data available yet.
      {actionLabel ? (
        <div className="mt-4">
          <button className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm">
            {actionLabel}
          </button>
        </div>
      ) : null}
    </div>
  </div>
);

const OrderDetail = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const order = {
    orderNo: "ORD-2023-001",
    status: "Confirmed",
    allocationBadge: "Partial Allocation",
    priorityBadge: "High Priority",
    client: "Acme Corp",
    shipTo: "Tech Retailers Inc., New York",
    slaDue: "Today, 18:00",
    lines: 5,
    units: 120,
  };

  const navItems = useMemo(
    () => [
      { key: "overview", label: "Overview", count: 0 },
      { key: "lines", label: "Lines", count: 5 },
      { key: "allocation", label: "Allocation", count: 2 },
      { key: "picking", label: "Picking", count: 0 },
      { key: "packing", label: "Packing", count: 0 },
      { key: "shipping", label: "Shipping", count: 0 },
      { key: "billing", label: "Billing", count: 1 },
      { key: "documents", label: "Documents", count: 2 },
      { key: "audit", label: "Audit", count: 0 },
    ],
    [],
  );

  return (
    <div className="max-w-full">
      <div className="mb-3">
        <Breadcrumbs
          items={[
            { label: "Outbound", to: "/outbound/orders" },
            { label: "Order Detail" },
          ]}
        />
      </div>

      <PageHeader
        title="Order Detail"
        actions={
          <>
            <button className="px-4 py-2 border rounded-md text-sm bg-white inline-flex items-center gap-2">
              <Printer size={16} />
              Print
            </button>
            <button className="px-4 py-2 border rounded-md text-sm bg-white inline-flex items-center gap-2">
              <Pencil size={16} />
              Edit Order
            </button>
            <button className="px-4 py-2 rounded-md text-sm bg-blue-600 text-white">
              Allocate
            </button>
          </>
        }
      />

      <div className="mt-4 space-y-4">
        <OrderSummaryBar order={order} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT NAV */}
          <div className="lg:col-span-3">
            <SideNav
              active={activeTab}
              onChange={setActiveTab}
              items={navItems}
            />
          </div>

          {/* RIGHT CONTENT */}
          <div className="lg:col-span-9">
            {activeTab === "overview" && (
              <OverviewTab
                onEditShipTo={() => console.log("edit ship-to")}
                onEditShipping={() => console.log("edit shipping")}
              />
            )}

            {activeTab === "lines" && <LinesTab />}

            {activeTab === "allocation" && <AllocationTab />}

            {activeTab === "picking" && (
              <EmptyState
                title="Pick Wave Not Created"
                subtitle="Allocation is partial. You can create a pick wave for the allocated lines to start picking."
                actionLabel="Create Pick Wave"
              />
            )}

            {activeTab === "packing" && (
              <EmptyState
                title="No cartons created yet"
                subtitle='Click "Start Packing" to begin.'
                actionLabel="Start Packing"
              />
            )}

            {activeTab === "shipping" && (
              <EmptyState
                title="Shipping not started"
                subtitle="Complete packing to proceed with shipping."
              />
            )}

            {activeTab === "billing" && (
              <EmptyState
                title="Billing pending"
                subtitle="Billing will be available after shipment."
              />
            )}

            {activeTab === "documents" && (
              <EmptyState
                title="Documents"
                subtitle="Upload and view order documents here."
              />
            )}

            {activeTab === "audit" && (
              <EmptyState
                title="Audit Trail"
                subtitle="All actions will appear here."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
