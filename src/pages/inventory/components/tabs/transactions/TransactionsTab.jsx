import React, { useMemo } from "react";
import FilterBar from "@/pages/components/FilterBar";
import CusTable from "@/pages/components/CusTable";
import { useToast } from "@/pages/components/toast/ToastProvider";
import { useTransactions } from "./useTransactions";

export default function TransactionsTab() {
  const toast = useToast();
  const { loading, f, setF, filters, data, pagination, refresh } =
    useTransactions(toast);

  const columns = useMemo(
    () => [
      {
        key: "transaction_id",
        title: "Txn ID",
        render: (r) => (
          <div className="text-sm font-semibold">{r.transaction_id}</div>
        ),
      },
      {
        key: "transaction_type",
        title: "Type",
        render: (r) => <div className="text-sm">{r.transaction_type}</div>,
      },
      {
        key: "sku",
        title: "SKU",
        render: (r) => (
          <div className="text-sm">
            {r.sku?.sku_code}{" "}
            <span className="text-xs text-gray-500">({r.sku?.sku_name})</span>
          </div>
        ),
      },
      {
        key: "qty",
        title: "Qty",
        render: (r) => <div className="text-sm font-semibold">{r.qty}</div>,
      },
      {
        key: "from_location",
        title: "From",
        render: (r) => (
          <div className="text-sm">{r.from_location?.location_code || "-"}</div>
        ),
      },
      {
        key: "to_location",
        title: "To",
        render: (r) => (
          <div className="text-sm">{r.to_location?.location_code || "-"}</div>
        ),
      },
      {
        key: "batch_no",
        title: "Batch",
        render: (r) => <div className="text-sm">{r.batch_no || "-"}</div>,
      },
      {
        key: "reference",
        title: "Reference",
        render: (r) => (
          <div className="text-xs text-gray-600">
            {r.reference_type} • {r.reference_id}
          </div>
        ),
      },
      {
        key: "created_at",
        title: "Date",
        render: (r) => (
          <div className="text-xs text-gray-600">
            {new Date(r.created_at).toLocaleString()}
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-4">
      <FilterBar
        filters={filters}
        showActions
        onFilterChange={(k, v) => setF((s) => ({ ...s, [k]: v, page: 1 }))}
        onApply={refresh}
        onReset={() =>
          setF({
            warehouse_id: "1",
            sku_id: "",
            location_id: "",
            transaction_type: "All",
            start_date: "",
            end_date: "",
            page: 1,
            limit: 10,
          })
        }
      />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="text-sm text-gray-500">
            Total: {pagination.total} • Page {pagination.page} /{" "}
            {pagination.pages}
          </div>

          <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
            <CusTable columns={columns} data={data} />
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              disabled={pagination.page <= 1}
              onClick={() =>
                setF((s) => ({ ...s, page: Math.max(1, s.page - 1) }))
              }
              className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm disabled:opacity-50"
            >
              Prev
            </button>
            <button
              disabled={pagination.page >= pagination.pages}
              onClick={() =>
                setF((s) => ({
                  ...s,
                  page: Math.min(pagination.pages, s.page + 1),
                }))
              }
              className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
