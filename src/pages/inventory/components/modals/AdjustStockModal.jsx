import React, { useEffect, useState } from "react";
import BaseModal from "./BaseModal";
import http from "@/api/http";
import PaginatedClientDropdown from "@/pages/components/paginations/PaginatedUserDropdown";
import PaginatedDropdown from "../PaginatedDropdown";
import { useToast } from "../../../components/toast/ToastProvider";

const AdjustStockModal = ({ open, onClose }) => {
  const toast = useToast();
  const [warehouses, setWarehouses] = useState([]);

  const [form, setForm] = useState({
    warehouse_id: "",
    client_id: "",
    sku_id: "",
    location_id: "",
    adjustment_type: "SET",
    qty: "",
    reason: "",
    notes: "",
  });

  useEffect(() => {
    if (!open) return;
    http.get("/warehouses").then((res) => setWarehouses(res?.data?.data || []));
  }, [open]);

  const submit = async () => {
    if (!form.qty || !form.sku_id || !form.location_id) {
      toast.error("Missing required fields");
      return;
    }
    try {
      const res = await http.post("/inventory/adjust", {
        ...form,
        qty: Number(form.qty),
      });
      toast.success(res?.data?.message);
      setForm({
        warehouse_id: "",
        client_id: "",
        sku_id: "",
        location_id: "",
        adjustment_type: "SET",
        qty: "",
        reason: "",
        notes: "",
      });
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to move stock");
    }
  };

  const resetandclose = () => {
    setForm({
      warehouse_id: "",
      client_id: "",
      sku_id: "",
      location_id: "",
      adjustment_type: "SET",
      qty: "",
      reason: "",
      notes: "",
    });
    onClose();
  };

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Adjust Stock"
      footer={
        <>
          <button onClick={resetandclose} className="px-4 py-2 text-sm">
            Cancel
          </button>
          <button
            onClick={submit}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white"
          >
            Save Adjustment
          </button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        {/* Warehouse */}
        <select
          className="col-span-2 rounded-md border px-3 py-2 text-sm"
          value={form.warehouse_id}
          onChange={(e) =>
            setForm({ ...form, warehouse_id: e.target.value, location_id: "" })
          }
        >
          <option value="">Select Warehouse</option>
          {warehouses.map((w) => (
            <option key={w.id} value={w.id}>
              {w.warehouse_name}
            </option>
          ))}
        </select>

        {/* Client */}
        <div className="col-span-2">
          <PaginatedClientDropdown
            value={form.client_id}
            onChange={(id) => setForm({ ...form, client_id: id, sku_id: "" })}
          />
        </div>

        {/* SKU */}
        <PaginatedDropdown
          endpoint="/skus"
          value={form.sku_id}
          onChange={(id) => setForm({ ...form, sku_id: id })}
          placeholder="Select SKU"
          renderItem={(sku) => ({
            title: `${sku.sku_name} (${sku.sku_code})`,
            subtitle: `Client: ${sku.client?.client_name}`,
          })}
        />

        {/* Location */}
        <PaginatedDropdown
          endpoint={`/locations?warehouse_id=${form.warehouse_id}`}
          value={form.location_id}
          onChange={(id) => setForm({ ...form, location_id: id })}
          placeholder="Select Location"
          disabled={!form.warehouse_id}
          renderItem={(loc) => ({
            title: loc.location_code,
            subtitle: `${loc.location_type} • ${loc.warehouse?.warehouse_code}`,
          })}
        />

        {/* Adjustment Type */}
        <select
          className="rounded-md border px-3 py-2 text-sm"
          value={form.adjustment_type}
          onChange={(e) =>
            setForm({ ...form, adjustment_type: e.target.value })
          }
        >
          <option value="ADD">ADD</option>
          <option value="SUBTRACT">SUBTRACT</option>
          <option value="SET">SET</option>
        </select>

        {/* Qty */}
        <input
          type="number"
          placeholder="Quantity"
          className="rounded-md border px-3 py-2 text-sm"
          value={form.qty}
          onChange={(e) => setForm({ ...form, qty: e.target.value })}
        />

        {/* Reason */}
        <input
          className="col-span-2 rounded-md border px-3 py-2 text-sm"
          placeholder="Reason"
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
        />

        {/* Notes */}
        <textarea
          className="col-span-2 rounded-md border px-3 py-2 text-sm"
          placeholder="Notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
      </div>
    </BaseModal>
  );
};

export default AdjustStockModal;
