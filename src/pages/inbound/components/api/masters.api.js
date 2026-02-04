import http from "@/api/http";

export const getWarehouses = async () => {
  const res = await http.get("/warehouses");
  return res?.data?.data || [];
};

export const getActiveDocks = async () => {
  const res = await http.get("/docks/?showIsActive=true");
  return res?.data?.data || [];
};

export const createAsn = async (payload) => {
  const res = await http.post("/asns", payload);
  return res?.data?.data || res?.data;
};

export const updateAsn = async (asnId, payload) => {
  const res = await http.put(`/asns/${asnId}`, payload);
  return res?.data?.data || res?.data;
};

export const confirmAsn = async (asnId) => {
  const res = await http.post(`/asns/${asnId}/confirm`);
  return res?.data?.data || res?.data;
};

export const getPallets = async () => {
  const res = await http.get("/pallets");
  return res?.data?.data || res?.data || [];
};

export const createPallet = async ({
  warehouse_id,
  pallet_type,
  current_location,
}) => {
  const res = await http.post("/pallets", {
    warehouse_id,
    pallet_type,
    current_location,
  });
  return res?.data?.data || res?.data;
};

export const updatePallet = async (id, payload) => {
  const res = await http.put(`/pallets/${id}`, payload);
  return res?.data?.data || res?.data;
};

const unwrap = (res) => res?.data?.data ?? res?.data;

export const createAsnLine = async (payload) => {
  const res = await http.post("/asn-lines", payload);
  return unwrap(res);
};

export const updateAsnLine = async (id, payload) => {
  const res = await http.put(`/asn-lines/${id}`, payload);
  return unwrap(res);
};

export const deleteAsnLine = async (id) => {
  const res = await http.delete(`/asn-lines/${id}`);
  return unwrap(res);
};

export const getAsnLinePallets = async (asnLineId) => {
  const res = await http.get(`/asn-lines/${asnLineId}/pallets`);
  return unwrap(res) || [];
};
