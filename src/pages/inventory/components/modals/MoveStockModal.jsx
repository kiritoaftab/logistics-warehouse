// inventory/modals/MoveStockModal.jsx
import React, { useEffect, useState } from "react";
import BaseModal from "./BaseModal";
import http from "@/api/http";
import PaginatedDropdown from "../PaginatedDropdown";
import { useToast } from "../../../components/toast/ToastProvider";

const MoveStockModal = ({ open, onClose }) => {
  const toast = useToast();
  const [form, setForm] = useState({
    warehouse_id: "",
    sku_id: "",
    from_location_id: "",
    to_location_id: "",
    adjustment_type: "SET",
    batch_no: "",
    serial_no: "",
    expiry_date: "",
    qty: "",
    reason: "",
    notes: "",
  });

  const [selectedSku, setSelectedSku] = useState(null);
  const [warehouses, setWarehouses] = useState([]);

  const submit = async () => {
    if (
      !form.sku_id ||
      !form.from_location_id ||
      !form.to_location_id ||
      !form.qty
    ) {
      toast.error("Missing required fields");
      return;
    }
    if (form.from_location_id === form.to_location_id) {
      toast.error("From & To locations cannot be same");
      return;
    }
    try {
      await http.post("/inventory/transfer", {
        ...form,
        qty: Number(form.qty),
      });

      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to move stock");
    }
  };

  useEffect(() => {
    if (!open) return;

    http.get("/warehouses").then((res) => {
      setWarehouses(res?.data?.data || []);
    });
  }, [open]);

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Move Stock"
      footer={
        <>
          <button onClick={onClose} className="px-4 py-2 text-sm">
            Cancel
          </button>
          <button
            onClick={submit}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white"
          >
            Transfer
          </button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <select
          className="col-span-2 rounded-md border px-3 py-2 text-sm"
          value={form.warehouse_id}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              warehouse_id: e.target.value,
              from_location_id: "",
              to_location_id: "",
            }))
          }
        >
          <option value="">Select Warehouse</option>
          {warehouses.map((w) => (
            <option key={w.id} value={w.id}>
              {w.warehouse_name}
            </option>
          ))}
        </select>

        <PaginatedDropdown
          endpoint="/skus"
          value={form.sku_id}
          onChange={(sku) => {
            setForm((prev) => ({
              ...prev,
              sku_id: sku,
            }));
          }}
          placeholder="Select SKU"
          renderItem={(sku) => ({
            title: `${sku.sku_name} (${sku.sku_code})`,
            subtitle: `Client: ${sku.client?.client_name}`,
          })}
        />

        <input
          placeholder="Quantity"
          type="number"
          className="rounded-md border px-3 py-2 text-sm"
          value={form.qty}
          onChange={(e) => setForm({ ...form, qty: e.target.value })}
        />
        <PaginatedDropdown
          endpoint="/locations"
          params={{ warehouse_id: form.warehouse_id }}
          value={form.from_location_id}
          disabled={!form.warehouse_id}
          onChange={(loc) => {
            setForm((prev) => ({
              ...prev,
              from_location_id: loc,
            }));
          }}
          placeholder="From Location"
          renderItem={(loc) => ({
            title: loc.location_code,
            subtitle: loc.location_type,
          })}
        />

        <PaginatedDropdown
          endpoint="/locations"
          params={{ warehouse_id: form.warehouse_id }}
          value={form.to_location_id}
          disabled={!form.warehouse_id}
          onChange={(loc) =>
            setForm((prev) => ({
              ...prev,
              to_location_id: loc,
            }))
          }
          placeholder="To Location"
          renderItem={(loc) => ({
            title: loc.location_code,
            subtitle: loc.location_type,
          })}
        />
        <select
          className="rounded-md border px-3 py-2 text-sm col-span-2"
          value={form.adjustment_type}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              adjustment_type: e.target.value,
            }))
          }
        >
          <option value="SET">SET – Overwrite quantity</option>
          <option value="ADD">ADD – Add to existing</option>
          <option value="SUBTRACT">SUBTRACT – Remove from existing</option>
        </select>
        {form.adjustment_type === "SET" && (
          <p className="col-span-2 text-xs text-orange-600">
            ⚠ SET will overwrite quantity at destination location
          </p>
        )}
        {selectedSku?.requires_batch_tracking && (
          <input
            placeholder="Batch No"
            className="rounded-md border px-3 py-2 text-sm"
            value={form.batch_no}
            onChange={(e) => setForm({ ...form, batch_no: e.target.value })}
          />
        )}

        {selectedSku?.requires_serial_tracking && (
          <input
            placeholder="Serial No"
            className="rounded-md border px-3 py-2 text-sm"
            value={form.serial_no}
            onChange={(e) => setForm({ ...form, serial_no: e.target.value })}
          />
        )}

        {selectedSku?.requires_expiry_tracking && (
          <input
            type="date"
            className="rounded-md border px-3 py-2 text-sm"
            value={form.expiry_date}
            onChange={(e) => setForm({ ...form, expiry_date: e.target.value })}
          />
        )}

        <input
          className="col-span-2 rounded-md border px-3 py-2 text-sm"
          placeholder="Reason"
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
        />

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

export default MoveStockModal;
