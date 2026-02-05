import React, { useMemo } from "react";
import FilterBar from "@/pages/components/FilterBar";
import CusTable from "@/pages/components/CusTable";
import { useToast } from "@/pages/components/toast/ToastProvider";
import SummaryCards from "../../SummaryCards";
import StatusPill from "../../StatusPill";
import { useStockByLocation } from "./useStockByLocation";

export default function StockByLocationTab() {
  const toast = useToast();
  const {
    loading,
    locationId,
    setLocationId,
    filters,
    rows,
    locationInfo,
    refresh,
  } = useStockByLocation(toast);

  const columns = useMemo(
    () => [
      {
        key: "sku",
        title: "SKU",
        render: (r) => (
          <div className="text-sm font-semibold">
            {r.sku?.sku_code}{" "}
            <span className="text-xs text-gray-500">({r.sku?.sku_name})</span>
          </div>
        ),
      },
      {
        key: "client",
        title: "Client",
        render: (r) => <div className="text-sm">{r.client?.client_name}</div>,
      },
      {
        key: "batch_no",
        title: "Batch",
        render: (r) => <div className="text-sm">{r.batch_no || "-"}</div>,
      },
      {
        key: "on_hand_qty",
        title: "On-hand",
        render: (r) => <span className="font-medium">{r.on_hand_qty}</span>,
      },
      {
        key: "available_qty",
        title: "Available",
        render: (r) => (
          <span className="font-medium text-green-600">{r.available_qty}</span>
        ),
      },
      {
        key: "hold_qty",
        title: "Hold",
        render: (r) => (
          <span className="font-medium text-orange-600">{r.hold_qty}</span>
        ),
      },
      {
        key: "allocated_qty",
        title: "Allocated",
        render: (r) => (
          <span className="font-medium text-blue-600">{r.allocated_qty}</span>
        ),
      },
      {
        key: "damaged_qty",
        title: "Damaged",
        render: (r) => (
          <span className="font-medium text-red-600">{r.damaged_qty}</span>
        ),
      },
      {
        key: "status",
        title: "Status",
        render: (r) => <StatusPill text={r.status} />,
      },
    ],
    [],
  );

  const totals = useMemo(() => {
    const t = { onHand: 0, available: 0, hold: 0, allocated: 0, damaged: 0 };
    rows.forEach((r) => {
      t.onHand += Number(r.on_hand_qty || 0);
      t.available += Number(r.available_qty || 0);
      t.hold += Number(r.hold_qty || 0);
      t.allocated += Number(r.allocated_qty || 0);
      t.damaged += Number(r.damaged_qty || 0);
    });
    return t;
  }, [rows]);

  return (
    <div className="space-y-4">
      <SummaryCards
        cards={[
          { label: "Lines", value: rows.length },
          { label: "On Hand", value: totals.onHand },
          {
            label: "Available",
            value: totals.available,
            valueClass: "text-green-600",
          },
          { label: "Hold", value: totals.hold, valueClass: "text-orange-600" },
          {
            label: "Allocated",
            value: totals.allocated,
            valueClass: "text-blue-600",
          },
          {
            label: "Damaged",
            value: totals.damaged,
            valueClass: "text-red-600",
          },
        ]}
      />

      {locationInfo && (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-sm font-semibold text-gray-900">
            Location Utilization
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Utilization:{" "}
            <span className="font-semibold">{locationInfo.utilization}</span> •
            Capacity:{" "}
            <span className="font-semibold">{locationInfo.capacity}</span> •
            Current usage:{" "}
            <span className="font-semibold">{locationInfo.current_usage}</span>{" "}
            • Available capacity:{" "}
            <span className="font-semibold">
              {locationInfo.available_capacity}
            </span>
          </div>
        </div>
      )}

      <FilterBar
        filters={filters}
        showActions
        onFilterChange={(k, v) => {
          if (k === "locationId") setLocationId(v);
        }}
        onApply={refresh}
        onReset={() => setLocationId("1")}
      />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <CusTable columns={columns} data={rows} />
        </div>
      )}
    </div>
  );
}
