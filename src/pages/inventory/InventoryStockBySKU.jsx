// // inventory/InventoryStockBySKU.jsx
// import React, { useState, useEffect } from "react";
// import FilterBar from "../components/FilterBar";
// import CusTable from "../components/CusTable";
// import http from "../../api/http";
// import { useToast } from "../components/toast/ToastProvider";

// const Pill = ({ text }) => {
//   const map = {
//     Healthy: "bg-green-100 text-green-700",
//     "Low Stock": "bg-orange-100 text-orange-700",
//     "Expiry Risk": "bg-red-100 text-red-700",
//     "QC Hold": "bg-orange-100 text-orange-700",
//     "Out of Stock": "bg-gray-100 text-gray-600",
//     HEALTHY: "bg-green-100 text-green-700",
//     LOW_STOCK: "bg-orange-100 text-orange-700",
//     EXPIRY_RISK: "bg-red-100 text-red-700",
//     HOLD: "bg-orange-100 text-orange-700",
//     DAMAGED: "bg-red-100 text-red-700",
//     OUT_OF_STOCK: "bg-gray-100 text-gray-600",
//   };

//   const statusTextMap = {
//     HEALTHY: "Healthy",
//     LOW_STOCK: "Low Stock",
//     EXPIRY_RISK: "Expiry Risk",
//     HOLD: "QC Hold",
//     DAMAGED: "Damaged",
//     OUT_OF_STOCK: "Out of Stock",
//   };

//   const displayText = statusTextMap[text] || text;

//   return (
//     <span
//       className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${map[text] || map[displayText] || "bg-gray-100 text-gray-700"}`}
//     >
//       {displayText}
//     </span>
//   );
// };

// const InventoryStockBySKU = () => {
//   const toast = useToast();
//   const [loading, setLoading] = useState(true);
//   const [inventoryData, setInventoryData] = useState([]);
//   const [summary, setSummary] = useState({
//     total_on_hand: 0,
//     total_available: 0,
//     total_hold: 0,
//     total_allocated: 0,
//     total_damaged: 0,
//     locations: 0,
//   });

//   const [f, setF] = useState({
//     warehouse: "1", // Default to warehouse ID 1
//     client: "All",
//     skuSearch: "",
//     zone: "All",
//     stockStatus: "All",
//   });

//   const [warehouses, setWarehouses] = useState([
//     { value: "1", label: "WH001 - Main Mumbai Warehouse" },
//   ]);
//   const [clients, setClients] = useState(["All"]);
//   const [zones, setZones] = useState(["All"]);

//   // Fetch initial data on component mount
//   useEffect(() => {
//     fetchInitialData();
//   }, []);

//   // Fetch inventory data when filters change
//   useEffect(() => {
//     fetchInventoryData();
//   }, [f.warehouse, f.client, f.zone, f.stockStatus, f.skuSearch]);

//   const fetchInitialData = async () => {
//     try {
//       await Promise.all([fetchWarehouses(), fetchClients(), fetchZones()]);
//     } catch (error) {
//       console.error("Error fetching initial data:", error);
//     }
//   };

//   const fetchWarehouses = async () => {
//     try {
//       const response = await http.get("/warehouses");
//       // console.log("Warehouses API response:", response.data);

//       if (response.data.success) {
//         // FIXED: Direct array response, not nested
//         const warehouseList = response.data.data || [];
//         // console.log("Warehouse list:", warehouseList);

//         const warehouseOptions = warehouseList.map((w) => ({
//           value: w.id.toString(),
//           label: `${w.warehouse_code} - ${w.warehouse_name}`,
//         }));

//         // console.log("Warehouse options:", warehouseOptions);

//         if (warehouseOptions.length > 0) {
//           setWarehouses(warehouseOptions);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching warehouses:", error);
//       toast.error("Failed to load warehouses");
//     }
//   };

//   const fetchClients = async () => {
//     try {
//       const response = await http.get("/clients");
//       // console.log("Clients API response:", response.data);

//       if (response.data.success) {
//         // FIXED: Direct array response
//         const clientList = response.data.data || [];
//         setClients(clientList?.clients);
//       }
//     } catch (error) {
//       console.error("Error fetching clients:", error);
//       toast.error("Failed to load clients");
//     }
//   };

//   const fetchZones = async () => {
//     try {
//       // Try to get zones from locations API
//       const response = await http.get("/locations");
//       // console.log("Locations API response:", response.data);

//       if (response.data.success) {
//         // FIXED: Check the actual response structure
//         const locations =
//           response.data.data?.locations || response.data.data || [];
//         // console.log("Locations data:", locations);

//         const uniqueZones = [
//           "All",
//           ...new Set(
//             locations
//               .map((loc) => loc.zone)
//               .filter(Boolean)
//               .sort(),
//           ),
//         ];
//         // console.log("Unique zones:", uniqueZones);
//         setZones(uniqueZones);
//       }
//     } catch (error) {
//       console.error("Error fetching zones:", error);
//       setZones(["All", "A", "B", "C", "D"]);
//     }
//   };

//   const fetchInventoryData = async () => {
//     try {
//       setLoading(true);
//       // console.log("Fetching inventory with filters:", f);

//       // Test different inventory endpoints
//       const endpoints = [
//         "/inventory",
//         "/inventory/stock",
//         "/inventory/items",
//         "/inventory/all",
//       ];

//       let inventoryResponse = null;

//       // Try each endpoint until we get a successful response
//       for (const endpoint of endpoints) {
//         try {
//           // console.log(`Trying endpoint: ${endpoint}`);

//           // Build query parameters
//           const params = new URLSearchParams();

//           // Always include warehouse_id if specified
//           if (f.warehouse && f.warehouse !== "All") {
//             params.append("warehouse_id", f.warehouse);
//           }

//           // Add other filters if not "All"
//           if (f.client && f.client !== "All") {
//             params.append("client_name", f.client);
//           }

//           if (f.zone && f.zone !== "All") {
//             params.append("zone", f.zone);
//           }

//           if (f.stockStatus && f.stockStatus !== "All") {
//             // Convert display status to backend status
//             const statusMap = {
//               Healthy: "HEALTHY",
//               "Low Stock": "LOW_STOCK",
//               "Expiry Risk": "EXPIRY_RISK",
//               "QC Hold": "HOLD",
//               "Out of Stock": "OUT_OF_STOCK",
//               Damaged: "DAMAGED",
//             };
//             params.append(
//               "status",
//               statusMap[f.stockStatus] || f.stockStatus.toUpperCase(),
//             );
//           }

//           if (f.skuSearch) {
//             params.append("search", f.skuSearch);
//           }

//           const queryString = params.toString();
//           const url = `${endpoint}${queryString ? `?${queryString}` : ""}`;

//           // console.log(`Making request to: ${url}`);

//           const response = await http.get(url);
//           // console.log(`Response from ${endpoint}:`, response.data);

//           if (response.data.success) {
//             inventoryResponse = response.data;
//             // console.log(`Found inventory at ${endpoint}`);
//             break;
//           }
//         } catch (error) {
//           console.log(`Endpoint ${endpoint} failed:`, error.message);
//         }
//       }

//       if (!inventoryResponse) {
//         throw new Error("No inventory endpoint returned data");
//       }

//       // Process the inventory response
//       const inventory =
//         inventoryResponse.data?.inventory ||
//         inventoryResponse.data?.items ||
//         inventoryResponse.data ||
//         [];

//       const summaryData = inventoryResponse.data?.summary || {
//         total_on_hand: inventory.reduce(
//           (sum, item) => sum + (item.on_hand_qty || item.on_hand || 0),
//           0,
//         ),
//         total_available: inventory.reduce(
//           (sum, item) => sum + (item.available_qty || item.available || 0),
//           0,
//         ),
//         total_hold: inventory.reduce(
//           (sum, item) => sum + (item.hold_qty || item.hold || 0),
//           0,
//         ),
//         total_allocated: inventory.reduce(
//           (sum, item) => sum + (item.allocated_qty || item.allocated || 0),
//           0,
//         ),
//         total_damaged: inventory.reduce(
//           (sum, item) => sum + (item.damaged_qty || item.damaged || 0),
//           0,
//         ),
//         locations: new Set(
//           inventory.map((item) => item.location_id).filter(Boolean),
//         ).size,
//       };

//       setInventoryData(inventory);
//       setSummary(summaryData);

//       // Extract zones from inventory data if we have data
//       if (inventory.length > 0) {
//         const zonesFromInventory = [
//           "All",
//           ...new Set(
//             inventory
//               .map((item) => item.location?.zone || item.zone)
//               .filter(Boolean)
//               .sort(),
//           ),
//         ];
//         // console.log("Zones from inventory:", zonesFromInventory);

//         if (zonesFromInventory.length > 1) {
//           setZones(zonesFromInventory);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching inventory:", error);
//       console.error("Error details:", error.message);

//       // Create dummy data for testing if no API data
//       const dummyData = createDummyData();
//       setInventoryData(dummyData);
//       setSummary({
//         total_on_hand: 100,
//         total_available: 90,
//         total_hold: 5,
//         total_allocated: 5,
//         total_damaged: 0,
//         locations: 3,
//       });

//       toast.info("Using sample data. Please check API endpoints.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Create dummy data for testing
//   const createDummyData = () => {
//     return [
//       {
//         id: 1,
//         sku_id: 1,
//         sku: {
//           sku_code: "SKU001",
//           sku_name: "iPhone 14 Pro",
//           category: "Electronics",
//           uom: "EACH",
//         },
//         location: {
//           location_code: "A-01-01-01",
//           zone: "A",
//         },
//         on_hand_qty: 50,
//         available_qty: 45,
//         hold_qty: 2,
//         allocated_qty: 3,
//         damaged_qty: 0,
//         status: "HEALTHY",
//         warehouse_id: 1,
//       },
//       {
//         id: 2,
//         sku_id: 2,
//         sku: {
//           sku_code: "SKU002",
//           sku_name: "Samsung Galaxy S23",
//           category: "Electronics",
//           uom: "EACH",
//         },
//         location: {
//           location_code: "B-01-01-01",
//           zone: "B",
//         },
//         on_hand_qty: 30,
//         available_qty: 25,
//         hold_qty: 3,
//         allocated_qty: 2,
//         damaged_qty: 0,
//         status: "LOW_STOCK",
//         warehouse_id: 1,
//       },
//       {
//         id: 3,
//         sku_id: 3,
//         sku: {
//           sku_code: "SKU003",
//           sku_name: "Lenovo Laptop",
//           category: "Electronics",
//           uom: "EACH",
//         },
//         location: {
//           location_code: "C-01-01-01",
//           zone: "C",
//         },
//         on_hand_qty: 20,
//         available_qty: 20,
//         hold_qty: 0,
//         allocated_qty: 0,
//         damaged_qty: 0,
//         status: "HEALTHY",
//         warehouse_id: 1,
//       },
//     ];
//   };

//   const filters = [
//     {
//       key: "warehouse",
//       type: "select",
//       label: "Warehouse",
//       value: f.warehouse,
//       options: warehouses,
//       className: "w-[240px]",
//     },
//     {
//       key: "client",
//       type: "select",
//       label: "Client",
//       value: f.client,
//       options: clients,
//       className: "w-[180px]",
//     },
//     {
//       key: "skuSearch",
//       type: "search",
//       label: "SKU Search",
//       value: f.skuSearch,
//       placeholder: "Search SKU Code or Name...",
//       className: "w-[260px]",
//     },
//     {
//       key: "zone",
//       type: "select",
//       label: "Zone",
//       value: f.zone,
//       options: zones,
//       className: "w-[120px]",
//     },
//     {
//       key: "stockStatus",
//       type: "select",
//       label: "Stock Status",
//       value: f.stockStatus,
//       options: [
//         "All",
//         "Healthy",
//         "Low Stock",
//         "Expiry Risk",
//         "QC Hold",
//         "Out of Stock",
//         "Damaged",
//       ],
//       className: "w-[160px]",
//     },
//   ];

//   // Transform API data to table format
//   const transformDataForTable = (inventoryData) => {
//     if (
//       !inventoryData ||
//       !Array.isArray(inventoryData) ||
//       inventoryData.length === 0
//     ) {
//       return [];
//     }

//     // console.log("Transforming inventory data:", inventoryData);

//     // Group by SKU to show aggregated view
//     const skuMap = new Map();

//     inventoryData.forEach((item, index) => {
//       // console.log(`Processing item ${index}:`, item);

//       const skuId = item.sku_id || item.sku?.id || `sku-${index}`;
//       const skuCode = item.sku?.sku_code || `SKU-${item.sku_id || index}`;
//       const skuName = item.sku?.sku_name || "Unknown SKU";

//       if (!skuMap.has(skuId)) {
//         skuMap.set(skuId, {
//           id: item.id || skuId,
//           sku: skuCode,
//           name: skuName,
//           category: item.sku?.category || "N/A",
//           uom: item.sku?.uom || "EA",
//           onHand: 0,
//           available: 0,
//           hold: 0,
//           allocated: 0,
//           damaged: 0,
//           locations: new Set(),
//           status: item.status || "HEALTHY",
//           // For image placeholder
//           img: `https://ui-avatars.com/api/?name=${encodeURIComponent(skuCode)}&background=random&color=fff`,
//         });
//       }

//       const skuData = skuMap.get(skuId);
//       skuData.onHand += item.on_hand_qty || item.on_hand || 0;
//       skuData.available += item.available_qty || item.available || 0;
//       skuData.hold += item.hold_qty || item.hold || 0;
//       skuData.allocated += item.allocated_qty || item.allocated || 0;
//       skuData.damaged += item.damaged_qty || item.damaged || 0;

//       if (item.location?.location_code) {
//         skuData.locations.add(item.location.location_code);
//       } else if (item.location_code) {
//         skuData.locations.add(item.location_code);
//       }

//       // Determine overall status (take the worst status)
//       const statusPriority = {
//         DAMAGED: 5,
//         OUT_OF_STOCK: 4,
//         EXPIRY_RISK: 3,
//         LOW_STOCK: 2,
//         HOLD: 2,
//         HEALTHY: 1,
//       };

//       const currentPriority = statusPriority[skuData.status] || 0;
//       const newPriority = statusPriority[item.status] || 0;

//       if (newPriority > currentPriority) {
//         skuData.status = item.status;
//       }
//     });

//     // Convert map to array and format numbers
//     const result = Array.from(skuMap.values()).map((sku) => ({
//       ...sku,
//       onHand: sku.onHand.toLocaleString(),
//       available: sku.available.toLocaleString(),
//       hold: sku.hold.toLocaleString(),
//       allocated: sku.allocated.toLocaleString(),
//       damaged: sku.damaged.toLocaleString(),
//       locations: Array.from(sku.locations).join(", ") || "No location",
//       risk: sku.status,
//       raw: sku, // Keep raw data for actions
//     }));

//     // console.log("Transformed table data:", result);
//     return result;
//   };

//   const tableData = transformDataForTable(inventoryData);

//   const columns = [
//     {
//       key: "skuDetails",
//       title: "SKU Details",
//       render: (r) => (
//         <div className="flex items-center gap-3">
//           <div className="h-10 w-10 overflow-hidden rounded-md border border-gray-200 bg-white flex items-center justify-center">
//             <img
//               src={r.img}
//               alt={r.sku}
//               className="h-full w-full object-cover"
//               onError={(e) => {
//                 e.target.onerror = null;
//                 e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(r.sku)}&background=random&color=fff`;
//               }}
//             />
//           </div>
//           <div className="leading-tight">
//             <div className="text-sm font-semibold text-blue-600 hover:underline cursor-pointer">
//               {r.sku}
//             </div>
//             <div className="text-xs text-gray-500">{r.name}</div>
//             <div className="text-xs text-gray-400">
//               {r.category} • {r.uom}
//             </div>
//           </div>
//         </div>
//       ),
//     },
//     {
//       key: "onHand",
//       title: "On-hand",
//       render: (r) => <span className="font-medium">{r.onHand}</span>,
//     },
//     {
//       key: "available",
//       title: "Available",
//       render: (r) => (
//         <span className="font-medium text-green-600">{r.available}</span>
//       ),
//     },
//     {
//       key: "hold",
//       title: "Hold",
//       render: (r) => (
//         <span className="font-medium text-orange-600">{r.hold}</span>
//       ),
//     },
//     {
//       key: "allocated",
//       title: "Allocated",
//       render: (r) => (
//         <span className="font-medium text-blue-600">{r.allocated}</span>
//       ),
//     },
//     {
//       key: "damaged",
//       title: "Damaged",
//       render: (r) => (
//         <span className="font-medium text-red-600">{r.damaged}</span>
//       ),
//     },
//     {
//       key: "locations",
//       title: "Locations",
//       render: (r) => (
//         <div
//           className="text-xs text-gray-600 max-w-[120px] truncate"
//           title={r.locations}
//         >
//           {r.locations}
//         </div>
//       ),
//     },
//     {
//       key: "risk",
//       title: "Status",
//       render: (r) => <Pill text={r.risk} />,
//     },
//     {
//       key: "actions",
//       title: "Actions",
//       render: (r) => (
//         <div className="flex gap-2">
//           <button
//             onClick={() => handleViewSKU(r)}
//             className="rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
//           >
//             View
//           </button>
//           <button
//             onClick={() => handleAdjustStock(r)}
//             className="rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm text-blue-700 hover:bg-blue-100"
//           >
//             Adjust
//           </button>
//         </div>
//       ),
//     },
//   ];

//   const handleViewSKU = (sku) => {
//     console.log("View SKU details:", sku);
//     toast.info(`Viewing ${sku.sku} details`);
//     // You would navigate to SKU details page here
//   };

//   const handleAdjustStock = (sku) => {
//     console.log("Adjust stock for:", sku);
//     toast.info(`Adjust stock for ${sku.sku}`);
//     // Open stock adjustment modal
//   };

//   const handleRefresh = () => {
//     fetchInventoryData();
//   };

//   // Test API manually
//   const testApiManually = async () => {
//     toast.info("Testing APIs...");

//     const endpoints = [
//       { name: "Warehouses", url: "/warehouses" },
//       { name: "Clients", url: "/clients" },
//       { name: "Locations", url: "/locations" },
//       { name: "Inventory", url: "/inventory" },
//       { name: "Inventory Stock", url: "/inventory/stock" },
//       { name: "Inventory Items", url: "/inventory/items" },
//     ];

//     for (const endpoint of endpoints) {
//       try {
//         const response = await http.get(endpoint.url);
//         console.log(`${endpoint.name} API:`, response.data);
//         toast.success(
//           `${endpoint.name}: ${response.data.success ? "Success" : "Failed"}`,
//         );
//       } catch (error) {
//         console.log(`${endpoint.name} API failed:`, error.message);
//         toast.error(`${endpoint.name}: ${error.message}`);
//       }
//     }
//   };

//   return (
//     <div className="space-y-4">
//       {/* Debug button - remove in production */}
//       <div className="flex justify-end gap-2">
//         <button
//           onClick={testApiManually}
//           className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded"
//         >
//           Test All APIs
//         </button>
//         <button
//           onClick={() => {
//             console.log("Current state:", {
//               f,
//               warehouses,
//               clients,
//               zones,
//               inventoryData,
//               summary,
//             });
//             toast.info("State logged to console");
//           }}
//           className="text-xs bg-blue-200 text-blue-700 px-2 py-1 rounded"
//         >
//           Log State
//         </button>
//       </div>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-6 gap-4">
//         <div className="rounded-lg border border-gray-200 bg-white p-4">
//           <div className="text-xs text-gray-500">Total SKUs</div>
//           <div className="mt-2 text-2xl font-semibold text-gray-900">
//             {tableData.length}
//           </div>
//         </div>
//         <div className="rounded-lg border border-gray-200 bg-white p-4">
//           <div className="text-xs text-gray-500">On Hand</div>
//           <div className="mt-2 text-2xl font-semibold text-gray-900">
//             {summary.total_on_hand?.toLocaleString() || 0}
//           </div>
//         </div>
//         <div className="rounded-lg border border-gray-200 bg-white p-4">
//           <div className="text-xs text-gray-500">Available</div>
//           <div className="mt-2 text-2xl font-semibold text-green-600">
//             {summary.total_available?.toLocaleString() || 0}
//           </div>
//         </div>
//         <div className="rounded-lg border border-gray-200 bg-white p-4">
//           <div className="text-xs text-gray-500">Hold</div>
//           <div className="mt-2 text-2xl font-semibold text-orange-600">
//             {summary.total_hold?.toLocaleString() || 0}
//           </div>
//         </div>
//         <div className="rounded-lg border border-gray-200 bg-white p-4">
//           <div className="text-xs text-gray-500">Allocated</div>
//           <div className="mt-2 text-2xl font-semibold text-blue-600">
//             {summary.total_allocated?.toLocaleString() || 0}
//           </div>
//         </div>
//         <div className="rounded-lg border border-gray-200 bg-white p-4">
//           <div className="text-xs text-gray-500">Damaged</div>
//           <div className="mt-2 text-2xl font-semibold text-red-600">
//             {summary.total_damaged?.toLocaleString() || 0}
//           </div>
//         </div>
//       </div>

//       <FilterBar
//         filters={filters}
//         showActions
//         onFilterChange={(k, v) => {
//           console.log(`Filter changed: ${k} = ${v}`);
//           setF((s) => ({ ...s, [k]: v }));
//         }}
//         onApply={handleRefresh}
//         onReset={() => {
//           console.log("Resetting filters");
//           setF({
//             warehouse: "1",
//             client: "All",
//             skuSearch: "",
//             zone: "All",
//             stockStatus: "All",
//           });
//         }}
//         extraActions={
//           <button
//             onClick={handleRefresh}
//             className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
//           >
//             <svg
//               className="h-4 w-4"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
//               />
//             </svg>
//             Refresh
//           </button>
//         }
//       />

//       {loading ? (
//         <div className="flex justify-center items-center h-64">
//           <div className="flex flex-col items-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
//             <div className="text-gray-500">Loading inventory data...</div>
//           </div>
//         </div>
//       ) : tableData.length === 0 ? (
//         <div className="flex justify-center items-center h-64 flex-col">
//           <div className="text-gray-400 mb-4">
//             <svg
//               className="w-16 h-16 mx-auto"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={1}
//                 d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
//               />
//             </svg>
//           </div>
//           <div className="text-gray-500 mb-2 text-lg">
//             No inventory data found
//           </div>
//           <div className="text-gray-400 text-sm mb-4 text-center">
//             <p>Please check:</p>
//             <p>1. The inventory API endpoint is correct</p>
//             <p>2. There is actual inventory data in the system</p>
//             <p>3. Your filters are not too restrictive</p>
//           </div>
//           <div className="flex gap-2">
//             <button
//               onClick={handleRefresh}
//               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
//             >
//               Refresh Data
//             </button>
//             <button
//               onClick={testApiManually}
//               className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm"
//             >
//               Test APIs
//             </button>
//           </div>
//         </div>
//       ) : (
//         <>
//           <div className="text-sm text-gray-500 mb-2">
//             Showing {tableData.length} SKU{tableData.length !== 1 ? "s" : ""}
//             {f.warehouse !== "All" &&
//               ` in warehouse ${warehouses.find((w) => w.value === f.warehouse)?.label || f.warehouse}`}
//             {f.client !== "All" && ` for ${f.client}`}
//             {f.zone !== "All" && ` in zone ${f.zone}`}
//             {f.stockStatus !== "All" && ` with status "${f.stockStatus}"`}
//             {f.skuSearch && ` matching "${f.skuSearch}"`}
//           </div>

//           <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
//             <CusTable columns={columns} data={tableData} />
//           </div>

//           <div className="text-xs text-gray-400 text-center">
//             Showing aggregated view by SKU. Click "View" to see location-level
//             details.
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default InventoryStockBySKU;

// src/pages/inventory/InventoryStockBySKU.jsx
import StockBySkuTab from "./components/tabs/stockBySku/StockBySkuTab";

export default StockBySkuTab;
