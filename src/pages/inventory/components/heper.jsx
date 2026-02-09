import http from "@/api/http";

// CREATE HOLD
export const createInventoryHold = (payload) =>
  http.post("/inventory-holds", payload);

// RELEASE HOLD
export const releaseInventoryHold = (id, notes) =>
  http.post(`/inventory-holds/${id}/release`, {
    release_notes: notes,
  });

// DELETE HOLD
export const deleteInventoryHold = (id) =>
  http.delete(`/inventory-holds/${id}`);

// GET HOLDS (list)
export const getInventoryHolds = (params = {}) =>
  http.get("/inventory-holds", { params });
