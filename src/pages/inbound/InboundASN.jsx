import React, { useMemo, useState, useEffect } from "react";
import { Download, MoreHorizontal } from "lucide-react";

import PageHeader from "../components/PageHeader";
import FilterBar from "../components/FilterBar";
import StatCard from "../components/StatCard";
import SectionHeader from "../components/SectionHeader";
import CusTable from "../components/CusTable";
import { useNavigate } from "react-router-dom";
import ConfirmDeleteModal from "../components/modals/ConfirmDeleteModal";
import { useToast } from "../components/toast/ToastProvider";
import http from "../../api/http";

const InboundASN = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const navigate = useNavigate();
  const toast = useToast();
  
  const [asnData, setAsnData] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 20
  });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    dueToday: 0,
    inReceiving: 0,
    putawayPending: 0,
    closed: 0
  });

  // Filters state
  const [filterValues, setFilterValues] = useState({
    timePeriod: "Today",
    warehouse: "All",
    client: "All",
    status: "All",
    supplier: "All",
    dock: "All",
    search: "",
  });

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch ASN data
  useEffect(() => {
    fetchASNData();
  }, []);

  const fetchASNData = async (page = 1) => {
    try {
      setLoading(true);
      const response = await http.get(`/asns?page=${page}&limit=20`);
      
      if (response.data.success) {
        setAsnData(response.data.data.asns);
        setPagination(response.data.data.pagination);
        calculateStats(response.data.data.asns);
      }
    } catch (error) {
      console.error("Error fetching ASN data:", error);
      toast.error("Failed to load ASN data");
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics from ASN data
  const calculateStats = (asns) => {
    const today = new Date().toISOString().split('T')[0];
    let dueTodayCount = 0;
    let inReceivingCount = 0;
    let putawayPendingCount = 0;
    let closedCount = 0;

    asns.forEach(asn => {
      const etaDate = new Date(asn.eta).toISOString().split('T')[0];
      
      if (etaDate === today) {
        dueTodayCount++;
      }

      switch(asn.status) {
        case 'IN_RECEIVING':
          inReceivingCount++;
          break;
        case 'GRN_POSTED':
          putawayPendingCount++;
          break;
        case 'CLOSED':
          closedCount++;
          break;
      }
    });

    setStats({
      total: asns.length,
      dueToday: dueTodayCount,
      inReceiving: inReceivingCount,
      putawayPending: putawayPendingCount,
      closed: closedCount
    });
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  // Format status for display
  const formatStatus = (status) => {
    const statusMap = {
      'DRAFT': 'Draft',
      'CONFIRMED': 'Confirmed',
      'IN_RECEIVING': 'In Receiving',
      'GRN_POSTED': 'Putaway Pending',
      'PUTAWAY_COMPLETED': 'Putaway Completed',
      'CLOSED': 'Closed',
      'CANCELLED': 'Cancelled'
    };
    return statusMap[status] || status;
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    const colorMap = {
      'DRAFT': 'bg-gray-100 text-gray-800',
      'CONFIRMED': 'bg-blue-100 text-blue-800',
      'IN_RECEIVING': 'bg-yellow-100 text-yellow-800',
      'GRN_POSTED': 'bg-purple-100 text-purple-800',
      'PUTAWAY_COMPLETED': 'bg-green-100 text-green-800',
      'CLOSED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const openDelete = (row) => {
    setDeleteTarget(row);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setDeleting(true);
      
      await http.delete(`/asns/${deleteTarget.id}`);
      
      toast.success(`Deleted ${deleteTarget.asn_no} successfully`);
      setDeleteOpen(false);
      setDeleteTarget(null);
      
      // Refresh data
      fetchASNData();
    } catch (e) {
      console.error("Delete error:", e);
      toast.error("Delete failed. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  // Filters configuration
  const filters = [
    {
      key: "timePeriod",
      type: "select",
      label: "TIME PERIOD",
      value: filterValues.timePeriod,
      options: ["Today", "Yesterday", "Last 7 Days", "This Month", "All Time"],
    },
    {
      key: "warehouse",
      type: "select",
      label: "WAREHOUSE",
      value: filterValues.warehouse,
      options: ["All", ...Array.from(new Set(asnData.map(asn => asn.warehouse?.warehouse_name)))],
    },
    {
      key: "client",
      type: "select",
      label: "CLIENT",
      value: filterValues.client,
      options: ["All", ...Array.from(new Set(asnData.map(asn => asn.client?.client_name)))],
    },
    {
      key: "status",
      type: "select",
      label: "STATUS",
      value: filterValues.status,
      options: ["All", "Draft", "Confirmed", "In Receiving", "Putaway Pending", "Closed", "Cancelled"],
    },
    {
      key: "supplier",
      type: "select",
      label: "SUPPLIER",
      value: filterValues.supplier,
      options: ["All", ...Array.from(new Set(asnData.map(asn => asn.supplier?.supplier_name)))],
    },
    {
      key: "dock",
      type: "select",
      label: "DOCK",
      value: filterValues.dock,
      options: ["All", ...Array.from(new Set(asnData.map(asn => asn.dock?.dock_name)))],
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

  // Apply filters to data
  const filteredData = useMemo(() => {
    return asnData.filter(asn => {
      // Search filter
      if (filterValues.search) {
        const searchLower = filterValues.search.toLowerCase();
        const matchesSearch = 
          asn.asn_no.toLowerCase().includes(searchLower) ||
          asn.reference_no?.toLowerCase().includes(searchLower) ||
          asn.supplier?.supplier_name?.toLowerCase().includes(searchLower) ||
          asn.transporter_name?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Warehouse filter
      if (filterValues.warehouse !== "All" && asn.warehouse?.warehouse_name !== filterValues.warehouse) {
        return false;
      }

      // Client filter
      if (filterValues.client !== "All" && asn.client?.client_name !== filterValues.client) {
        return false;
      }

      // Status filter
      if (filterValues.status !== "All") {
        const statusMap = {
          'Draft': 'DRAFT',
          'Confirmed': 'CONFIRMED',
          'In Receiving': 'IN_RECEIVING',
          'Putaway Pending': 'GRN_POSTED',
          'Closed': 'CLOSED',
          'Cancelled': 'CANCELLED'
        };
        if (asn.status !== statusMap[filterValues.status]) {
          return false;
        }
      }

      // Supplier filter
      if (filterValues.supplier !== "All" && asn.supplier?.supplier_name !== filterValues.supplier) {
        return false;
      }

      // Dock filter
      if (filterValues.dock !== "All" && asn.dock?.dock_name !== filterValues.dock) {
        return false;
      }

      return true;
    });
  }, [asnData, filterValues]);

  // Table columns
  const columns = useMemo(
    () => [
      {
        key: "select",
        title: (
          <input
            type="checkbox"
            onChange={(e) =>
              setSelectedRows(e.target.checked ? filteredData.map((x) => x.id) : [])
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
        key: "asn_no",
        title: "ASN No",
        render: (row) => (
          <button
            className="text-blue-600 hover:underline"
            onClick={() => navigate(`/ASNdetails/${row.id}`)}
          >
            {row.asn_no}
          </button>
        ),
      },
      { 
        key: "client", 
        title: "Client",
        render: (row) => row.client?.client_name || "-"
      },
      { 
        key: "supplier", 
        title: "Supplier",
        render: (row) => row.supplier?.supplier_name || "-"
      },
      { 
        key: "eta", 
        title: "ETA",
        render: (row) => formatDate(row.eta)
      },
      { 
        key: "dock", 
        title: "Dock",
        render: (row) => row.dock?.dock_name || "-"
      },
      { 
        key: "total_lines", 
        title: "Lines" 
      },
      { 
        key: "total_expected_units", 
        title: "Units" 
      },
      { 
        key: "total_received_units", 
        title: "Rcvd" 
      },
      {
        key: "status",
        title: "Status",
        render: (row) => (
          <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(row.status)}`}>
            {formatStatus(row.status)}
          </span>
        ),
      },
      {
        key: "putaway",
        title: "Putaway",
        render: (row) => {
          if (row.status === 'GRN_POSTED') {
            return row.total_received_units || "-";
          } else if (row.status === 'PUTAWAY_COMPLETED' || row.status === 'CLOSED') {
            return "Completed";
          } else {
            return "-";
          }
        }
      },
      {
        key: "actions",
        title: "Actions",
        render: (row) => (
          <div className="flex items-center gap-3">
            <button
              className="text-blue-600 hover:underline text-sm"
              onClick={() => {
                if (row.status === "DRAFT") {
                  navigate(`/createASN/${row.id}`, {
                    state: { asn: row },
                  });
                } else if (row.status === "IN_RECEIVING") {
                  navigate(`/ASNreceive/${row.asn_no}`, { state: { id: row.id } });
                } else if (row.status === "GRN_POSTED") {
                  navigate(`/grn/${row.id}`);
                } else {
                  navigate(`/ASNdetails/${row.id}`);
                }
              }}
            >
              {row.status === "IN_RECEIVING"
                ? "Resume"
                : row.status === "GRN_POSTED"
                  ? "View GRN"
                  : row.status === "DRAFT"
                    ? "Edit"
                    : "View"}
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
    [filteredData, selectedRows],
  );

  // Handle pagination
  const handlePageChange = (newPage) => {
    fetchASNData(newPage);
  };

  // Handle bulk actions
  const handleBulkConfirm = async () => {
    try {
      await Promise.all(selectedRows.map(id => 
        http.post(`/asns/${id}/confirm`)
      ));
      toast.success(`${selectedRows.length} ASNs confirmed successfully`);
      setSelectedRows([]);
      fetchASNData();
    } catch (error) {
      toast.error("Failed to confirm ASNs");
    }
  };

  return (
    <div className="max-w-full">
      <PageHeader
        title="Inbound (ASN)"
        subtitle="Plan and track incoming shipments"
        actions={
          <>
            <button 
              onClick={() => toast.info("Export feature coming soon!")}
              className="px-4 py-2 border rounded-md text-sm bg-white w-full sm:w-auto"
            >
              Export
            </button>
            <button
              onClick={() => toast.info("GRN receiving feature coming soon!")}
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

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={(key, val) =>
          setFilterValues((p) => ({ ...p, [key]: val }))
        }
        onReset={() =>
          setFilterValues({
            timePeriod: "Today",
            warehouse: "All",
            client: "All",
            status: "All",
            supplier: "All",
            dock: "All",
            search: "",
          })
        }
        onApply={() => {
          // Filters are applied automatically through filteredData
          toast.info("Filters applied");
        }}
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
        <StatCard
          title="Total ASNs"
          value={stats.total}
          accentColor="#3B82F6"
        />
        <StatCard
          title="Due Today"
          value={stats.dueToday}
          accentColor="#F59E0B"
        />
        <StatCard
          title="In Receiving"
          value={stats.inReceiving}
          accentColor="#F59E0B"
        />
        <StatCard
          title="Putaway Pending"
          value={stats.putawayPending}
          accentColor="#8B5CF6"
        />
        <StatCard
          title="Closed"
          value={stats.closed}
          accentColor="#10B981"
        />
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
                <button 
                  onClick={handleBulkConfirm}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Mark Confirmed
                </button>
                <button 
                  onClick={() => toast.info("Bulk dock assignment coming soon!")}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Assign Dock
                </button>
                <button 
                  onClick={() => toast.info("Export selected feature coming soon!")}
                  className="text-sm text-blue-600 hover:underline"
                >
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

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading ASN data...</div>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="flex justify-center items-center h-64 border border-gray-200 rounded-lg">
            <div className="text-gray-500">No ASNs found</div>
          </div>
        ) : (
          <>
            <CusTable columns={columns} data={filteredData} />
            
            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-between items-center mt-4 px-4 py-3 border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                  {pagination.total} entries
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-sm">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmDeleteModal
        open={deleteOpen}
        title="Delete ASN"
        message={
          deleteTarget
            ? `Are you sure you want to delete ${deleteTarget.asn_no}? This cannot be undone.`
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