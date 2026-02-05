// // InventoryStockByLocation.jsx (Tab 2) - matches your screenshot structure

// import React, { useState } from "react";
// import FilterBar from "../components/FilterBar";
// import CusTable from "../components/CusTable";

// const CapacityBar = ({ pct }) => {
//   const color =
//     pct >= 100 ? "bg-red-600" : pct >= 90 ? "bg-orange-500" : "bg-blue-600";

//   return (
//     <div className="flex items-center gap-3">
//       <div className="h-2 w-[180px] rounded-full bg-gray-100">
//         <div
//           className={`h-2 rounded-full ${color}`}
//           style={{ width: `${Math.min(100, pct)}%` }}
//         />
//       </div>
//       <div className="text-sm text-gray-500">{pct}%</div>
//     </div>
//   );
// };

// const InventoryStockByLocation = () => {
//   const [filterState, setFilterState] = useState({
//     warehouse: "WH-NYC-01",
//     client: "Acme Corp",
//     zone: "All Zones",
//     bin: "",
//     capacity: "All",
//   });

//   const filters = [
//     {
//       key: "warehouse",
//       type: "select",
//       label: "Warehouse",
//       value: filterState.warehouse,
//       options: ["WH-NYC-01", "WH-NYC-02"],
//       className: "w-[140px]",
//     },
//     {
//       key: "client",
//       type: "select",
//       label: "Client",
//       value: filterState.client,
//       options: ["Acme Corp", "All Clients"],
//       className: "w-[140px]",
//     },
//     {
//       key: "zone",
//       type: "select",
//       label: "Zone",
//       value: filterState.zone,
//       options: ["All Zones", "Zone A", "Zone B", "Zone C"],
//       className: "w-[120px]",
//     },
//     {
//       key: "bin",
//       type: "search",
//       label: "Bin / Location",
//       value: filterState.bin,
//       placeholder: "Search Bin ID (e.g. A-01-02)...",
//       className: "w-[220px]",
//     },
//     {
//       key: "capacity",
//       type: "select",
//       label: "Capacity Status",
//       value: filterState.capacity,
//       options: ["All", "Normal", "High Utilization", "Full"],
//       className: "w-[140px]",
//     },
//   ];

//   const columns = [
//     { key: "zone", title: "Zone" },
//     {
//       key: "binId",
//       title: "Bin ID",
//       render: (r) => (
//         <span className="font-semibold text-blue-600">{r.binId}</span>
//       ),
//     },
//     {
//       key: "capacityUsed",
//       title: "Capacity Used",
//       render: (r) => <CapacityBar pct={r.capacityUsed} />,
//     },
//     { key: "skuCount", title: "SKU Count" },
//     { key: "availableQty", title: "Available Qty" },
//     { key: "holdQty", title: "Hold Qty" },
//     {
//       key: "action",
//       title: "Actions",
//       render: () => (
//         <button className="rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-700">
//           View Contents
//         </button>
//       ),
//     },
//   ];

//   const data = [
//     {
//       id: 1,
//       zone: "Zone A",
//       binId: "A-01-01",
//       capacityUsed: 85,
//       skuCount: 3,
//       availableQty: "1,250",
//       holdQty: 0,
//     },
//     {
//       id: 2,
//       zone: "Zone A",
//       binId: "A-01-02",
//       capacityUsed: 95,
//       skuCount: 1,
//       availableQty: "500",
//       holdQty: 50,
//     },
//     {
//       id: 3,
//       zone: "Zone B",
//       binId: "B-04-12",
//       capacityUsed: 45,
//       skuCount: 12,
//       availableQty: "320",
//       holdQty: 0,
//     },
//     {
//       id: 4,
//       zone: "Zone B",
//       binId: "B-04-13",
//       capacityUsed: 10,
//       skuCount: 2,
//       availableQty: "45",
//       holdQty: 0,
//     },
//     {
//       id: 5,
//       zone: "Zone C",
//       binId: "C-02-05",
//       capacityUsed: 100,
//       skuCount: 1,
//       availableQty: "200",
//       holdQty: 200,
//     },
//     {
//       id: 6,
//       zone: "Zone C",
//       binId: "C-02-06",
//       capacityUsed: 0,
//       skuCount: 0,
//       availableQty: "0",
//       holdQty: 0,
//     },
//   ];

//   return (
//     <div className="space-y-6">
//       <FilterBar
//         filters={filters}
//         showActions
//         onFilterChange={(k, v) => setF((s) => ({ ...s, [k]: v }))}
//         onApply={() => {}}
//         onReset={() =>
//           setF({
//             warehouse: "WH-NYC-01",
//             client: "Acme Corp",
//             zone: "All Zones",
//             Location: "Serach Bin ID (e.g. A-01-02)...)",

//             Status: "All ",
//           })
//         }
//       />

//       <div className="rounded-lg border border-gray-200 bg-white">
//         <CusTable columns={columns} data={data} />
//       </div>
//     </div>
//   );
// };

// export default InventoryStockByLocation;
import StockByLocationTab from "./components/tabs/stockByLocation/StockByLocationTab";
export default StockByLocationTab;
