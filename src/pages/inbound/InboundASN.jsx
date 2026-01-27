// import React, { use, useMemo, useState } from "react";
// import { Download } from "lucide-react";

// import PageHeader from "../components/PageHeader";
// import FilterBar from "../components/FilterBar";
// import StatCard from "../components/StatCard";
// import SectionHeader from "../components/SectionHeader";
// import { useNavigate } from "react-router-dom";
// import CustTable from "../components/CusTable";

// const InboundASN = () => {
//   const navigate = useNavigate();
//   const [selectedRows, setSelectedRows] = useState([]);

//   const [filterValues, setFilterValues] = useState({
//     timePeriod: "Today",
//     warehouse: "WH-NYC-01",
//     client: "All Clients",
//     status: "All Statuses",
//     supplier: "All Suppliers",
//     dock: "All",
//     search: "",
//   });

//   const filtersConfig = [
//     {
//       key: "timePeriod",
//       label: "Time Period",
//       type: "select",
//       options: [
//         { label: "Today", value: "Today" },
//         { label: "Yesterday", value: "Yesterday" },
//         { label: "Last 7 Days", value: "Last 7 Days" },
//         { label: "This Month", value: "This Month" },
//       ],
//     },
//     {
//       key: "warehouse",
//       label: "Warehouse",
//       type: "select",
//       options: [
//         { label: "WH-NYC-01", value: "WH-NYC-01" },
//         { label: "WH-DEL-01", value: "WH-DEL-01" },
//         { label: "WH-BLR-01", value: "WH-BLR-01" },
//       ],
//     },
//     {
//       key: "client",
//       label: "Client",
//       type: "select",
//       options: [
//         { label: "All Clients", value: "All Clients" },
//         { label: "Acme Corp", value: "Acme Corp" },
//         { label: "Beta Logistics", value: "Beta Logistics" },
//         { label: "Gamma Retail", value: "Gamma Retail" },
//       ],
//     },
//     {
//       key: "status",
//       label: "Status",
//       type: "select",
//       options: [
//         { label: "All Statuses", value: "All Statuses" },
//         { label: "Draft", value: "Draft" },
//         { label: "Confirmed", value: "Confirmed" },
//         { label: "In Receiving", value: "In Receiving" },
//         { label: "Putaway Pending", value: "Putaway Pending" },
//         { label: "Closed", value: "Closed" },
//       ],
//     },
//     {
//       key: "supplier",
//       label: "Supplier",
//       type: "select",
//       options: [
//         { label: "All Suppliers", value: "All Suppliers" },
//         { label: "Global Supplies Ltd", value: "Global Supplies Ltd" },
//         { label: "Paper Co.", value: "Paper Co." },
//         { label: "Tech Parts Inc", value: "Tech Parts Inc" },
//       ],
//     },
//     {
//       key: "dock",
//       label: "Dock",
//       type: "select",
//       options: [
//         { label: "All", value: "All" },
//         { label: "D-01", value: "D-01" },
//         { label: "D-03", value: "D-03" },
//         { label: "D-04", value: "D-04" },
//       ],
//     },
//     {
//       key: "search",
//       label: "Search",
//       type: "search",
//       placeholder: "ASN No / Supplier / Ref",
//     },
//   ];
//   const onChange = (key, value) =>
//     setFilterValues((prev) => ({ ...prev, [key]: value }));

//   const onReset = () =>
//     setFilterValues({
//       timePeriod: "Today",
//       warehouse: "WH-NYC-01",
//       client: "All Clients",
//       status: "All Statuses",
//       supplier: "All Suppliers",
//       dock: "All",
//       search: "",
//     });

//   const onApply = () => {
//     console.log("Apply filters:", filterValues);
//     // call API here
//   };

//   // ✅ Stats (replace with API)
//   const stats = [
//     { title: "Total ASNs", value: "42" },
//     { title: "Due Today", value: "18" },
//     { title: "In Receiving", value: "5" },
//     { title: "Putaway Pending", value: "12" },
//     { title: "Closed", value: "7" },
//   ];

//   // ✅ Table columns (align with screenshot)
//   const columns = useMemo(
//     () => [
//       { key: "asnNo", label: "ASN No", isLink: true },
//       { key: "client", label: "Client" },
//       { key: "supplier", label: "Supplier" },
//       { key: "eta", label: "ETA" },
//       { key: "dock", label: "Dock" },
//       { key: "lines", label: "Lines", align: "right" },
//       { key: "units", label: "Units", align: "right" },
//       { key: "rcvd", label: "Rcvd", align: "right" },
//       { key: "status", label: "Status", type: "badge" },
//       { key: "putaway", label: "Putaway", align: "right" },
//       { key: "actions", label: "Actions", type: "actions" },
//     ],
//     [],
//   );

//   // ✅ Sample rows (replace with API)
//   const rows = useMemo(
//     () => [
//       {
//         id: "ASN-10293",
//         asnNo: "ASN-10293",
//         client: "Acme Corp",
//         supplier: "Global Supplies Ltd",
//         eta: "Today, 08:30 AM",
//         dock: "D-04",
//         lines: 15,
//         units: "1,200",
//         rcvd: 450,
//         status: "In Receiving",
//         putaway: 450,
//         actions: [{ label: "Resume", onClick: () => console.log("Resume") }],
//       },
//       {
//         id: "ASN-10289",
//         asnNo: "ASN-10289",
//         client: "Beta Logistics",
//         supplier: "Paper Co.",
//         eta: "Yesterday",
//         dock: "D-01",
//         lines: 22,
//         units: "5,000",
//         rcvd: "5,000",
//         status: "Putaway Pending",
//         putaway: "5,000",
//         actions: [
//           { label: "View GRN", onClick: () => console.log("View GRN") },
//         ],
//       },
//       {
//         id: "ASN-10301",
//         asnNo: "ASN-10301",
//         client: "Acme Corp",
//         supplier: "Office Depot",
//         eta: "Tomorrow",
//         dock: "-",
//         lines: 4,
//         units: 120,
//         rcvd: 0,
//         status: "Draft",
//         putaway: "-",
//         actions: [{ label: "Edit", onClick: () => console.log("Edit") }],
//       },
//       {
//         id: "ASN-10280",
//         asnNo: "ASN-10280",
//         client: "Gamma Retail",
//         supplier: "Fast Fashion",
//         eta: "2 days ago",
//         dock: "-",
//         lines: 45,
//         units: "2,300",
//         rcvd: "2,300",
//         status: "Closed",
//         putaway: 0,
//         actions: [
//           { label: "View GRN", onClick: () => console.log("View GRN") },
//         ],
//       },
//       {
//         id: "ASN-10305",
//         asnNo: "ASN-10305",
//         client: "Acme Corp",
//         supplier: "Tech Parts Inc",
//         eta: "Tomorrow",
//         dock: "D-03",
//         lines: 10,
//         units: 600,
//         rcvd: 0,
//         status: "Confirmed",
//         putaway: "-",
//         actions: [
//           {
//             label: "Start Receiving",
//             onClick: () => console.log("Start Receiving"),
//           },
//         ],
//       },
//     ],
//     [],
//   );

//   const selectedCount = selectedRows.length;

//   return (
//     <div className="max-w-full">
//       {/* PAGE HEADER */}
//       <PageHeader
//         title="Inbound (ASN)"
//         subtitle="Plan and track incoming shipments"
//         actions={
//           <>
//             <button className="px-4 py-2 border rounded-md text-sm bg-white w-full sm:w-auto">
//               Export
//             </button>
//             <button className="px-4 py-2 border rounded-md text-sm bg-white w-full sm:w-auto">
//               Receive GRN
//             </button>
//             <button
//               onClick={() => navigate("/createASN")}
//               className="px-4 py-2 rounded-md text-sm bg-primary text-white w-full sm:w-auto"
//             >
//               + Create ASN
//             </button>
//           </>
//         }
//       />

//       {/* FILTER BAR (you already have it) */}
//       <FilterBar
//         filters={filtersConfig}
//         values={filterValues}
//         onChange={onChange}
//         onReset={onReset}
//         onApply={onApply}
//       />

//       {/* STATS */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
//         {stats.map((s) => (
//           <StatCard
//             key={s.title}
//             title={s.title}
//             value={s.value}
//             accentColor="#3B82F6"
//           />
//         ))}
//       </div>

//       {/* TABLE SECTION */}
//       <div className="mt-6">
//         <SectionHeader
//           title="ASNs"
//           icon={<Download size={16} className="text-blue-600" />}
//           right={
//             selectedCount > 0 ? (
//               <div className="flex items-center gap-4">
//                 <div className="text-sm text-gray-600">
//                   <span className="font-medium text-blue-600">
//                     {selectedCount} Selected
//                   </span>
//                 </div>

//                 <button className="text-sm text-blue-600 hover:underline">
//                   Assign Dock
//                 </button>
//                 <button className="text-sm text-blue-600 hover:underline">
//                   Mark Confirmed
//                 </button>
//                 <button className="text-sm text-blue-600 hover:underline">
//                   Export Selected
//                 </button>

//                 <button
//                   className="text-sm text-red-500 hover:underline"
//                   onClick={() => setSelectedRows([])}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             ) : (
//               <div className="text-sm text-gray-500">
//                 Select rows to enable bulk actions
//               </div>
//             )
//           }
//         />

//         {/* CUST TABLE (you already have) */}
//         <CustTable
//           columns={columns}
//           rows={rows}
//           selectable
//           selectedRows={selectedRows}
//           onSelectionChange={setSelectedRows}
//           rowKey="id"
//         />
//       </div>
//     </div>
//   );
// };

// export default InboundASN;

import React, { useMemo, useState } from "react";
import { Download, MoreHorizontal } from "lucide-react";

import PageHeader from "../components/PageHeader";
import FilterBar from "../components/FilterBar";
import StatCard from "../components/StatCard";
import SectionHeader from "../components/SectionHeader";
import CusTable from "../components/CusTable";
import { useNavigate } from "react-router-dom";
import ConfirmDeleteModal from "../components/modals/ConfirmDeleteModal";
import { useToast } from "../components/toast/ToastProvider";

const InboundASN = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const navigate = useNavigate();
  // ✅ filter values (for showing on UI)
  const [filterValues, setFilterValues] = useState({
    timePeriod: "Today",
    warehouse: "WH-NYC-01",
    client: "All Clients",
    status: "All Statuses",
    supplier: "All Suppliers",
    dock: "All",
    search: "",
  });

  const toast = useToast();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const openDelete = (row) => {
    setDeleteTarget(row);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setDeleting(true);

      // TODO: call API
      // await axios.delete(`${BASE_URL}asn/${deleteTarget.id}`);

      toast.success(`Deleted ${deleteTarget.asnNo} successfully`);
      setDeleteOpen(false);
      setDeleteTarget(null);
    } catch (e) {
      toast.error("Delete failed. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const filters = [
    {
      key: "timePeriod",
      type: "select",
      label: "TIME PERIOD",
      value: filterValues.timePeriod,
      options: ["Today", "Yesterday", "Last 7 Days"],
    },
    {
      key: "warehouse",
      type: "select",
      label: "WAREHOUSE",
      value: filterValues.warehouse,
      options: ["WH-NYC-01", "WH-DEL-01"],
    },
    {
      key: "client",
      type: "select",
      label: "CLIENT",
      value: filterValues.client,
      options: ["All Clients", "Acme Corp", "Beta Logistics"],
    },
    {
      key: "status",
      type: "select",
      label: "STATUS",
      value: filterValues.status,
      options: [
        "All Statuses",
        "Draft",
        "Confirmed",
        "In Receiving",
        "Putaway Pending",
        "Closed",
      ],
    },
    {
      key: "supplier",
      type: "select",
      label: "SUPPLIER",
      value: filterValues.supplier,
      options: ["All Suppliers", "Global Supplies Ltd", "Paper Co."],
    },
    {
      key: "dock",
      type: "select",
      label: "DOCK",
      value: filterValues.dock,
      options: ["All", "D-01", "D-03", "D-04"],
    },
    {
      key: "search",
      type: "search",
      label: "SEARCH",
      value: filterValues.search,
      placeholder: "ASN No / Supplier / Ref",
      className: "min-w-[260px] flex-1",
    },
  ];

  // --- stats
  const stats = [
    { title: "Total ASNs", value: "42" },
    { title: "Due Today", value: "18" },
    { title: "In Receiving", value: "5" },
    { title: "Putaway Pending", value: "12" },
    { title: "Closed", value: "7" },
  ];

  // ✅ data
  const data = useMemo(
    () => [
      {
        id: "ASN-10293",
        asnNo: "ASN-10293",
        client: "Acme Corp",
        supplier: "Global Supplies Ltd",
        eta: "Today, 08:30 AM",
        dock: "D-04",
        lines: 15,
        units: "1,200",
        rcvd: 450,
        status: "In Receiving",
        putaway: 450,
      },
      {
        id: "ASN-10289",
        asnNo: "ASN-10289",
        client: "Beta Logistics",
        supplier: "Paper Co.",
        eta: "Yesterday",
        dock: "D-01",
        lines: 22,
        units: "5,000",
        rcvd: "5,000",
        status: "Putaway Pending",
        putaway: "5,000",
      },
      {
        id: "ASN-10301",
        asnNo: "ASN-10301",
        client: "Acme Corp",
        supplier: "Office Depot",
        eta: "Tomorrow",
        dock: "-",
        lines: 4,
        units: 120,
        rcvd: 0,
        status: "Draft",
        putaway: "-",
      },
    ],
    [],
  );

  // ✅ columns (match your CusTable)
  const columns = useMemo(
    () => [
      {
        key: "select",
        title: (
          <input
            type="checkbox"
            onChange={(e) =>
              setSelectedRows(e.target.checked ? data.map((x) => x.id) : [])
            }
          />
        ),
        render: (row) => (
          <input
            type="checkbox"
            checked={selectedRows.includes(row.id)}
            onChange={(e) => {
              if (e.target.checked) setSelectedRows((p) => [...p, row.id]);
              else setSelectedRows((p) => p.filter((id) => id !== row.id));
            }}
          />
        ),
      },
      {
        key: "asnNo",
        title: "ASN No",
        render: (row) => (
          <button
            className="text-blue-600 hover:underline"
            onClick={() => console.log("open ASN", row.id)}
          >
            {row.asnNo}
          </button>
        ),
      },
      { key: "client", title: "Client" },
      { key: "supplier", title: "Supplier" },
      { key: "eta", title: "ETA" },
      { key: "dock", title: "Dock" },
      { key: "lines", title: "Lines" },
      { key: "units", title: "Units" },
      { key: "rcvd", title: "Rcvd" },
      {
        key: "status",
        title: "Status",
        render: (row) => (
          <span className="px-2 py-1 rounded-full text-xs bg-gray-100">
            {row.status}
          </span>
        ),
      },
      { key: "putaway", title: "Putaway" },
      {
        key: "actions",
        title: "Actions",
        render: (row) => (
          <div className="flex items-center gap-3">
            <button
              className="text-blue-600 hover:underline"
              onClick={() => console.log("action", row.id)}
            >
              {row.status === "In Receiving"
                ? "Resume"
                : row.status === "Putaway Pending"
                  ? "View GRN"
                  : row.status === "Draft"
                    ? "Edit"
                    : "View GRN"}
            </button>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => console.log("more", row.id)}
            >
              <MoreHorizontal size={16} />
            </button>
          </div>
        ),
      },
    ],
    [data, selectedRows],
  );

  return (
    <div className="max-w-full">
      <PageHeader
        title="Inbound (ASN)"
        subtitle="Plan and track incoming shipments"
        actions={
          <>
            <button className="px-4 py-2 border rounded-md text-sm bg-white w-full sm:w-auto">
              Export
            </button>
            <button className="px-4 py-2 border rounded-md text-sm bg-white w-full sm:w-auto">
              Receive GRN
            </button>
            <button
              onClick={() => navigate("/createASN")}
              className="px-4 py-2 rounded-md text-sm bg-primary text-white w-full sm:w-auto"
            >
              + Create ASN
            </button>
          </>
        }
      />

      {/* ✅ Your FilterBar UI */}
      <FilterBar
        filters={filters}
        onFilterChange={(key, val) =>
          setFilterValues((p) => ({ ...p, [key]: val }))
        }
        onReset={() =>
          setFilterValues({
            timePeriod: "Today",
            warehouse: "WH-NYC-01",
            client: "All Clients",
            status: "All Statuses",
            supplier: "All Suppliers",
            dock: "All",
            search: "",
          })
        }
        onApply={() => console.log("Apply", filterValues)}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
        {stats.map((s) => (
          <StatCard
            key={s.title}
            title={s.title}
            value={s.value}
            accentColor="#3B82F6"
          />
        ))}
      </div>

      <div className="mt-6">
        <SectionHeader
          title="ASNs"
          icon={<Download size={16} className="text-blue-600" />}
          right={
            selectedRows.length > 0 ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-blue-600 font-medium">
                  {selectedRows.length} Selected
                </span>
                <button className="text-sm text-blue-600 hover:underline">
                  Assign Dock
                </button>
                <button className="text-sm text-blue-600 hover:underline">
                  Mark Confirmed
                </button>
                <button className="text-sm text-blue-600 hover:underline">
                  Export Selected
                </button>
                <button
                  className="text-sm text-red-500 hover:underline"
                  onClick={() => setSelectedRows([])}
                >
                  Cancel
                </button>
              </div>
            ) : null
          }
        />

        <CusTable columns={columns} data={data} />
      </div>

      <ConfirmDeleteModal
        open={deleteOpen}
        title="Delete ASN"
        message={
          deleteTarget
            ? `Are you sure you want to delete ${deleteTarget.asnNo}? This cannot be undone.`
            : "Are you sure?"
        }
        loading={deleting}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default InboundASN;
