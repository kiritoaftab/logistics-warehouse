// // InventoryHolds.jsx (Tab 3) - matches your screenshot structure

// import React, { useState } from "react";
// import FilterBar from "../../../../components/FilterBar";
// import CusTable from "../../../../components/CusTable";

// const StatusPill = ({ status }) => {
//   const cls =
//     status === "Active"
//       ? "bg-orange-100 text-orange-700"
//       : "bg-green-100 text-green-700";
//   return (
//     <span
//       className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${cls}`}
//     >
//       {status}
//     </span>
//   );
// };

// const InventoryHolds = () => {
//   const [filterState, setFilterState] = useState({
//     warehouse: "WH-NYC-01",
//     client: "Acme Corp",
//     search: "",
//     location: "",
//     status: "Active",
//   });

// const filters = [
//   {
//     key: "warehouse",
//     type: "select",
//     label: "Warehouse",
//     value: filterState.warehouse,
//     options: ["WH-NYC-01", "WH-NYC-02"],
//     className: "w-[140px]",
//   },
//   {
//     key: "client",
//     type: "select",
//     label: "Client",
//     value: filterState.client,
//     options: ["Acme Corp", "All Clients"],
//     className: "w-[140px]",
//   },
//   {
//     key: "search",
//     type: "search",
//     label: "Search",
//     value: filterState.search,
//     placeholder: "Hold ID, SKU or Reason...",
//     className: "w-[220px]",
//   },
//   {
//     key: "location",
//     type: "search",
//     label: "Location",
//     value: filterState.location,
//     placeholder: "e.g. ZONE-Q-01",
//     className: "w-[160px]",
//   },
//   {
//     key: "status",
//     type: "select",
//     label: "Status",
//     value: filterState.status,
//     options: ["Active", "Released"],
//     className: "w-[120px]",
//   },
// ];

//   const columns = [
//     {
//       key: "holdId",
//       title: "Hold ID",
//       render: (r) => (
//         <span className="font-semibold text-blue-600">{r.holdId}</span>
//       ),
//     },
//     {
//       key: "sku",
//       title: "SKU",
//       render: (r) => (
//         <div className="leading-tight">
//           <div className="font-semibold text-gray-900">{r.sku}</div>
//           <div className="text-xs text-gray-500">{r.skuSub}</div>
//         </div>
//       ),
//     },
//     { key: "qty", title: "Qty" },
//     { key: "location", title: "Location" },
//     { key: "reason", title: "Hold Reason" },
//     { key: "createdBy", title: "Created By" },
//     { key: "createdTime", title: "Created Time" },
//     {
//       key: "status",
//       title: "Status",
//       render: (r) => <StatusPill status={r.status} />,
//     },
//     {
//       key: "actions",
//       title: "Actions",
//       render: (r) => (
//         <div className="flex items-center justify-start gap-2">
//           <button className="rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm">
//             View
//           </button>
//           {r.status === "Active" && (
//             <button className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white">
//               Release
//             </button>
//           )}
//           {r.canDamage && (
//             <button className="rounded-md bg-red-500 px-3 py-1.5 text-sm text-white">
//               Damage
//             </button>
//           )}
//         </div>
//       ),
//     },
//   ];

//   const data = [
//     {
//       id: 1,
//       holdId: "HLD-9021",
//       sku: "IPH-14-BLK",
//       skuSub: "iPhone 14 Black 128GB",
//       qty: 50,
//       location: "ZONE-Q-01",
//       reason: "Quality Check",
//       createdBy: "Sarah J.",
//       createdTime: "Today, 10:30 AM",
//       status: "Active",
//       canDamage: false,
//     },
//     {
//       id: 2,
//       holdId: "HLD-8845",
//       sku: "SNK-CHOC-BAR",
//       skuSub: "Snickers Bar 50g",
//       qty: 150,
//       location: "ZONE-B-14",
//       reason: "Possible Expiry",
//       createdBy: "Mike T.",
//       createdTime: "Yesterday, 4:15 PM",
//       status: "Active",
//       canDamage: false,
//     },
//     {
//       id: 3,
//       holdId: "HLD-8810",
//       sku: "NKE-AIR-01",
//       skuSub: "Nike Air Max 90",
//       qty: 12,
//       location: "ZONE-R-02",
//       reason: "Damaged Packaging",
//       createdBy: "Priya K.",
//       createdTime: "Oct 24, 2023",
//       status: "Active",
//       canDamage: true,
//     },
//     {
//       id: 4,
//       holdId: "HLD-7550",
//       sku: "MED-KIT-01",
//       skuSub: "First Aid Kit Standard",
//       qty: 200,
//       location: "ZONE-Q-05",
//       reason: "Recall Notice",
//       createdBy: "Robert L.",
//       createdTime: "Oct 20, 2023",
//       status: "Released",
//       canDamage: false,
//     },
//     {
//       id: 5,
//       holdId: "HLD-7210",
//       sku: "SAM-GAL-S23",
//       skuSub: "Samsung Galaxy S23",
//       qty: 5,
//       location: "ZONE-A-09",
//       reason: "Customer Return",
//       createdBy: "Maria G.",
//       createdTime: "Oct 18, 2023",
//       status: "Released",
//       canDamage: false,
//     },
//   ];

//   return (
//     <div className="space-y-6">
//       <FilterBar
//         filters={filters}
//         showActions
//         onFilterChange={(k, v) => setFilterState((s) => ({ ...s, [k]: v }))}
//         onApply={() => {}}
//         onReset={() =>
//           setFilterState({
//             warehouse: "WH-NYC-01",
//             client: "Acme Corp",
//             search: "",
//             location: "",
//             status: "Active",
//           })
//         }
//       />

//       <div className="rounded-lg border border-gray-200 bg-white">
//         <CusTable columns={columns} data={data} />
//       </div>
//     </div>
//   );
// };

// export default InventoryHolds;
import { useEffect, useState } from "react";
import CusTable from "../../../../components/CusTable";
import FilterBar from "../../../../components/FilterBar";
import Pagination from "../../../../components/Pagination";
import http from "@/api/http";
import {
  createInventoryHold,
  deleteInventoryHold,
  getInventoryHolds,
  releaseInventoryHold,
} from "../../heper";

const StatusPill = ({ status }) => {
  const cls =
    status === "ACTIVE"
      ? "bg-orange-100 text-orange-700"
      : "bg-green-100 text-green-700";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${cls}`}>
      {status}
    </span>
  );
};

const InventoryHolds = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    warehouse_id: "",
    client_id: "",
    location_id: "",
    status: "",
    search: "",
    page: 1,
    limit: 10,
  });

  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 10,
  });

  const [warehouses, setWarehouses] = useState([]);
  const [clients, setClients] = useState([]);
  const [locations, setLocations] = useState([]);

  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    inventory_id: "",
    qty: "",
    hold_reason: "QUALITY_CHECK",
    hold_notes: "",
  });

  const fetchWarehouses = async () => {
    const res = await http.get("/warehouses");
    setWarehouses(res?.data?.data || []);
  };

  const fetchClients = async () => {
    const res = await http.get("/clients?page=1&limit=50");
    setClients(res?.data?.data?.clients || []);
  };

  const fetchLocations = async () => {
    const res = await http.get("/locations?page=1&limit=50");
    setLocations(res?.data?.data?.locations || []);
  };

  const fetchHolds = async () => {
    setLoading(true);
    try {
      const res = await getInventoryHolds(filters);

      setRows(res?.data?.data || []);
      setPagination(res?.data?.pagination || {});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
    fetchClients();
    fetchLocations();
  }, []);

  useEffect(() => {
    fetchHolds();
  }, [filters]);

  const filterConfig = [
    {
      key: "warehouse_id",
      type: "select",
      label: "Warehouse",
      value: filters.warehouse_id,
      options: warehouses.map((w) => ({
        label: w.warehouse_name,
        value: w.id,
      })),
    },
    {
      key: "client_id",
      type: "select",
      label: "Client",
      value: filters.client_id,
      options: clients.map((c) => ({
        label: c.client_name,
        value: c.id,
      })),
    },
    {
      key: "location_id",
      type: "select",
      label: "Location",
      value: filters.location_id,
      options: locations.map((l) => ({
        label: l.location_code,
        value: l.id,
      })),
    },
    {
      key: "status",
      type: "select",
      label: "Status",
      value: filters.status,
      options: [
        { label: "Active", value: "ACTIVE" },
        { label: "Released", value: "RELEASED" },
      ],
    },
  ];
  const handleReleaseHold = async (row) => {
    if (!window.confirm("Release this inventory hold?")) return;

    try {
      await releaseInventoryHold(row.id, {
        release_notes: "Released from UI",
      });

      fetchHolds();
    } catch (err) {
      alert("Failed to release hold");
    }
  };

  const handleDeleteHold = async (row) => {
    if (!window.confirm("Delete this inventory hold?")) return;

    try {
      await deleteInventoryHold(row.id);

      fetchHolds();
    } catch (err) {
      alert("Failed to delete hold");
    }
  };

  const handleCreateHold = async () => {
    try {
      await createInventoryHold({
        inventory_id: Number(form.inventory_id),
        qty: Number(form.qty),
        hold_reason: form.hold_reason,
        hold_notes: form.hold_notes,
      });

      setShowCreate(false);
      setForm({
        inventory_id: "",
        qty: "",
        hold_reason: "QUALITY_CHECK",
        hold_notes: "",
      });

      fetchHolds();
    } catch (err) {
      alert("Failed to create inventory hold");
    }
  };

  const tableData = rows.map((r) => ({
    id: r.id,
    holdId: r.hold_id,
    sku: r.inventory?.sku?.sku_code,
    skuSub: r.inventory?.sku?.sku_name,
    qty: r.qty,
    location: r.inventory?.location?.location_code,
    reason: r.hold_reason,
    createdBy: r.creator?.username,
    createdTime: new Date(r.created_at).toLocaleString(),
    status: r.status,
  }));

  const columns = [
    {
      key: "holdId",
      title: "Hold ID",
      render: (r) => (
        <span className="font-semibold text-blue-600">{r.holdId}</span>
      ),
    },
    {
      key: "sku",
      title: "SKU",
      render: (r) => (
        <div>
          <div className="font-semibold">{r.sku}</div>
          <div className="text-xs text-gray-500">{r.skuSub}</div>
        </div>
      ),
    },
    { key: "qty", title: "Qty" },
    { key: "location", title: "Location" },
    { key: "reason", title: "Reason" },
    { key: "createdBy", title: "Created By" },
    { key: "createdTime", title: "Created Time" },
    {
      key: "status",
      title: "Status",
      render: (r) => <StatusPill status={r.status} />,
    },
    {
      key: "actions",
      title: "Actions",
      render: (r) => (
        <div className="flex gap-2">
          {r.status === "ACTIVE" && (
            <button
              onClick={() => handleReleaseHold(r)}
              className="rounded bg-blue-600 px-3 py-1 text-sm text-white"
            >
              Release
            </button>
          )}

          <button
            onClick={() => handleDeleteHold(r)}
            className="rounded bg-red-500 px-3 py-1 text-sm text-white"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <FilterBar
        filters={filterConfig}
        onFilterChange={(k, v) => {
          console.log(k, v);
          setFilters((s) => ({ ...s, [k]: v, page: 1 }));
        }}
        onReset={() =>
          setFilters({
            warehouse_id: "",
            client_id: "",
            location_id: "",
            status: "",
            search: "",
            page: 1,
            limit: 10,
          })
        }
      />
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="text-lg font-semibold">Inventory Holds</h2>

        <button
          onClick={() => setShowCreate(true)}
          className="rounded bg-blue-600 px-4 py-2 text-sm text-white"
        >
          + Create Hold
        </button>
      </div>
      {showCreate && (
        <div className="border-b bg-gray-50 p-4">
          <div className="grid grid-cols-4 gap-3">
            <input
              type="number"
              placeholder="Inventory ID"
              value={form.inventory_id}
              onChange={(e) =>
                setForm({ ...form, inventory_id: e.target.value })
              }
              className="rounded border px-3 py-2 text-sm"
            />

            <input
              type="number"
              placeholder="Qty"
              value={form.qty}
              onChange={(e) => setForm({ ...form, qty: e.target.value })}
              className="rounded border px-3 py-2 text-sm"
            />

            <select
              value={form.hold_reason}
              onChange={(e) =>
                setForm({ ...form, hold_reason: e.target.value })
              }
              className="rounded border px-3 py-2 text-sm"
            >
              <option value="QUALITY_CHECK">QUALITY_CHECK</option>
              <option value="DAMAGED">DAMAGED</option>
              <option value="EXPIRY_RISK">EXPIRY_RISK</option>
              <option value="RECALL">RECALL</option>
              <option value="CUSTOMER_DISPUTE">CUSTOMER_DISPUTE</option>
              <option value="OTHER">OTHER</option>
            </select>

            <input
              placeholder="Hold Notes"
              value={form.hold_notes}
              onChange={(e) => setForm({ ...form, hold_notes: e.target.value })}
              className="rounded border px-3 py-2 text-sm"
            />
          </div>

          <div className="mt-3 flex gap-2">
            <button
              onClick={handleCreateHold}
              className="rounded bg-blue-600 px-4 py-2 text-sm text-white"
            >
              Save
            </button>

            <button
              onClick={() => setShowCreate(false)}
              className="rounded border px-4 py-2 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <CusTable columns={columns} data={tableData} loading={loading} />

      <Pagination
        pagination={pagination}
        onPageChange={(p) =>
          setFilters((s) => ({
            ...s,
            page: p,
          }))
        }
      />
    </div>
  );
};

export default InventoryHolds;
