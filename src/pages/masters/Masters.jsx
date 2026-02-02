import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import UsersTab from "./components/UsersTab";
import { ComingSoon } from "./components/helper";
import ModulesTab from "./components/ModulesTab";
import PermissionsTab from "./components/PermissionsTab";
import RolesTab from "./components/RolesTab";
import SKUsTab from "./components/SKUsTab";
import ZonesTab from "./components/ZonesTab";
import LocationsBinsTab from "./components/LocationsBinsTab";
import ClientsTab from "./components/ClientsTab";
import SlottingRulesTab from "./components/SlottingRulesTab";
import WarehouseTab from "./components/WarehouseTab";
import SupplierTab from "./components/SupplierTab";

const TABS = [
  "Users",
  "Modules",
  "Permissions",
  "Roles",
  "SKUs",
  "Zones",
  "Locations & Bins",
  "Clients",
  "Slotting Rules",
  "Warehouses",
  "suppliers",
];

const Masters = () => {
  const [activeTab, setActiveTab] = useState("Users");

  return (
    <div>
      <PageHeader
        title="WMS Masters"
        subtitle="Configure master data and access control rules"
        actions={
          <>
            <button className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700">
              Import
            </button>
            <button className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700">
              Export
            </button>
          </>
        }
      />
      <div className="mb-6 border-b border-gray-200">
        <div className="flex flex-wrap gap-4">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={[
                "px-3 py-2 text-sm font-medium border-b-2 -mb-px",
                activeTab === t
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-600 border-transparent hover:text-gray-900",
              ].join(" ")}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      {activeTab === "Users" && <UsersTab />}
      {activeTab === "Modules" && <ModulesTab />}{" "}
      {activeTab === "Permissions" && <PermissionsTab />}{" "}
      {activeTab === "Roles" && <RolesTab />}{" "}
      {activeTab === "SKUs" && <SKUsTab />}
      {activeTab === "Zones" && <ZonesTab />}
      {activeTab === "Locations & Bins" && <LocationsBinsTab />}
      {activeTab === "Clients" && <ClientsTab />}
      {activeTab === "Slotting Rules" && <SlottingRulesTab />}
      {activeTab === "Warehouses" && <WarehouseTab />}
      {activeTab === "suppliers" && <SupplierTab />}
    </div>
  );
};

export default Masters;
