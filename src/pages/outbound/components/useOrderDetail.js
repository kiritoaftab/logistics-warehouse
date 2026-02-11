// src/hooks/useOrderDetail.js
import { useEffect, useState } from "react";
import http from "@/api/http";

export function useOrderDetail(orderId, toast) {
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!orderId || orderId === "new") {
        setOrder(null);
        return;
      }
      
      console.log("Fetching order detail for ID:", orderId);
      const res = await http.get(`/sales-orders/${orderId}`);
      
      if (res.data) {
        setOrder(res.data);
        console.log("Order data loaded:", res.data);
      } else {
        setOrder(null);
        toast?.error?.("Order not found");
      }
    } catch (e) {
      console.error("Error fetching order detail:", e);
      setError(e);
      toast?.error?.(e.response?.data?.message || "Failed to load order details");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId]);

  const updateOrderStatus = async (status) => {
    try {
      const res = await http.patch(`/sales-orders/${orderId}/status`, { status });
      if (res.data?.success) {
        toast?.success?.("Order status updated successfully");
        fetchOrderDetail(); // Refresh data
        return true;
      }
    } catch (e) {
      toast?.error?.(e.response?.data?.message || "Failed to update status");
    }
    return false;
  };

  const allocateOrder = async () => {
    try {
      const res = await http.post(`/sales-orders/${orderId}/allocate`);
      if (res.data?.success) {
        toast?.success?.("Order allocated successfully");
        fetchOrderDetail();
        return true;
      }
    } catch (e) {
      toast?.error?.(e.response?.data?.message || "Failed to allocate order");
    }
    return false;
  };

  const startPicking = async () => {
    try {
      const res = await http.post(`/sales-orders/${orderId}/start-picking`);
      if (res.data?.success) {
        toast?.success?.("Picking started");
        fetchOrderDetail();
        return true;
      }
    } catch (e) {
      toast?.error?.(e.response?.data?.message || "Failed to start picking");
    }
    return false;
  };

  return {
    loading,
    error,
    order,
    refresh: fetchOrderDetail,
    updateOrderStatus,
    allocateOrder,
    startPicking,
  };
}