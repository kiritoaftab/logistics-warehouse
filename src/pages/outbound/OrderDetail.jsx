// OrderDetail.jsx
import React, { useMemo, useState } from "react";
import { Printer, Pencil } from "lucide-react";
import Breadcrumbs from "../components/header/Breadcrumbs";
import PageHeader from "../components/PageHeader";

import SideNav from "./components/detailpagetabs/SideNav";
import OrderSummaryBar from "./components/detailpagetabs/OrderSummaryBar";

import OverviewTab from "./components/detailpagetabs/OverviewTab";
import LinesTab from "./components/detailpagetabs/LinesTab";
import AllocationTab from "./components/detailpagetabs/AllocationTab";
import EmptyState from "./components/detailpagetabs/EmptyState";
import PickingTab from "./components/detailpagetabs/PickingTab";
import PackingTab from "./components/detailpagetabs/PackingTab";
import ShippingTab from "./components/detailpagetabs/ShippingTab";
import BillingTab from "./components/detailpagetabs/BillingTab";
import DocumentsTab from "./components/detailpagetabs/DocumentsTab";
import AuditTab from "./components/detailpagetabs/AuditTab";

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
            { label: "Outbound", to: "/outbound" },
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
          <div className="lg:col-span-3">
            <SideNav
              active={activeTab}
              onChange={setActiveTab}
              items={navItems}
            />
          </div>

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
              <PickingTab
                onReassignPickers={() => console.log("reassign pickers")}
                onCreatePickWave={() => console.log("create pick wave")}
                onViewAllTasks={() => console.log("view all pick tasks")}
              />
            )}

            {activeTab === "packing" && (
              <PackingTab
                cartonsCreated={0}
                packedUnits={0}
                totalUnits={order.units}
                onPrintPackingSlip={() => console.log("print packing slip")}
                onStartPacking={() => console.log("start packing")}
              />
            )}

            {activeTab === "shipping" && (
              <ShippingTab
                carrier="FedEx Logistics"
                serviceLevel="Overnight Express"
                totalUnits={order.units}
                onGenerateAwb={() => console.log("generate awb")}
                onDispatchShipment={() => console.log("dispatch shipment")}
                onPodUpload={(file) => console.log("pod uploaded", file)}
              />
            )}

            {activeTab === "billing" && (
              <BillingTab
                status="Ready"
                onMarkReady={() => console.log("mark ready")}
                onCreateInvoice={() => console.log("create invoice")}
                onViewInvoice={() => console.log("view invoice")}
              />
            )}

            {activeTab === "documents" && (
              <DocumentsTab
                onDownloadAll={() => console.log("download all")}
                onUpload={() => console.log("upload document")}
                onView={(row) => console.log("view", row)}
                onDownload={(row) => console.log("download", row)}
                onDelete={(row) => console.log("delete", row)}
              />
            )}

            {activeTab === "audit" && <AuditTab />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
