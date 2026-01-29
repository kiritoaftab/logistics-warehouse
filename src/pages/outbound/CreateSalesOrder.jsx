// CreateSalesOrder.jsx
import React, { useMemo, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import FormPage from "../components/forms/FormPage";
import FormCard from "../components/forms/FormCard";
import FormGrid from "../components/forms/FormGrid";
import {
  InputField,
  SelectField,
  TextareaField,
} from "../components/forms/Field";
import SummaryCard from "../components/forms/SummaryCard";
import ChecklistCard from "../components/forms/ChecklistCard";
import AttachmentsDropzone from "../components/forms/AttachmentsDropzone";
import OrderLines from "./components/OrderLines";

// ---------- small reusable bits (can move to components later) ----------
const Switch = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange?.(!checked)}
    className={[
      "relative inline-flex h-6 w-11 items-center rounded-full transition",
      checked ? "bg-blue-600" : "bg-gray-200",
    ].join(" ")}
    aria-pressed={checked}
  >
    <span
      className={[
        "inline-block h-5 w-5 transform rounded-full bg-white transition",
        checked ? "translate-x-5" : "translate-x-1",
      ].join(" ")}
    />
  </button>
);

const ToggleRow = ({ title, desc, checked, onChange, disabled }) => (
  <div className="flex items-start justify-between gap-4">
    <div className="min-w-0">
      <div className="text-sm font-semibold text-gray-900">{title}</div>
      {desc && <div className="text-xs text-gray-500 mt-0.5">{desc}</div>}
    </div>
    <div className={disabled ? "opacity-40 pointer-events-none" : ""}>
      <Switch checked={checked} onChange={onChange} />
    </div>
  </div>
);

// ----------------------------------------------------------------------

const CreateSalesOrder = () => {
  const [header, setHeader] = useState({
    warehouse: "WH-NYC-01",
    client: "Acme Corp",
    orderRef: "",
    orderDate: "10/25/2023, 02:30 PM",
    priority: "Normal",
    orderType: "Standard",
    slaDueDate: "",
  });

  const [shipTo, setShipTo] = useState({
    name: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    pincode: "",
    gstin: "",
    instructions: "",
  });

  const [shipping, setShipping] = useState({
    carrier: "Client Carrier",
    serviceLevel: "Standard Ground",
    packagingPreference: "Standard Carton",
    codAmount: "0.00",
    awbTracking: "",
  });

  const [alloc, setAlloc] = useState({
    autoAllocateOnConfirm: true,
    allowPartial: true,
    reserveInventory: true,
    allowSubstituteSku: false,
  });

  const [lines, setLines] = useState([
    {
      id: "1",
      sku: "SKU-9001",
      name: "Wireless Headphones",
      uom: "Each",
      qty: 10,
      allocationRule: "FIFO",
      note: "",
    },
    {
      id: "2",
      sku: "",
      name: "",
      uom: "Each",
      qty: 0,
      allocationRule: "FIFO",
      note: "",
    },
  ]);

  const [attachments, setAttachments] = useState([]);

  const setH = (k, v) => setHeader((p) => ({ ...p, [k]: v }));
  const setS = (k, v) => setShipTo((p) => ({ ...p, [k]: v }));
  const setSh = (k, v) => setShipping((p) => ({ ...p, [k]: v }));

  const totals = useMemo(() => {
    const totalLines = lines.filter((l) => l.sku || l.name).length;
    const totalUnits = lines.reduce((s, l) => s + (Number(l.qty) || 0), 0);
    return { totalLines, totalUnits };
  }, [lines]);

  const readiness = useMemo(() => {
    const okWarehouse = !!header.warehouse;
    const okClient = !!header.client;
    const okShipTo = !!shipTo.name && !!shipTo.phone && !!shipTo.address1;
    const okLines = totals.totalLines > 0 && totals.totalUnits > 0;

    return [
      { label: "Warehouse Selected", done: okWarehouse },
      { label: "Client Selected", done: okClient },
      { label: "Ship-to Filled", done: okShipTo },
      { label: "Lines Added (>0)", done: okLines },
    ];
  }, [header, shipTo, totals]);

  const summaryData = useMemo(
    () => ({
      asnNumber: "Generated on save", // reuse SummaryCard, label stays
      supplier: header.client || "-",
      expectedArrival: shipTo.name || "-",
      lines: totals.totalLines,
      units: totals.totalUnits,
    }),
    [header, shipTo, totals],
  );

  const addLine = () =>
    setLines((p) => [
      ...p,
      {
        id: String(Date.now()),
        sku: "",
        name: "",
        uom: "Each",
        qty: 0,
        allocationRule: "FIFO",
        note: "",
      },
    ]);

  const updateLine = (idx, patch) =>
    setLines((p) => p.map((l, i) => (i === idx ? { ...l, ...patch } : l)));

  const removeLine = (idx) => setLines((p) => p.filter((_, i) => i !== idx));

  const onSaveDraft = () =>
    console.log("Save Draft SO", {
      header,
      shipTo,
      shipping,
      alloc,
      lines,
      attachments,
    });

  const onConfirm = () =>
    console.log("Save & Confirm SO", {
      header,
      shipTo,
      shipping,
      alloc,
      lines,
      attachments,
    });

  return (
    <FormPage
      breadcrumbs={[
        { label: "Outbound", to: "/outbound" },
        { label: "Create Sales Order" },
      ]}
      title="Create Sales Order"
      topActions={
        <>
          <button className="px-4 py-2 border rounded-md text-sm bg-white">
            Cancel
          </button>
          <button
            onClick={onSaveDraft}
            className="px-4 py-2 border rounded-md text-sm bg-white"
          >
            Save Draft
          </button>
        </>
      }
      bottomLeft={
        <button className="px-4 py-2 border rounded-md text-sm bg-white">
          Cancel
        </button>
      }
      bottomRight={
        <>
          <button
            onClick={onSaveDraft}
            className="px-4 py-2 border rounded-md text-sm bg-white"
          >
            Save Draft
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md text-sm bg-primary text-white"
          >
            Save & Confirm
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-8 space-y-6">
          {/* Order Header */}
          <FormCard title="Order Header">
            <FormGrid>
              <SelectField
                label="Warehouse"
                required
                value={header.warehouse}
                onClick={() => console.log("open warehouse")}
              />
              <SelectField
                label="Client"
                required
                value={header.client}
                onClick={() => console.log("open client")}
              />
              <InputField
                label="Order Reference No"
                placeholder="e.g., PO-99881"
                value={header.orderRef}
                onChange={(v) => setH("orderRef", v)}
              />

              <InputField
                label="Order Date"
                value={header.orderDate}
                onChange={(v) => setH("orderDate", v)}
              />
              <SelectField
                label="Priority"
                value={header.priority}
                onClick={() =>
                  setH(
                    "priority",
                    header.priority === "Normal" ? "High" : "Normal",
                  )
                }
              />
              <SelectField
                label="Order Type"
                value={header.orderType}
                onClick={() => console.log("open order type")}
              />

              <InputField
                label="SLA Due Date"
                placeholder="mm/dd/yyyy, --:--"
                value={header.slaDueDate}
                onChange={(v) => setH("slaDueDate", v)}
              />
            </FormGrid>
          </FormCard>

          {/* Ship-to / Customer */}
          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="px-4 py-3 border-b flex items-center justify-between">
              <div className="text-sm font-semibold text-gray-900">
                Ship-to / Customer
              </div>
              <button className="px-3 py-1.5 text-xs rounded-md border bg-white">
                Select Saved Address
              </button>
            </div>

            <div className="p-4">
              <FormGrid>
                <InputField
                  label="Ship-to Name"
                  required
                  placeholder="Company or Contact Name"
                  value={shipTo.name}
                  onChange={(v) => setS("name", v)}
                />
                <InputField
                  label="Phone"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={shipTo.phone}
                  onChange={(v) => setS("phone", v)}
                />

                <InputField
                  label="Address Line 1"
                  required
                  placeholder="Street address, P.O. box"
                  value={shipTo.address1}
                  onChange={(v) => setS("address1", v)}
                />

                <InputField
                  label="Address Line 2"
                  placeholder="Apartment, suite, unit, etc."
                  value={shipTo.address2}
                  onChange={(v) => setS("address2", v)}
                />

                <InputField
                  label="City"
                  required
                  placeholder="City"
                  value={shipTo.city}
                  onChange={(v) => setS("city", v)}
                />
                <InputField
                  label="State"
                  required
                  placeholder="State"
                  value={shipTo.state}
                  onChange={(v) => setS("state", v)}
                />
                <InputField
                  label="Pincode"
                  required
                  placeholder="Zip Code"
                  value={shipTo.pincode}
                  onChange={(v) => setS("pincode", v)}
                />

                <InputField
                  label="GSTIN / Tax ID"
                  placeholder="Optional"
                  value={shipTo.gstin}
                  onChange={(v) => setS("gstin", v)}
                />

                <TextareaField
                  label="Delivery Instructions"
                  placeholder="Gate code, parking instructions, etc."
                  value={shipTo.instructions}
                  onChange={(v) => setS("instructions", v)}
                />
              </FormGrid>
            </div>
          </div>

          {/* Carrier & Shipping */}
          <FormCard title="Carrier & Shipping">
            <FormGrid>
              <InputField
                label="Carrier"
                value={shipping.carrier}
                onChange={(v) => setSh("carrier", v)}
              />
              <InputField
                label="Service Level"
                value={shipping.serviceLevel}
                onChange={(v) => setSh("serviceLevel", v)}
              />
              <InputField
                label="Packaging Preference"
                value={shipping.packagingPreference}
                onChange={(v) => setSh("packagingPreference", v)}
              />
              <InputField
                label="COD Amount"
                value={shipping.codAmount}
                onChange={(v) => setSh("codAmount", v)}
              />
              <InputField
                label="AWB / Tracking"
                placeholder="If available"
                value={shipping.awbTracking}
                onChange={(v) => setSh("awbTracking", v)}
              />
            </FormGrid>
          </FormCard>

          {/* Order Lines */}
          <OrderLines
            lines={lines}
            onAdd={addLine}
            onUpdate={updateLine}
            onRemove={removeLine}
          />

          {/* Allocation Settings */}
          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="px-4 py-3 border-b">
              <div className="text-sm font-semibold text-gray-900">
                Allocation Settings
              </div>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-5">
                <ToggleRow
                  title="Auto-allocate on confirm"
                  desc="Immediately reserve stock upon confirmation"
                  checked={alloc.autoAllocateOnConfirm}
                  onChange={(v) =>
                    setAlloc((p) => ({ ...p, autoAllocateOnConfirm: v }))
                  }
                />
                <ToggleRow
                  title="Reserve inventory"
                  desc="Hard allocate stock to this order"
                  checked={alloc.reserveInventory}
                  onChange={(v) =>
                    setAlloc((p) => ({ ...p, reserveInventory: v }))
                  }
                />
              </div>

              <div className="space-y-5">
                <ToggleRow
                  title="Allow partial allocation"
                  desc="Proceed even if full quantity isn't available"
                  checked={alloc.allowPartial}
                  onChange={(v) => setAlloc((p) => ({ ...p, allowPartial: v }))}
                />
                <ToggleRow
                  title="Allow substitute SKU"
                  desc="Replace with mapped alternatives if OOS"
                  checked={alloc.allowSubstituteSku}
                  onChange={(v) =>
                    setAlloc((p) => ({ ...p, allowSubstituteSku: v }))
                  }
                  disabled={!alloc.allowPartial}
                />
              </div>
            </div>
          </div>

          {/* Documents */}
          <AttachmentsDropzone value={attachments} onChange={setAttachments} />
          <div className="h-10" />
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-4 space-y-6">
          {/* reuse SummaryCard/ChecklistCard (same layout as screenshot) */}
          <SummaryCard data={summaryData} />
          <ChecklistCard items={readiness} />
          <div className="h-10" />
        </div>
      </div>
    </FormPage>
  );
};

export default CreateSalesOrder;
