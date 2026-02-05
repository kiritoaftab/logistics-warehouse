// import React, { useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import PageHeader from "../components/PageHeader";
// import FilterBar from "../components/FilterBar";
// import CustTable from "../components/CusTable";
// import { MoreHorizontal, Pencil } from "lucide-react";

// const SKUMasters = () => {
//   const navigate = useNavigate();

//   // ---- Tabs (top)
//   const tabs = [
//     { label: "SKUs", value: "skus" },
//     { label: "Zones", value: "zones" },
//     { label: "Locations/Bins", value: "locations" },
//     { label: "Clients", value: "clients" },
//     { label: "Slotting Rules", value: "slotting" },
//   ];

//   const [activeTab, setActiveTab] = useState("skus");

//   // ---- Filters
//   const [filters, setFilters] = useState({
//     client: "Acme Corp",
//     category: "All Categories",
//     controls: "Any",
//     search: "",
//   });

//   // ---- Table Data (sample to match screenshot)
//   const rows = useMemo(
//     () => [
//       {
//         id: "SKU-10045",
//         skuCode: "SKU-10045",
//         barcode: "8901234567890",
//         name: "Wireless Headphones XL",
//         category: "Electronics",
//         uom: "Units",
//         controls: ["Serial"],
//         putawayZone: "High Value Cage",
//         pickRule: "FIFO",
//         status: "Active",
//       },
//       {
//         id: "SKU-20221",
//         skuCode: "SKU-20221",
//         barcode: "8909876543210",
//         name: "Organic Green Tea 100g",
//         category: "FMCG",
//         uom: "Pack",
//         controls: ["Batch", "Expiry"],
//         putawayZone: "Ambient Storage",
//         pickRule: "FEFO",
//         status: "Active",
//       },
//       {
//         id: "SKU-55001",
//         skuCode: "SKU-55001",
//         barcode: "N/A",
//         name: "Cotton T-Shirt Large",
//         category: "Apparel",
//         uom: "Units",
//         controls: [],
//         putawayZone: "Apparel Mezzanine",
//         pickRule: "FIFO",
//         status: "Active",
//       },
//       {
//         id: "SKU-99100",
//         skuCode: "SKU-99100",
//         barcode: "778899001122",
//         name: "Frozen Peas 1kg",
//         category: "Food",
//         uom: "Bag",
//         controls: ["Batch", "Expiry"],
//         putawayZone: "Cold Storage A",
//         pickRule: "FEFO",
//         status: "Inactive",
//       },
//       {
//         id: "SKU-88002",
//         skuCode: "SKU-88002",
//         barcode: "556677889900",
//         name: "Glass Vase Decorative",
//         category: "Home",
//         uom: "Box",
//         controls: ["Fragile"],
//         putawayZone: "Fragile Zone",
//         pickRule: "FIFO",
//         status: "Active",
//       },
//       {
//         id: "SKU-30045",
//         skuCode: "SKU-30045",
//         barcode: "998877665544",
//         name: "Almond Milk 1L",
//         category: "Food",
//         uom: "Carton",
//         controls: ["Batch", "Expiry"],
//         putawayZone: "Ambient Storage",
//         pickRule: "FEFO",
//         status: "Active",
//       },
//       {
//         id: "SKU-70707",
//         skuCode: "SKU-70707",
//         barcode: "111222333444",
//         name: "Office Chair Ergonomic",
//         category: "Furniture",
//         uom: "Units",
//         controls: [],
//         putawayZone: "Bulk Storage",
//         pickRule: "FIFO",
//         status: "Active",
//       },
//     ],
//     [],
//   );

//   // ---- Column config (adapt keys based on your CustTable API)
//   const columns = useMemo(
//     () => [
//       {
//         header: "SKU Code",
//         accessorKey: "skuCode",
//         cell: ({ row }) => {
//           const r = row.original;
//           return (
//             <div className="flex flex-col">
//               <button
//                 className="text-blue-600 font-medium text-sm text-left hover:underline"
//                 onClick={() => navigate(`/wms/masters/skus/${r.id}`)}
//               >
//                 {r.skuCode}
//               </button>
//               <span className="text-xs text-gray-500">{r.barcode}</span>
//             </div>
//           );
//         },
//       },
//       { header: "Name", accessorKey: "name" },
//       { header: "Category", accessorKey: "category" },
//       { header: "UOM", accessorKey: "uom" },
//       {
//         header: "Controls",
//         accessorKey: "controls",
//         cell: ({ row }) => {
//           const controls = row.original.controls || [];
//           if (!controls.length) return <span className="text-gray-400">-</span>;
//           return (
//             <div className="flex flex-wrap gap-2">
//               {controls.map((c) => (
//                 <span
//                   key={c}
//                   className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700"
//                 >
//                   {c}
//                 </span>
//               ))}
//             </div>
//           );
//         },
//       },
//       { header: "Putaway Zone", accessorKey: "putawayZone" },
//       { header: "Pick Rule", accessorKey: "pickRule" },
//       {
//         header: "Status",
//         accessorKey: "status",
//         cell: ({ row }) => {
//           const s = row.original.status;
//           const isActive = s === "Active";
//           return (
//             <span
//               className={[
//                 "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
//                 isActive
//                   ? "bg-green-100 text-green-700"
//                   : "bg-gray-100 text-gray-700",
//               ].join(" ")}
//             >
//               {s}
//             </span>
//           );
//         },
//       },
//       {
//         header: "Actions",
//         id: "actions",
//         cell: ({ row }) => {
//           const r = row.original;
//           return (
//             <div className="flex items-center justify-end gap-2">
//               <button
//                 className="p-2 rounded-md hover:bg-gray-100"
//                 onClick={() => navigate(`/wms/masters/skus/${r.id}/edit`)}
//                 title="Edit"
//               >
//                 <Pencil className="w-4 h-4" />
//               </button>
//               <button
//                 className="p-2 rounded-md hover:bg-gray-100"
//                 onClick={() => console.log("more", r.id)}
//                 title="More"
//               >
//                 <MoreHorizontal className="w-4 h-4" />
//               </button>
//             </div>
//           );
//         },
//       },
//     ],
//     [navigate],
//   );

//   // ---- FilterBar fields (adapt to your FilterBar props)
//   const filterFields = useMemo(
//     () => [
//       {
//         type: "select",
//         name: "client",
//         label: "Client",
//         value: filters.client,
//         options: ["Acme Corp", "All Clients"],
//         onChange: (v) => setFilters((p) => ({ ...p, client: v })),
//         width: "220px",
//       },
//       {
//         type: "select",
//         name: "category",
//         label: "Category",
//         value: filters.category,
//         options: [
//           "All Categories",
//           "Electronics",
//           "FMCG",
//           "Apparel",
//           "Food",
//           "Home",
//           "Furniture",
//         ],
//         onChange: (v) => setFilters((p) => ({ ...p, category: v })),
//         width: "220px",
//       },
//       {
//         type: "select",
//         name: "controls",
//         label: "Controls",
//         value: filters.controls,
//         options: ["Any", "Serial", "Batch", "Expiry", "Fragile"],
//         onChange: (v) => setFilters((p) => ({ ...p, controls: v })),
//         width: "220px",
//       },
//       {
//         type: "search",
//         name: "search",
//         placeholder: "Search SKU code / name…",
//         value: filters.search,
//         onChange: (v) => setFilters((p) => ({ ...p, search: v })),
//         width: "320px",
//       },
//     ],
//     [filters],
//   );

//   const onApply = () => {
//     // hook your API / query params here
//     console.log("apply filters", filters);
//   };

//   const onReset = () => {
//     setFilters({
//       client: "Acme Corp",
//       category: "All Categories",
//       controls: "Any",
//       search: "",
//     });
//   };

//   // ---- Header actions (Import / Export / Add New)
//   const headerActions = [
//     {
//       label: "Import",
//       variant: "secondary",
//       onClick: () => console.log("import"),
//     },
//     {
//       label: "Export",
//       variant: "secondary",
//       onClick: () => console.log("export"),
//     },
//     {
//       label: "Add New",
//       variant: "primary",
//       onClick: () => navigate("/wms/masters/skus/new"),
//     },
//   ];

//   return (
//     <div className="space-y-4">
//       <PageHeader
//         title="WMS Masters"
//         subtitle="Configure SKUs, locations, zones and operational rules"
//         tabs={tabs}
//         activeTab={activeTab}
//         onTabChange={(val) => {
//           setActiveTab(val);
//           // route switch if needed
//           // navigate(`/wms/masters/${val}`);
//         }}
//         actions={headerActions}
//       />

//       <FilterBar
//         fields={filterFields}
//         primaryAction={{ label: "Apply", onClick: onApply }}
//         secondaryAction={{ label: "Reset", onClick: onReset }}
//       />

//       <CustTable
//         columns={columns}
//         data={rows}
//         // add these only if your table supports:
//         // isLoading={loading}
//         // pagination={pagination}
//         // onRowClick={(row) => navigate(`/wms/masters/skus/${row.id}`)}
//       />
//     </div>
//   );
// };

// export default SKUMasters;
