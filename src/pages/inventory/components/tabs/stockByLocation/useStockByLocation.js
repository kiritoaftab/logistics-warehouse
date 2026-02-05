import { useEffect, useMemo, useState } from "react";
import http from "@/api/http";

export function useStockByLocation(toast) {
  const [loading, setLoading] = useState(true);
  const [locationId, setLocationId] = useState("");
  const [locations, setLocations] = useState([]);

  const [rows, setRows] = useState([]);
  const [locationInfo, setLocationInfo] = useState(null);

  useEffect(() => {
    fetchLocationsAndAutoPick();
  }, []);

  useEffect(() => {
    if (locationId) fetchLocationStock(locationId);
  }, [locationId]);

  const fetchLocationsAndAutoPick = async () => {
    try {
      setLoading(true);

      const res = await http.get("/locations");
      const ok = res.data?.success;

      if (!ok) {
        setLocations([]);
        setLocationId("");
        return;
      }

      const list = res.data.data?.locations || res.data.data || [];
      const opts = list.map((l) => ({
        value: String(l.id),
        label: `${l.location_code}${l.zone ? ` (Zone ${l.zone})` : ""}`,
      }));

      setLocations(opts);

      // auto pick first location
      if (opts.length) setLocationId(opts[0].value);
    } catch (e) {
      console.error("locations error:", e);
      toast?.error?.("Failed to load locations");
      setLocations([]);
      setLocationId("");
    } finally {
      setLoading(false);
    }
  };

  const fetchLocationStock = async (locId) => {
    try {
      setLoading(true);
      console.log("HITTING API:", `/inventory/location/${locId}`);

      const res = await http.get(`/inventory/location/${locId}`);
      if (!res.data?.success) {
        setRows([]);
        setLocationInfo(null);
        return;
      }

      setRows(res.data.data?.inventory || []);
      setLocationInfo(res.data.data?.location_info || null);
    } catch (e) {
      console.error("location stock error:", e);
      toast?.error?.("Failed to load stock by location");
      setRows([]);
      setLocationInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const filters = useMemo(
    () => [
      {
        key: "locationId",
        type: "select",
        label: "Location",
        value: locationId,
        options: locations,
        className: "w-[320px]",
      },
    ],
    [locationId, locations],
  );

  return {
    loading,
    locationId,
    setLocationId,
    filters,
    rows,
    locationInfo,
    refresh: () => locationId && fetchLocationStock(locationId),
  };
}
