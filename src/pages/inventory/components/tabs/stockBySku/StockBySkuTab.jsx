import React, { useMemo } from "react";
import FilterBar from "@/pages/components/FilterBar";
import CusTable from "@/pages/components/CusTable";
import { useToast } from "@/pages/components/toast/ToastProvider";
import SummaryCards from "../../SummaryCards";
import StatusPill from "../../StatusPill";
import { useStockBySku } from "./useStockBySku";
import Pagination from "../../../../components/Pagination";

export default function StockBySkuTab() {
  const toast = useToast();
  const {
    loading,
    f,
    setF,
    filters,
    resetFilters,
    warehouses,
    summary,
    tableData,
    refresh,
    pagination,
    page,
    setPage,
  } = useStockBySku(toast);

  const columns = useMemo(
    () => [
      {
        key: "skuDetails",
        title: "SKU Details",
        render: (r) => (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-md border border-gray-200 bg-white flex items-center justify-center">
              <img
                src={r.img}
                alt={r.sku}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    r.sku,
                  )}&background=random&color=fff`;
                }}
              />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-blue-600 hover:underline cursor-pointer">
                {r.sku}
              </div>
              <div className="text-xs text-gray-500">{r.name}</div>
              <div className="text-xs text-gray-400">
                {r.category} • {r.uom}
              </div>
            </div>
          </div>
        ),
      },
      {
        key: "onHand",
        title: "On-hand",
        render: (r) => <span className="font-medium">{r.onHand}</span>,
      },
      {
        key: "available",
        title: "Available",
        render: (r) => (
          <span className="font-medium text-green-600">{r.available}</span>
        ),
      },
      {
        key: "hold",
        title: "Hold",
        render: (r) => (
          <span className="font-medium text-orange-600">{r.hold}</span>
        ),
      },
      {
        key: "allocated",
        title: "Allocated",
        render: (r) => (
          <span className="font-medium text-blue-600">{r.allocated}</span>
        ),
      },
      {
        key: "damaged",
        title: "Damaged",
        render: (r) => (
          <span className="font-medium text-red-600">{r.damaged}</span>
        ),
      },
      {
        key: "locations",
        title: "Locations",
        render: (r) => (
          <div
            className="text-xs text-gray-600 max-w-[160px] truncate"
            title={r.locations}
          >
            {r.locations}
          </div>
        ),
      },
      {
        key: "risk",
        title: "Status",
        render: (r) => <StatusPill text={r.risk} />,
      },
      {
        key: "actions",
        title: "Actions",
        render: (r) => (
          <div className="flex gap-2">
            <button
              onClick={() =>
                toast.info(`Viewing ${r.sku} (wire to detail later)`)
              }
              className="rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
            >
              View
            </button>
            <button
              onClick={() =>
                toast.info(`Adjust stock for ${r.sku} (open modal later)`)
              }
              className="rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm text-blue-700 hover:bg-blue-100"
            >
              Adjust
            </button>
          </div>
        ),
      },
    ],
    [toast],
  );

  return (
    <div className="space-y-4">
      <SummaryCards
        cards={[
          { label: "Total SKUs", value: tableData.length },
          { label: "On Hand", value: summary.total_on_hand },
          {
            label: "Available",
            value: summary.total_available,
            valueClass: "text-green-600",
          },
          {
            label: "Hold",
            value: summary.total_hold,
            valueClass: "text-orange-600",
          },
          {
            label: "Allocated",
            value: summary.total_allocated,
            valueClass: "text-blue-600",
          },
          {
            label: "Damaged",
            value: summary.total_damaged,
            valueClass: "text-red-600",
          },
        ]}
      />

      <FilterBar
        filters={filters}
        showActions
        onFilterChange={(k, v) => setF((s) => ({ ...s, [k]: v }))}
        onApply={refresh}
        onReset={resetFilters}
      />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
            <div className="text-gray-500">Loading inventory data...</div>
          </div>
        </div>
      ) : tableData.length === 0 ? (
        <div className="flex justify-center items-center h-64 flex-col">
          <div className="text-gray-500 mb-2 text-lg">
            No inventory data found
          </div>
          <button
            onClick={refresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            Refresh
          </button>
        </div>
      ) : (
        <>
          <div className="text-sm text-gray-500">
            Showing {tableData.length} SKU{tableData.length !== 1 ? "s" : ""}
            {f.warehouse !== "All" &&
              ` in warehouse ${
                warehouses.find((w) => w.value === f.warehouse)?.label ||
                f.warehouse
              }`}
            {f.client !== "All" && ` for ${f.client}`}
            {f.zone !== "All" && ` in zone ${f.zone}`}
            {f.stockStatus !== "All" && ` with status "${f.stockStatus}"`}
            {f.skuSearch && ` matching "${f.skuSearch}"`}
          </div>

          <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
            <CusTable columns={columns} data={tableData} />
            <Pagination
              pagination={{
                ...(pagination || {}),
                page: page || pagination?.page || 1,
              }}
              onPageChange={(p) => {
                if (p < 1 || p > (pagination?.pages || 1)) return;
                setPage(p);
              }}
            />
          </div>

          <div className="text-xs text-gray-400 text-center">
            Aggregated by SKU. Use “View” for location-level drilldown (next
            step).
          </div>
        </>
      )}
    </div>
  );
}
