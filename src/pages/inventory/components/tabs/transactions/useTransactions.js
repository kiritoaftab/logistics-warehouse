import { useEffect, useMemo, useState } from "react";
import http from "@/api/http";

export function useTransactions(toast) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  
  const [f, setF] = useState({
    warehouse_id: "1",
    sku_id: "",
    location_id: "",
    transaction_type: "All",
    start_date: "",
    end_date: "",
    page: 1,
    limit: 10,
  });

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
  });

  useEffect(() => {
    fetchTransactions();
  }, [
    f.warehouse_id,
    f.sku_id,
    f.location_id,
    f.transaction_type,
    f.start_date,
    f.end_date,
    f.page,
  ]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (f.warehouse_id) params.append("warehouse_id", String(f.warehouse_id));
      if (f.sku_id) params.append("sku_id", String(f.sku_id));
      if (f.location_id) params.append("location_id", String(f.location_id));

      if (f.transaction_type && f.transaction_type !== "All") {
        params.append("transaction_type", f.transaction_type);
      }

      if (f.start_date) params.append("start_date", f.start_date);
      if (f.end_date) params.append("end_date", f.end_date);

      params.append("page", String(f.page || 1));
      params.append("limit", String(f.limit || 10));

      const url = `/inventory/transactions?${params.toString()}`;
      console.log("Fetching transactions from:", url);

      const res = await http.get(url);

      if (!res.data?.success) {
        setData([]);
        setPagination({ total: 0, page: 1, limit: 10, pages: 1 });
        return;
      }

      const d = res.data.data;
      const list = Array.isArray(d) ? d : d?.transactions || [];
      
      const apiPagination = res.data.pagination || d?.pagination;
      
      if (apiPagination) {
        setPagination({
          total: apiPagination.total || list.length,
          page: apiPagination.page || f.page,
          limit: apiPagination.limit || f.limit,
          pages: apiPagination.pages || Math.ceil((apiPagination.total || list.length) / (apiPagination.limit || f.limit)),
        });
      } else {
        setPagination({
          total: list.length,
          page: f.page,
          limit: f.limit,
          pages: Math.ceil(list.length / f.limit),
        });
      }

      setData(list);
    } catch (e) {
      console.error("Transactions error:", e);
      setData([]);
      toast?.error?.(e.response?.data?.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setF(prev => ({ ...prev, page: newPage }));
  };

  const filters = useMemo(
    () => [
      {
        key: "warehouse_id",
        type: "search",
        label: "Warehouse ID",
        value: f.warehouse_id,
        placeholder: "e.g. 1",
        className: "w-[160px]",
      },
      {
        key: "sku_id",
        type: "search",
        label: "SKU ID",
        value: f.sku_id,
        placeholder: "e.g. 2",
        className: "w-[140px]",
      },
      {
        key: "location_id",
        type: "search",
        label: "Location ID",
        value: f.location_id,
        placeholder: "e.g. 5",
        className: "w-[160px]",
      },
      {
        key: "transaction_type",
        type: "select",
        label: "Type",
        value: f.transaction_type,
        options: [
          "All",
          "PUTAWAY",
          "ADJUSTMENT",
          "PICK",
          "MOVE",
          "RECEIPT",
          "DISPATCH",
        ],
        className: "w-[200px]",
      },
      {
        key: "start_date",
        type: "search",
        label: "Start Date",
        value: f.start_date,
        placeholder: "YYYY-MM-DD",
        className: "w-[180px]",
      },
      {
        key: "end_date",
        type: "search",
        label: "End Date",
        value: f.end_date,
        placeholder: "YYYY-MM-DD",
        className: "w-[180px]",
      },
    ],
    [f],
  );

  return {
    loading,
    f,
    setF,
    filters,
    data,
    pagination,
    refresh: fetchTransactions,
    handlePageChange,
  };
}