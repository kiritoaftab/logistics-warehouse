import http from "../../../../api/http";

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
