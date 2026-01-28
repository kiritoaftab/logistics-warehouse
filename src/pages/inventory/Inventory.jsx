// inventory/Inventory.jsx
import React, { useState } from "react";
import {
  Download,
  RefreshCcw,
  MoveRight,
  SlidersHorizontal,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import InventoryStockBySKU from "./InventoryStockBySKU";
import InventoryStockByLocation from "./InventoryStockByLocation";
import InventoryHolds from "./InventoryHolds";
import InventoryTransactions from "./InventoryTransactions";

const Inventory = () => {
  const [activeTab, setActiveTab] = useState("sku");

  const TabBtn = ({ id, children }) => {
    const active = activeTab === id;
    return (
      <button
        onClick={() => setActiveTab(id)}
        className={[
          "px-2 pb-3 text-sm font-medium",
          active ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500",
        ].join(" ")}
      >
        {children}
      </button>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "sku":
        return <InventoryStockBySKU />;
      case "location":
        return <InventoryStockByLocation />;

      case "holds":
        return <InventoryHolds />;

      case "transactions":
        return <InventoryTransactions />;

      default:
        return <InventoryStockBySKU />;
    }
  };

  return (
    <div className="min-h-screen  px-6 py-6">
      <div className="mx-auto 2xl:max-w-[1900px]">
        <PageHeader
          title="Inventory"
          subtitle="View stock by SKU, location, batch and holds"
          actions={
            <>
              <button className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700">
                <Download size={16} />
                Export
              </button>
              <button className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700">
                <RefreshCcw size={16} />
                Cycle Count
              </button>
              <button className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700">
                <MoveRight size={16} />
                Move Stock
              </button>
              <button className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white">
                <SlidersHorizontal size={16} />
                Adjust Stock
              </button>
            </>
          }
        />

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex items-center gap-10">
            <TabBtn id="sku">Stock by SKU</TabBtn>
            <TabBtn id="location">Stock by Location</TabBtn>
            <TabBtn id="holds">Holds / Quarantine</TabBtn>
            <TabBtn id="transactions">Transactions</TabBtn>
          </div>
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

export default Inventory;
