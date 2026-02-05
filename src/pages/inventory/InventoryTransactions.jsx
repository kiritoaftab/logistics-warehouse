// import React, { useState } from "react";
// import FilterBar from "../components/FilterBar";
// import CusTable from "../components/CusTable";

// const TypePill = ({ type }) => {
//   const cls =
//     type === "Putaway"
//       ? "bg-green-100 text-green-700"
//       : type === "Pick"
//         ? "bg-blue-100 text-blue-700"
//         : type === "Adjustment"
//           ? "bg-orange-100 text-orange-700"
//           : type === "Move"
//             ? "bg-indigo-100 text-indigo-700"
//             : "bg-gray-100 text-gray-700";

//   return (
//     <span
//       className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${cls}`}
//     >
//       {type}
//     </span>
//   );
// };

// const InventoryTransactions = () => {
//   const [filters, setFilters] = useState({
//     dateRange: "Today",
//     txType: "All Types",
//     ref: "",
//   });

//   const handleFilterChange = (key, value) => {
//     setFilters((prev) => ({
//       ...prev,
//       [key]: value,
//     }));
//   };

//   const handleReset = () => {
//     setFilters({
//       dateRange: "Today",
//       txType: "All Types",
//       ref: "",
//     });
//   };

//   const filterConfig = [
//     {
//       key: "dateRange",
//       type: "select",
//       label: "Date Range",
//       value: filters.dateRange,
//       options: ["Today", "Yesterday", "Last 7 Days", "Last 30 Days", "Custom"],
//       className: "w-[220px]",
//     },
//     {
//       key: "txType",
//       type: "select",
//       label: "Transaction Type",
//       value: filters.txType,
//       options: ["All Types", "Putaway", "Pick", "Move", "Adjustment", "Hold"],
//       className: "w-[220px]",
//     },
//     {
//       key: "ref",
//       type: "search",
//       label: "Search Reference",
//       value: filters.ref,
//       placeholder: "Search GRN, Task ID, Order No, SKU...",
//       className: "w-[320px]",
//     },
//   ];

//   const columns = [
//     { key: "time", title: "Time" },
//     { key: "type", title: "Type", render: (r) => <TypePill type={r.type} /> },
//     {
//       key: "reference",
//       title: "Reference",
//       render: (r) => (
//         <span className="font-semibold text-blue-600">{r.reference}</span>
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
//     { key: "fromBin", title: "From Bin" },
//     { key: "toBin", title: "To Bin" },
//     { key: "qty", title: "Qty" },
//     { key: "user", title: "User" },
//     { key: "notes", title: "Notes" },
//   ];

//   const data = [
//     {
//       id: 1,
//       time: "Today, 10:45 AM",
//       type: "Putaway",
//       reference: "TSK-9921",
//       sku: "SKU-A102",
//       skuSub: "Blue T-Shirt",
//       fromBin: "Dock-01",
//       toBin: "A-01-02",
//       qty: "+50",
//       user: "John D.",
//       notes: "GRN-2023-001 completion",
//     },
//     {
//       id: 2,
//       time: "Today, 09:30 AM",
//       type: "Pick",
//       reference: "ORD-5501",
//       sku: "SKU-X500",
//       skuSub: "Running Shoes",
//       fromBin: "B-04-12",
//       toBin: "Pack-01",
//       qty: "-2",
//       user: "Sarah M.",
//       notes: "Wave Picking #45",
//     },
//     {
//       id: 3,
//       time: "Yesterday, 04:15 PM",
//       type: "Adjustment",
//       reference: "ADJ-102",
//       sku: "SKU-A102",
//       skuSub: "Blue T-Shirt",
//       fromBin: "A-01-02",
//       toBin: "-",
//       qty: "-5",
//       user: "Mike R.",
//       notes: "Damage write-off",
//     },
//     {
//       id: 4,
//       time: "Yesterday, 02:00 PM",
//       type: "Move",
//       reference: "MVE-881",
//       sku: "SKU-Z999",
//       skuSub: "Ceramic Mug",
//       fromBin: "A-01-01",
//       toBin: "B-02-05",
//       qty: "120",
//       user: "John D.",
//       notes: "Consolidation",
//     },
//     {
//       id: 5,
//       time: "Oct 24, 11:20 AM",
//       type: "Putaway",
//       reference: "TSK-9905",
//       sku: "SKU-C200",
//       skuSub: "Laptop Stand",
//       fromBin: "Dock-02",
//       toBin: "C-02-05",
//       qty: "+200",
//       user: "Alice W.",
//       notes: "-",
//     },
//     {
//       id: 6,
//       time: "Oct 24, 09:05 AM",
//       type: "Hold",
//       reference: "HLD-004",
//       sku: "SKU-X500",
//       skuSub: "Running Shoes",
//       fromBin: "B-04-12",
//       toBin: "-",
//       qty: "10",
//       user: "Mike R.",
//       notes: "Quality Check",
//     },
//   ];

//   return (
//     <div className="space-y-6">
//       <FilterBar
//         filters={filterConfig}
//         showActions={true}
//         onFilterChange={handleFilterChange}
//         onApply={() => {
//           console.log("Applying filters:", filters);
//           // Here you would typically make an API call with the filters
//         }}
//         onReset={handleReset}
//       />

//       <div className="rounded-lg border border-gray-200 bg-white">
//         <CusTable columns={columns} data={data} />
//       </div>
//     </div>
//   );
// };

// export default InventoryTransactions;

import TransactionsTab from "./components/tabs/transactions/TransactionsTab";
export default TransactionsTab;
