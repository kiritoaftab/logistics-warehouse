import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Download,
  ClipboardList,
  Boxes,
  Upload,
  Package,
  Truck,
  Menu,
  X,
  ReceiptText,
  Database,
  BarChart3,
  PackageCheck,
  HandGrab,
} from "lucide-react";
import Header from "./Header";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Inbound", icon: Download, path: "/inbound" },
  { name: "Putaway", icon: ClipboardList, path: "/putaway" },
  { name: "Inventory", icon: Boxes, path: "/inventory" },
  { name: "Outbound", icon: Upload, path: "/outbound" },
  { name: "Picking", icon: HandGrab, path: "/picking" },
  { name: "Packing", icon: PackageCheck, path: "/packing" },

  { name: "Shipping", icon: Truck, path: "/shipping" },
  { name: "Billing", icon: ReceiptText, path: "/shipping" },
  { name: "Masters", icon: Database, path: "/shipping" },
  { name: "Reports", icon: BarChart3, path: "/shipping" },
];

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F6F8FA] overflow-x-hidden">
      {/* Mobile Toggle */}
      <button
        className="sm:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow"
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 sm:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed sm:static top-0 left-0 h-auto w-64 bg-white border-r border-gray-200 z-40
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        sm:translate-x-0`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b">
          <h1 className="text-xl font-bold text-gray-900">
            NEXUS <span className="text-primary">WMS</span>
          </h1>
        </div>

        {/* Menu */}
        <nav className="p-3 space-y-1">
          {menuItems.map(({ name, icon: Icon, path }) => (
            <NavLink
              key={name}
              to={path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition
                ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {name}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Content Area */}
      <div className="flex-1 min-w-0">
        <Header />
        <main className="p-4 md:p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Sidebar;
