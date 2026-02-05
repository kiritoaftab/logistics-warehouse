import React, { use, useEffect, useMemo, useState } from "react";
import http from "../../../../api/http";
import { Modal, Field } from "../helper";
import { useToast } from "../../../components/toast/ToastProvider";

const billingTypes = ["PREPAID", "POSTPAID", "COD"];

const ClientModal = ({ open, mode = "create", client, onClose, onSaved }) => {
  const initial = useMemo(
    () => ({
      client_name: "",
      client_code: "",
      contact_person: "",
      email: "",
      phone: "",
      billing_address: "",
      billing_type: "POSTPAID",
      payment_terms: "",
      tax_id: "",
    }),
    [],
  );
  const toast = useToast();
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [errors, setErrors] = useState({});
  const isValidEmail = (email) => {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
    return re.test(String(email).toLowerCase());
  };

  const isValidPhone = (phone) => {
    const re = /^\d{10}$/;
    return re.test(String(phone));
  };

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && client) {
      setForm({
        client_name: client.client_name || "",
        client_code: client.client_code || "",
        contact_person: client.contact_person || "",
        email: client.email || "",
        phone: client.phone || "",
        billing_address: client.billing_address || "",
        billing_type: client.billing_type || "POSTPAID",
        payment_terms: client.payment_terms || "",
        tax_id: client.tax_id || "",
      });
    } else {
      setForm(initial);
    }

    setErr("");
    setErrors({});
  }, [open, mode, client, initial]);

  if (!open) return null;

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};

    if (!form.client_name?.trim()) e.client_name = "Client name is required";
    // if (!form.client_code?.trim()) e.client_code = "Client code is required";
    if (!form.billing_type?.trim()) e.billing_type = "Billing type is required";

    if (!form.email?.trim()) e.email = "Email is required";
    else if (!isValidEmail(form.email)) e.email = "Enter a valid email address";

    if (form.phone?.trim() && !isValidPhone(form.phone))
      e.phone = "Enter a valid phone number (10 digits)";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;

    try {
      setErr("");
      setSaving(true);

      if (mode === "edit") {
        await http.put(`/clients/${client.id}`, form);
      } else {
        await http.post("/clients", form);
      }
      toast.success(
        `Client ${mode === "edit" ? "updated" : "created"} successfully`,
      );
      onSaved?.();
      onClose?.();
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to save client");
      toast.error("Failed to save client");
      const data = e?.response?.data;
      if (Array.isArray(data.errors)) {
        const fieldErrors = {};
        data.errors.forEach((err) => {
          fieldErrors[err.field] = err.message;
        });
        setErrors(fieldErrors);
      }
    } finally {
      setSaving(false);
    }
  };

  const title = mode === "edit" ? "Edit Client" : "Add Client";
  const subtitle =
    mode === "edit"
      ? `Update details for ${client?.client_name || "client"}`
      : "Create a new client";

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
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : mode === "edit"
                ? "Update Client"
                : "Create Client"}
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
        <Field
          label="Client Name"
          required
          value={form.client_name}
          onChange={(v) => set("client_name", v)}
          error={errors.client_name}
        />

        <Field
          label="Client Code"
          value={form.client_code}
          onChange={(v) => set("client_code", v)}
        />

        <Field
          label="Contact Person"
          value={form.contact_person}
          onChange={(v) => set("contact_person", v)}
        />

        <Field
          label="Phone"
          value={form.phone}
          onChange={(v) => {
            if (v.length > 10) return;
            if (!/^\d*$/.test(v)) return;

            set("phone", v);
          }}
        />

        <Field
          label="Email"
          value={form.email}
          error={errors.email}
          required
          onChange={(v) => set("email", v)}
        />

        {/* Billing Type (select) - keep consistent styling */}
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium text-gray-500">
            Billing Type<span className="ml-0.5 text-red-500">*</span>
          </span>
          <select
            value={form.billing_type}
            onChange={(e) => set("billing_type", e.target.value)}
            className={[
              "w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2",
              errors.billing_type
                ? "border-red-500 focus:ring-red-100"
                : "border-gray-200 focus:ring-blue-100",
            ].join(" ")}
          >
            {billingTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {errors.billing_type && (
            <span className="text-xs text-red-500">{errors.billing_type}</span>
          )}
        </div>

        {/* Billing Address */}
        <div className="md:col-span-2 flex flex-col gap-1">
          <span className="text-[11px] font-medium text-gray-500">
            Billing Address
          </span>
          <textarea
            value={form.billing_address}
            onChange={(e) => set("billing_address", e.target.value)}
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
            rows={3}
            placeholder="Billing Address"
          />
        </div>

        <Field
          label="Payment Terms"
          value={form.payment_terms}
          onChange={(v) => set("payment_terms", v)}
        />

        <Field
          label="Tax ID (GSTIN)"
          value={form.tax_id}
          onChange={(v) => set("tax_id", v)}
        />
      </div>
    </Modal>
  );
};

export default ClientModal;
