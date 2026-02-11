import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

import FormCard from "@/pages/components/forms/FormCard";
import FormGrid from "@/pages/components/forms/FormGrid";
import { InputField, TextareaField } from "@/pages/components/forms/Field";

import PaginatedEntityDropdown from "./common/PaginatedEntityDropdown";
import {
  getWarehouses,
  getActiveDocks,
  updateAsn,
  createAsn,
  confirmAsn,
} from "../api/masters.api";
import DateTimeField from "@/pages/components/forms/DateTimeField";
import http from "@/api/http";

const BasicInformationSection = forwardRef(
  (
    {
      initialAsn,
      mode,
      dockType = "INBOUND",
      showDock = true,
      showSupplier = true,
      onChange,
      clientQuery = {},
    },
    ref,
  ) => {
    const [form, setForm] = useState({
      warehouse_id: "",
      client_id: "",
      supplier_id: "",
      dock_id: "",
      reference_no: "",
      eta: "",
      notes: "",
    });

    useEffect(() => {
      if (!initialAsn) return;

      setForm((prev) => {
        const newWarehouse = initialAsn.warehouse_id
          ? String(initialAsn.warehouse_id)
          : "";
        const newClient = initialAsn.client_id
          ? String(initialAsn.client_id)
          : "";

        // only update if actual values changed
        if (
          prev.warehouse_id === newWarehouse &&
          prev.client_id === newClient
        ) {
          return prev; // no change → no re-render
        }

        return {
          warehouse_id: newWarehouse,
          client_id: newClient,
          supplier_id: initialAsn.supplier_id
            ? String(initialAsn.supplier_id)
            : "",
          dock_id: initialAsn.dock_id ? String(initialAsn.dock_id) : "",
          reference_no: initialAsn.reference_no || "",
          eta: initialAsn.eta || "",
          notes: initialAsn.notes || "",
        };
      });
    }, [
      initialAsn?.warehouse_id,
      initialAsn?.client_id,
      initialAsn?.supplier_id,
      initialAsn?.dock_id,
      initialAsn?.reference_no,
      initialAsn?.eta,
      initialAsn?.notes,
    ]);

    const [clientList, setClientList] = useState([]);

    const [warehouses, setWarehouses] = useState([]);
    const [docks, setDocks] = useState([]);
    const [loadingMasters, setLoadingMasters] = useState(false);

    const [supplierLabel, setSupplierLabel] = useState("");
    const [clientLabel, setClientLabel] = useState("");

    const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

    // masters fetch
    useEffect(() => {
      let alive = true;
      (async () => {
        try {
          setLoadingMasters(true);
          const [wh, dk] = await Promise.all([
            getWarehouses(),
            getActiveDocks(),
          ]);
          if (!alive) return;
          setWarehouses(Array.isArray(wh) ? wh : []);
          setDocks(Array.isArray(dk) ? dk : []);
        } finally {
          if (alive) setLoadingMasters(false);
        }
      })();
      return () => {
        alive = false;
      };
    }, []);

    const warehouseLabel = useMemo(() => {
      const w = warehouses.find(
        (x) => String(x.id) === String(form.warehouse_id),
      );
      return w ? `${w.warehouse_name} (${w.warehouse_code})` : "";
    }, [warehouses, form.warehouse_id]);

    const inboundDocksForWarehouse = useMemo(() => {
      const wid = String(form.warehouse_id || "");
      return docks
        .filter((d) => String(d.warehouse_id) === wid)
        .filter((d) => String(d.dock_type || "").toUpperCase() === dockType)
        .map((d) => ({
          id: String(d.id),
          label: `${d.dock_name} (${d.dock_code})`,
        }));
    }, [docks, form.warehouse_id, dockType]);

    const warehouseOptions = useMemo(
      () =>
        warehouses.map((w) => ({
          id: String(w.id),
          label: `${w.warehouse_name} (${w.warehouse_code})`,
        })),
      [warehouses],
    );

    const validate = (action = "draft") => {
      const errs = [];

      if (action !== "confirm") return errs;

      if (!form.warehouse_id) errs.push("Warehouse is required");
      if (!form.client_id) errs.push("Client is required");

      if (dockType === "INBOUND") {
        if (showSupplier && !form.supplier_id)
          errs.push("Supplier is required");

        if (!form.eta) errs.push("ETA is required");
        else if (!toIsoOrNull(form.eta)) errs.push("ETA format is invalid");
      }

      return errs;
    };

    useImperativeHandle(ref, () => ({
      getData: () => ({ ...form }),
      validate,
      reset: () => {
        setForm({
          warehouse_id: "",
          client_id: "",
          supplier_id: "",
          dock_id: "",
          reference_no: "",
          eta: "",
          notes: "",
        });
      },

      saveHeader: async ({ mode, asnId, payload }) => {
        if (mode === "create") {
          const created = await createAsn(payload);

          const newId =
            created?.id ||
            created?.asn_id ||
            created?.data?.id ||
            created?.data?.asn_id;

          return { asnId: newId, asn: created };
        }

        if (!asnId) throw new Error("ASN ID is required for update");
        const updated = await updateAsn(asnId, payload);
        return { asnId, asn: updated };
      },

      confirmAsn: async ({ asnId }) => {
        const res = await http.post(`/asns/${asnId}/confirm`);
        return res?.data;
      },
    }));

    const onChangeRef = useRef(onChange);
    useEffect(() => {
      onChangeRef.current = onChange;
    }, [onChange]);

    const snapshot = useMemo(
      () => ({
        ...form,
        warehouse_label: warehouseLabel,
        supplier_label: supplierLabel,
        client_label: clientLabel,
      }),
      [form, warehouseLabel, supplierLabel, clientLabel],
    );

    useEffect(() => {
      onChangeRef.current?.(snapshot);
    }, [snapshot]);

    return (
      <FormCard title="Basic Information">
        <FormGrid>
          {/* Warehouse */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Warehouse <span className="text-red-500">*</span>
            </label>
            <select
              value={form.warehouse_id}
              disabled={loadingMasters}
              onChange={(e) => set("warehouse_id", e.target.value)}
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm
             focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
            >
              <option value="">Select warehouse</option>
              {warehouseOptions.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500">
              Selected: {warehouseLabel || "None"}
            </p>
          </div>

          {/* Client */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client <span className="text-red-500">*</span>
            </label>
            <PaginatedEntityDropdown
              endpoint="/clients"
              listKey="clients"
              value={form.client_id}
              query={clientQuery}
              onChange={(id, clientObj) => {
                set("client_id", id);
                setClientLabel(
                  clientObj
                    ? `${clientObj.client_name} (${clientObj.client_code})`
                    : "",
                );
              }}
              placeholder="Select client"
              renderItem={(c) => ({
                title: `${c.client_name} (${c.client_code})`,
                subtitle: `${c.email || "-"} • ${c.phone || "-"}`,
              })}
            />
          </div>

          {/* Supplier */}
          {showSupplier && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supplier <span className="text-red-500">*</span>
              </label>
              <PaginatedEntityDropdown
                endpoint="/suppliers"
                listKey="suppliers"
                value={form.supplier_id}
                onChange={(id) => {
                  set("supplier_id", id);
                  setSupplierLabel(`Supplier: ${id}`);
                }}
                placeholder="Select supplier"
                renderItem={(s) => ({
                  title: `${s.supplier_name} (${s.supplier_code})`,
                  subtitle: `${s.email || "-"} • ${s.phone || "-"}`,
                })}
              />
            </div>
          )}
          {/* Dock */}
          {showDock && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dock Door
              </label>
              <select
                value={form.dock_id}
                disabled={!form.warehouse_id}
                onChange={(e) => set("dock_id", e.target.value)}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
              >
                <option value="">
                  {form.warehouse_id
                    ? `Select dock (${dockType.toLowerCase()})`
                    : "Select warehouse first"}
                </option>
                {inboundDocksForWarehouse.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500">
                Note: warehouse is required to load docks.
              </p>
            </div>
          )}

          <InputField
            label="Reference No"
            placeholder="e.g. PO-2024-002"
            value={form.reference_no}
            onChange={(v) => set("reference_no", v)}
          />

          <DateTimeField
            label="Expected Arrival (ETA)"
            required
            value={form.eta}
            onChange={(v) => set("eta", v)}
          />

          <TextareaField
            label="Notes"
            placeholder="Internal notes for receiving team…"
            value={form.notes}
            onChange={(v) => set("notes", v)}
          />
        </FormGrid>
      </FormCard>
    );
  },
);

export default BasicInformationSection;
