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
            onClick={() => navigate(`/ASNdetails/${row.id}`)}
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
            {/* in need to pass the complete asn detail as state in navigate */}
            <button
              className="text-blue-600 hover:underline"
              onClick={() => {
                if (row.status === "Draft") {
                  navigate(`/createASN/${row.id}`, {
                    state: { asn: row },
                  });
                } else {
                  toast.info("Feature coming soon!");
                }
              }}
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
              onClick={() => navigate(`/ASNdetails/${row.id}`)}
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
            <button
              onClick={() => toast.info("Coming soon! ")}
              className="px-4 py-2 border rounded-md text-sm bg-white w-full sm:w-auto"
            >
              Receive GRN
            </button>
            <button
              onClick={() => navigate("/createASN/new")}
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
