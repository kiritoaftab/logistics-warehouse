import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import PageHeader from "../../components/PageHeader";

const tabBase = "px-3 py-2 text-sm font-medium border-b-2 -mb-px transition";
const tabInactive = "text-gray-600 border-transparent hover:text-gray-900";
const tabActive = "text-blue-600 border-blue-600";

const MastersLayout = () => {
  const actions = (
    <>
      <button className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700">
        Import
      </button>
      <button className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700">
        Export
      </button>
      <button className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white">
        + Add New
      </button>
    </>
  );

  return (
    <div>
      <PageHeader
        title="WMS Masters"
        subtitle="Configure SKUs, locations, zones and operational rules"
        actions={actions}
        breadcrumbs={[
          { label: "WMS", path: "/wms" },
          { label: "Masters", path: "/wms/masters/skus" },
        ]}
      />

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex flex-wrap gap-4">
          <NavLink
            to="/wms/masters/skus"
            className={({ isActive }) =>
              `${tabBase} ${isActive ? tabActive : tabInactive}`
            }
          >
            SKUs
          </NavLink>

          <NavLink
            to="/wms/masters/users"
            className={({ isActive }) =>
              `${tabBase} ${isActive ? tabActive : tabInactive}`
            }
          >
            Users
          </NavLink>

          <NavLink
            to="/wms/masters/modules"
            className={({ isActive }) =>
              `${tabBase} ${isActive ? tabActive : tabInactive}`
            }
          >
            Modules
          </NavLink>

          <NavLink
            to="/wms/masters/permissions"
            className={({ isActive }) =>
              `${tabBase} ${isActive ? tabActive : tabInactive}`
            }
          >
            Permissions
          </NavLink>
        </div>
      </div>

      <Outlet />
    </div>
  );
};

export default MastersLayout;
