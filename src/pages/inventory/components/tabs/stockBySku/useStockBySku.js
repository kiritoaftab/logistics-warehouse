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
  const [summary, setSummary] = useState({
    total_on_hand: 0,
    total_available: 0,
    total_hold: 0,
    total_allocated: 0,
    total_damaged: 0,
    locations: 0,
  });

  const [f, setF] = useState({
    warehouse: "1",
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchInventoryData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [f.warehouse, f.client, f.zone, f.stockStatus, f.skuSearch]);

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

      for (const endpoint of endpoints) {
        try {
          const params = new URLSearchParams();

          if (f.warehouse && f.warehouse !== "All")
            params.append("warehouse_id", f.warehouse);
          if (f.client && f.client !== "All")
            params.append("client_name", f.client);
          if (f.zone && f.zone !== "All") params.append("zone", f.zone);

          if (f.stockStatus && f.stockStatus !== "All") {
            params.append(
              "status",
              STATUS_MAP[f.stockStatus] || f.stockStatus.toUpperCase(),
            );
          }

          if (f.skuSearch) params.append("search", f.skuSearch);

          const url = `${endpoint}${params.toString() ? `?${params}` : ""}`;
          const res = await http.get(url);

          if (res.data?.success) {
            inventoryResponse = res.data;
            break;
          }
        } catch (e) {
          // try next
        }
      }

      if (!inventoryResponse)
        throw new Error("No inventory endpoint returned data");

      const inventory =
        inventoryResponse.data?.inventory ||
        inventoryResponse.data?.items ||
        inventoryResponse.data ||
        [];

      const summaryData = inventoryResponse.data?.summary || {
        total_on_hand: inventory.reduce(
          (s, it) => s + toNum(it.on_hand_qty ?? it.on_hand),
          0,
        ),
        total_available: inventory.reduce(
          (s, it) => s + toNum(it.available_qty ?? it.available),
          0,
        ),
        total_hold: inventory.reduce(
          (s, it) => s + toNum(it.hold_qty ?? it.hold),
          0,
        ),
        total_allocated: inventory.reduce(
          (s, it) => s + toNum(it.allocated_qty ?? it.allocated),
          0,
        ),
        total_damaged: inventory.reduce(
          (s, it) => s + toNum(it.damaged_qty ?? it.damaged),
          0,
        ),
        locations: new Set(
          inventory.map((it) => it.location_id).filter(Boolean),
        ).size,
      };

      setInventoryData(inventory);
      setSummary(summaryData);

      if (inventory.length) {
        const zonesFromInventory = [
          "All",
          ...new Set(
            inventory
              .map((it) => it.location?.zone || it.zone)
              .filter(Boolean)
              .sort(),
          ),
        ];
        if (zonesFromInventory.length > 1) setZones(zonesFromInventory);
      }
    } catch (e) {
      console.error(e);
      toast?.info?.("Using sample data. Please check API endpoints.");
      setInventoryData([]);
      setSummary({
        total_on_hand: 0,
        total_available: 0,
        total_hold: 0,
        total_allocated: 0,
        total_damaged: 0,
        locations: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const tableData = useMemo(() => {
    if (!Array.isArray(inventoryData) || !inventoryData.length) return [];

    const skuMap = new Map();

    inventoryData.forEach((item, idx) => {
      const skuId = item.sku_id || item.sku?.id || `sku-${idx}`;
      const skuCode = item.sku?.sku_code || `SKU-${item.sku_id || idx}`;
      const skuName = item.sku?.sku_name || "Unknown SKU";

      if (!skuMap.has(skuId)) {
        skuMap.set(skuId, {
          id: item.id || skuId,
          sku: skuCode,
          name: skuName,
          category: item.sku?.category || "N/A",
          uom: item.sku?.uom || "EA",
          onHand: 0,
          available: 0,
          hold: 0,
          allocated: 0,
          damaged: 0,
          locations: new Set(),
          status: item.status || "HEALTHY",
          img: `https://ui-avatars.com/api/?name=${encodeURIComponent(skuCode)}&background=random&color=fff`,
          raw: [],
        });
      }

      const row = skuMap.get(skuId);
      row.onHand += toNum(item.on_hand_qty ?? item.on_hand);
      row.available += toNum(item.available_qty ?? item.available);
      row.hold += toNum(item.hold_qty ?? item.hold);
      row.allocated += toNum(item.allocated_qty ?? item.allocated);
      row.damaged += toNum(item.damaged_qty ?? item.damaged);

      if (item.location?.location_code)
        row.locations.add(item.location.location_code);
      else if (item.location_code) row.locations.add(item.location_code);

      row.status = worstStatus(row.status, item.status);
      row.raw.push(item);
    });

    return Array.from(skuMap.values()).map((s) => ({
      ...s,
      onHand: s.onHand.toLocaleString(),
      available: s.available.toLocaleString(),
      hold: s.hold.toLocaleString(),
      allocated: s.allocated.toLocaleString(),
      damaged: s.damaged.toLocaleString(),
      locations: Array.from(s.locations).join(", ") || "No location",
      risk: s.status,
    }));
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
        key: "skuSearch",
        type: "search",
        label: "SKU Search",
        value: f.skuSearch,
        placeholder: "Search SKU Code or Name...",
        className: "w-[260px]",
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
  };
}
