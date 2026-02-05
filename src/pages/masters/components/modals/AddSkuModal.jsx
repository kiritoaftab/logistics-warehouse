import React, { useEffect, useMemo, useState } from "react";
import http from "../../../../api/http";
import { Modal, Field } from "../helper";
import { useToast } from "../../../components/toast/ToastProvider";
import PaginatedClientDropdown from "../../../components/paginations/PaginatedUserDropdown";

const AddSkuModal = ({
  open,
  mode = "create", // create | edit
  client, // create (client_id)
  sku, // edit
  onClose,
  onCreated,
  onUpdated,
}) => {
  const toast = useToast();

  const initial = useMemo(
    () => ({
      sku_code: "",
      sku_name: "",
      description: "",
      category: "",
      uom: "EACH",
      dimensions_length: "",
      dimensions_width: "",
      dimensions_height: "",
      weight: "",
      requires_serial_tracking: false,
      requires_batch_tracking: false,
      requires_expiry_tracking: false,
      fragile: false,
      hazardous: false,
      pick_rule: "FIFO",
      putaway_zone: "",
      unit_price: "",
      currency: "INR",
    }),
    [],
  );

  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [errors, setErrors] = useState({});

  // ✅ only needed when client prop is not available
  const [selectedClientId, setSelectedClientId] = useState("");

  // reset & hydrate form
  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && sku) {
      setForm({
        sku_code: sku.sku_code || "",
        sku_name: sku.sku_name || "",
        description: sku.description || "",
        category: sku.category || "",
        uom: sku.uom || "EACH",
        dimensions_length: sku.dimensions_length ?? "",
        dimensions_width: sku.dimensions_width ?? "",
        dimensions_height: sku.dimensions_height ?? "",
        weight: sku.weight ?? "",
        requires_serial_tracking: !!sku.requires_serial_tracking,
        requires_batch_tracking: !!sku.requires_batch_tracking,
        requires_expiry_tracking: !!sku.requires_expiry_tracking,
        fragile: !!sku.fragile,
        hazardous: !!sku.hazardous,
        pick_rule: sku.pick_rule || "FIFO",
        putaway_zone: sku.putaway_zone || "",
        unit_price: sku.unit_price ?? "",
        currency: sku.currency || "INR",
      });
    } else {
      setForm(initial);
    }

    setSelectedClientId("");
    setErr("");
    setErrors({});
  }, [open, mode, sku, initial]);

  if (!open) return null;

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const effectiveClientId = client?.id || selectedClientId;

  const validate = () => {
    const e = {};

    if (mode === "create" && !effectiveClientId) e.client = "Client is missing";

    if (!form.sku_code?.trim()) e.sku_code = "SKU code is required";
    if (!form.sku_name?.trim()) e.sku_name = "SKU name is required";

    if (form.unit_price !== "" && Number.isNaN(Number(form.unit_price)))
      e.unit_price = "Unit price must be a number";

    if (form.weight !== "" && Number.isNaN(Number(form.weight)))
      e.weight = "Weight must be a number";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;

    try {
      setErr("");
      setSaving(true);

      const payload = {
        ...(mode === "create" ? { client_id: Number(effectiveClientId) } : {}),
        ...form,
        dimensions_length:
          form.dimensions_length === ""
            ? undefined
            : Number(form.dimensions_length),
        dimensions_width:
          form.dimensions_width === ""
            ? undefined
            : Number(form.dimensions_width),
        dimensions_height:
          form.dimensions_height === ""
            ? undefined
            : Number(form.dimensions_height),
        weight: form.weight === "" ? undefined : Number(form.weight),
        unit_price:
          form.unit_price === "" ? undefined : Number(form.unit_price),
      };

      if (mode === "edit") {
        await http.put(`/skus/${sku.id}`, payload);
        onUpdated?.();
      } else {
        await http.post("/skus", payload);
        onCreated?.();
      }

      toast.success(
        `SKU ${mode === "edit" ? "updated" : "created"} successfully`,
      );
      onClose?.();

      // reset
      setForm(initial);
      setSelectedClientId("");
      setErrors({});
      setErr("");
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to save SKU");
      toast.error("Failed to save SKU");

      const data = e?.response?.data;
      if (Array.isArray(data?.errors)) {
        const fieldErrors = {};
        data.errors.forEach((er) => {
          toast.error(`Field error: ${er.message}`);
          return (fieldErrors[er.field] = er.message);
        });
        setErrors(fieldErrors);
      }
    } finally {
      setSaving(false);
    }
  };

  const title = mode === "edit" ? "Edit SKU" : "Add SKU";
  const subtitle =
    mode === "edit"
      ? `Update SKU: ${sku?.sku_code || ""}`
      : client
        ? `For ${client.client_name} (${client.client_code})`
        : "Select a client";

  return (
    <Modal
      title={title}
      subtitle={subtitle}
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={submit}
            disabled={saving}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white
                       disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : mode === "edit"
                ? "Update SKU"
                : "Create SKU"}
          </button>
        </>
      }
    >
      {err && (
        <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {err}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {mode === "create" && !client?.id && (
          <div className="md:col-span-2 flex flex-col gap-1">
            <span className="text-[11px] font-medium text-gray-500">
              Select Client
            </span>

            <PaginatedClientDropdown
              value={selectedClientId}
              onChange={setSelectedClientId}
              placeholder="Select client"
              limit={10}
              disabled={saving}
            />

            {errors.client && (
              <p className="text-xs text-red-600 mt-1">{errors.client}</p>
            )}
          </div>
        )}

        <Field
          label="SKU Code"
          required
          value={form.sku_code}
          onChange={(v) => set("sku_code", v)}
          error={errors.sku_code}
        />

        <Field
          label="SKU Name"
          required
          value={form.sku_name}
          onChange={(v) => set("sku_name", v)}
          error={errors.sku_name}
        />

        <div className="md:col-span-2 flex flex-col gap-1">
          <span className="text-[11px] font-medium text-gray-500">
            Description
          </span>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-100"
            rows={3}
          />
        </div>

        <Field
          label="Category"
          value={form.category}
          onChange={(v) => set("category", v)}
        />

        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium text-gray-500">UOM</span>
          <select
            value={form.uom}
            onChange={(e) => set("uom", e.target.value)}
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option value="EACH">EACH</option>
            <option value="BOX">BOX</option>
            <option value="CASE">CASE</option>
            <option value="PALLET">PALLET</option>
          </select>
        </div>

        <Field
          label="Length"
          type="number"
          value={form.dimensions_length}
          onChange={(v) => set("dimensions_length", v)}
        />
        <Field
          label="Width"
          type="number"
          value={form.dimensions_width}
          onChange={(v) => set("dimensions_width", v)}
        />
        <Field
          label="Height"
          type="number"
          value={form.dimensions_height}
          onChange={(v) => set("dimensions_height", v)}
        />
        <Field
          label="Weight"
          type="number"
          value={form.weight}
          onChange={(v) => set("weight", v)}
          error={errors.weight}
        />

        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium text-gray-500">
            Pick Rule
          </span>
          <select
            value={form.pick_rule}
            onChange={(e) => set("pick_rule", e.target.value)}
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option value="FIFO">FIFO</option>
            <option value="LIFO">LIFO</option>
            <option value="FEFO">FEFO</option>
          </select>
        </div>

        <Field
          label="Putaway Zone"
          value={form.putaway_zone}
          onChange={(v) => set("putaway_zone", v)}
        />

        <Field
          label="Unit Price"
          type="number"
          value={form.unit_price}
          onChange={(v) => set("unit_price", v)}
          error={errors.unit_price}
        />

        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium text-gray-500">
            Currency
          </span>
          <select
            value={form.currency}
            onChange={(e) => set("currency", e.target.value)}
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option value="INR">INR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {[
              ["requires_serial_tracking", "Serial Tracking"],
              ["requires_batch_tracking", "Batch Tracking"],
              ["requires_expiry_tracking", "Expiry Tracking"],
              ["fragile", "Fragile"],
              ["hazardous", "Hazardous"],
            ].map(([k, label]) => (
              <label
                key={k}
                className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={!!form[k]}
                  onChange={(e) => set(k, e.target.checked)}
                />
                {label}
              </label>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddSkuModal;
