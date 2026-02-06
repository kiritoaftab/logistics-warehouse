import { useEffect, useMemo, useState } from "react";
import http from "@/api/http";
import { toNum, worstStatus } from "../../inventoryFormatters";

const STATUS_MAP = {
  Healthy: "HEALTHY",
  "Low Stock": "LOW_STOCK",
  "Expiry Risk": "EXPIRY_RISK",
  "QC Hold": "HOLD",
  "Out of Stock": "OUT_OF_STOCK",
  Damaged: "DAMAGED",
};

export function useStockBySku(toast) {
  const [loading, setLoading] = useState(true);

  const [inventoryData, setInventoryData] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 10,
  });
  const [summary, setSummary] = useState({
    total_on_hand: 0,
    total_available: 0,
    total_hold: 0,
    total_allocated: 0,
    total_damaged: 0,
    locations: 0,
  });

  const [f, setF] = useState({
    warehouse: "5",
    client: "All",
    skuSearch: "",
    zone: "All",
    stockStatus: "All",
  });

  const [warehouses, setWarehouses] = useState([
    { value: "1", label: "WH001 - Main Mumbai Warehouse" },
  ]);
  const [clients, setClients] = useState(["All"]);
  const [zones, setZones] = useState(["All"]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [f.warehouse, f.client, f.zone, f.stockStatus, f.skuSearch]);

  useEffect(() => {
    fetchInventoryData();
  }, [f.warehouse, f.client, f.zone, f.stockStatus, f.skuSearch, page]);

  const fetchInitialData = async () => {
    try {
      await Promise.all([fetchWarehouses(), fetchClients(), fetchZones()]);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const res = await http.get("/warehouses");
      if (res.data?.success) {
        const list = res.data.data || [];
        const options = list.map((w) => ({
          value: String(w.id),
          label: `${w.warehouse_code} - ${w.warehouse_name}`,
        }));
        if (options.length) setWarehouses(options);
      }
    } catch (e) {
      console.error(e);
      toast?.error?.("Failed to load warehouses");
    }
  };

  const fetchClients = async () => {
    try {
      const res = await http.get("/clients");
      if (res.data?.success) {
        const data = res.data.data || {};
        // your backend seems inconsistent; handle both array + object
        const maybe = data.clients || data;
        setClients(
          Array.isArray(maybe)
            ? ["All", ...maybe.map((c) => c.client_name || c)]
            : ["All"],
        );
      }
    } catch (e) {
      console.error(e);
      toast?.error?.("Failed to load clients");
    }
  };

  const fetchZones = async () => {
    try {
      const res = await http.get("/locations");
      if (res.data?.success) {
        const locations = res.data.data?.locations || res.data.data || [];
        const unique = [
          "All",
          ...new Set(
            locations
              .map((l) => l.zone)
              .filter(Boolean)
              .sort(),
          ),
        ];
        setZones(unique.length ? unique : ["All"]);
      }
    } catch (e) {
      console.error(e);
      setZones(["All", "A", "B", "C", "D"]);
    }
  };

  const fetchInventoryData = async () => {
    try {
      setLoading(true);

      const endpoints = [
        "/inventory",
        "/inventory/stock",
        "/inventory/items",
        "/inventory/all",
      ];

      let inventoryResponse = null;

      // 1) hit first working endpoint
      for (const endpoint of endpoints) {
        try {
          const params = new URLSearchParams();

          // filters
          if (f.warehouse && f.warehouse !== "All")
            params.append("warehouse_id", f.warehouse);
          if (f.client && f.client !== "All")
            params.append("client_name", f.client);
          if (f.zone && f.zone !== "All") params.append("zone", f.zone);

          if (f.stockStatus && f.stockStatus !== "All") {
            params.append(
              "status",
              STATUS_MAP[f.stockStatus] || String(f.stockStatus).toUpperCase(),
            );
          }

          if (f.skuSearch) params.append("search", f.skuSearch);

          // pagination
          params.append("page", String(page));
          params.append("limit", String(pagination.limit || 10));

          const url = `${endpoint}${params.toString() ? `?${params.toString()}` : ""}`;
          const res = await http.get(url);

          if (res.data?.success) {
            inventoryResponse = res.data;
            break;
          }
        } catch (e) {
          console.log(e);
        }
      }

      if (!inventoryResponse)
        throw new Error("No inventory endpoint returned data");

      const payload = inventoryResponse.data ?? {};
      const rows = payload;

      const apiPagination = inventoryResponse.pagination || {};

      setPagination(apiPagination);

      const apiSummary = payload.summary;

      const computedSummary = {
        total_on_hand: rows.reduce(
          (s, it) => s + toNum(it.on_hand_qty ?? it.on_hand),
          0,
        ),
        total_available: rows.reduce(
          (s, it) => s + toNum(it.available_qty ?? it.available),
          0,
        ),
        total_hold: rows.reduce(
          (s, it) => s + toNum(it.hold_qty ?? it.hold),
          0,
        ),
        total_allocated: rows.reduce(
          (s, it) => s + toNum(it.allocated_qty ?? it.allocated),
          0,
        ),
        total_damaged: rows.reduce(
          (s, it) => s + toNum(it.damaged_qty ?? it.damaged),
          0,
        ),
        locations: new Set(
          rows.map((it) => it.location_id ?? it.location?.id).filter(Boolean),
        ).size,
      };

      setInventoryData(rows);
      setSummary(apiSummary || computedSummary);

      if (rows.length) {
        const zonesFromRows = [
          "All",
          ...new Set(
            rows
              .map((it) => it.location?.zone || it.zone)
              .filter(Boolean)
              .sort(),
          ),
        ];
        if (zonesFromRows.length > 1) setZones(zonesFromRows);
      }
    } catch (e) {
      console.error(e);
      toast?.error?.(
        "Failed to load inventory. Please check API endpoint/params.",
      );
      setInventoryData([]);
      setSummary({
        total_on_hand: 0,
        total_available: 0,
        total_hold: 0,
        total_allocated: 0,
        total_damaged: 0,
        locations: 0,
      });
      setPagination((p) => ({ ...p, total: 0, page: 1, pages: 1 }));
    } finally {
      setLoading(false);
    }
  };

  const tableData = useMemo(() => {
    if (!Array.isArray(inventoryData)) return [];

    return inventoryData.map((item) => {
      const zone = item.location?.zone || "-";
      const locCode = item.location?.location_code || "-";

      return {
        id: item.id,

        sku: item.sku?.sku_code || "-",
        name: item.sku?.sku_name || "-",
        category: item.sku?.category || "-",
        uom: item.sku?.uom || "-",

        onHand: toNum(item.on_hand_qty).toLocaleString(),
        available: toNum(item.available_qty).toLocaleString(),
        hold: toNum(item.hold_qty).toLocaleString(),
        allocated: toNum(item.allocated_qty).toLocaleString(),
        damaged: toNum(item.damaged_qty).toLocaleString(),

        // ✅ combined location display
        locations: `${zone} - ${locCode}`,

        batch: item.batch_no || "-",
        expiry: item.expiry_date
          ? new Date(item.expiry_date).toLocaleDateString()
          : "-",

        risk: item.status || "HEALTHY",

        img: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          item.sku?.sku_code || "SKU",
        )}&background=random&color=fff`,

        raw: item,
      };
    });
  }, [inventoryData]);

  const filters = useMemo(
    () => [
      {
        key: "warehouse",
        type: "select",
        label: "Warehouse",
        value: f.warehouse,
        options: warehouses,
        className: "w-[240px]",
      },
      {
        key: "client",
        type: "select",
        label: "Client",
        value: f.client,
        options: clients,
        className: "w-[180px]",
      },

      {
        key: "zone",
        type: "select",
        label: "Zone",
        value: f.zone,
        options: zones,
        className: "w-[120px]",
      },
      {
        key: "stockStatus",
        type: "select",
        label: "Stock Status",
        value: f.stockStatus,
        options: [
          "All",
          "Healthy",
          "Low Stock",
          "Expiry Risk",
          "QC Hold",
          "Out of Stock",
          "Damaged",
        ],
        className: "w-[160px]",
      },
      {
        key: "skuSearch",
        type: "search",
        label: "SKU Search",
        value: f.skuSearch,
        placeholder: "Search SKU Code or Name...",
        className: "w-[260px]",
      },
    ],
    [clients, f, warehouses, zones],
  );

  const resetFilters = () =>
    setF({
      warehouse: "1",
      client: "All",
      skuSearch: "",
      zone: "All",
      stockStatus: "All",
    });

  return {
    loading,
    f,
    setF,
    filters,
    resetFilters,
    warehouses,
    inventoryData,
    summary,
    tableData,
    refresh: fetchInventoryData,
    pagination,
    page,
    setPage,
  };
}
