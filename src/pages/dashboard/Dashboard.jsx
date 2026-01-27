import React from "react";

import { Download, Boxes, Upload } from "lucide-react";
import PageHeader from "../components/PageHeader";
import FilterBar from "../components/FilterBar";
import StatCard from "../components/StatCard";
import SectionHeader from "../components/SectionHeader";
import DashboardWidgets from "./DashboardWidgets";
import DashboardQueue from "./DashboardQueue";

const Dashboard = () => {
  return (
    <div className="max-w-full">
      {/* PAGE HEADER */}
      <PageHeader
        title="WMS Dashboard"
        subtitle="Inbound, putaway, picking, packing, dispatch and billing overview"
        actions={
          <>
            <button className="px-4 py-2 border rounded-md text-sm bg-white">
              Generate Invoice
            </button>
            <button className="px-4 py-2 border rounded-md text-sm bg-white">
              Receive GRN
            </button>
            <button className="px-4 py-2 border rounded-md text-sm bg-white">
              Start Picking Wave
            </button>
            <button className="px-4 py-2 rounded-md text-sm bg-primary text-white">
              Create SO
            </button>
            <button className="px-4 py-2 rounded-md text-sm bg-primary text-white">
              Create ASN
            </button>
          </>
        }
      />

      {/* FILTER BAR */}
      <FilterBar />

      {/* INBOUND */}
      <SectionHeader
        title="Inbound Operations"
        icon={<Download size={16} className="text-blue-600" />}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="ASN Pending" value="12" accentColor="#3B82F6" />
        <StatCard title="Receiving Today" value="8" accentColor="#3B82F6" />
        <StatCard title="Putaway Pending" value="45" accentColor="#3B82F6" />
        <StatCard title="Dock Utilization" value="85%" accentColor="#3B82F6" />
      </div>

      {/* INVENTORY */}
      <SectionHeader
        title="Inventory Status"
        icon={<Boxes size={16} className="text-orange-500" />}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="On-hand SKUs" value="3,420" accentColor="#F59E0B" />
        <StatCard title="Available Qty" value="142,500" accentColor="#F59E0B" />
        <StatCard title="Blocked / Hold" value="1,250" accentColor="#F59E0B" />
        <StatCard title="Low Stock Alerts" value="14" accentColor="#F59E0B" />
      </div>

      {/* OUTBOUND */}
      <SectionHeader
        title="Outbound Operations"
        icon={<Upload size={16} className="text-green-600" />}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Orders Pending" value="24" accentColor="#10B981" />
        <StatCard title="Picking Pending" value="156" accentColor="#10B981" />
        <StatCard title="Packed Ready" value="89" accentColor="#10B981" />
        <StatCard title="Shipped Today" value="42" accentColor="#10B981" />
      </div>
      <DashboardQueue />
      <DashboardWidgets />
    </div>
  );
};

export default Dashboard;
