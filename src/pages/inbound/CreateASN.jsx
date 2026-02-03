import React, { useMemo, useState } from "react";
import FormPage from "../components/forms/FormPage";
import FormCard from "../components/forms/FormCard";
import FormGrid from "../components/forms/FormGrid";
import {
  InputField,
  SelectField,
  TextareaField,
} from "../components/forms/Field";
import PillGroup from "../components/forms/PillGroup";
import SummaryCard from "../components/forms/SummaryCard";
import ChecklistCard from "../components/forms/ChecklistCard";
import AsnLines from "../components/forms/AsnLines";
import AttachmentsDropzone from "../components/forms/AttachmentsDropzone";
import ConfirmDeleteModal from "../components/modals/ConfirmDeleteModal";
import { useToast } from "../components/toast/ToastProvider";
import { useLocation, useParams } from "react-router-dom";

const CreateASN = () => {
  // from the navigate im getting state and from param im getting id
  const params = useParams();
  const location = useLocation();
  const asn = location.state;
  console.log(params, asn);
  const [form, setForm] = useState({
    warehouse: "WH-NYC-01 (New York)",
    client: "Acme Corp",
    supplier: "",
    expectedArrival: "10/25/2023, 08:30 AM",
    referenceNo: "",
    dockDoor: "Any Available",
    notes: "",
    transporterName: "",
    vehicleNo: "",
    driverName: "",
    driverPhone: "",
    specialHandling: ["Fragile"],
  });

  const [lines, setLines] = useState([
    {
      id: "1",
      sku: "SKU-10293 (Phone Case)",
      name: "iPhone 14 Case Blk",
      uom: "Pcs",
      qty: 500,
      remarks: "",
    },
    {
      id: "2",
      sku: "SKU-55291 (Charger)",
      name: "USB-C Wall Charger",
      uom: "Pcs",
      qty: 200,
      remarks: "",
    },
  ]);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const toast = useToast();

  const totalUnits = useMemo(
    () => lines.reduce((sum, l) => sum + (Number(l.qty) || 0), 0),
    [lines],
  );

  const readiness = useMemo(() => {
    const supplierOk = !!form.supplier;
    const etaOk = !!form.expectedArrival;
    const warehouseOk = !!form.warehouse;
    const clientOk = !!form.client;
    const linesOk = lines.length > 0;
    return [
      { label: "Warehouse Selected", done: warehouseOk },
      { label: "Client Selected", done: clientOk },
      { label: "Supplier Selected", done: supplierOk },
      { label: "ETA Set", done: etaOk },
      { label: "Lines Added (>0)", done: linesOk },
    ];
  }, [form, lines]);

  const summaryData = useMemo(
    () => ({
      asnNumber: "GENERATED-ON-SAVE",
      supplier: form.supplier || "-",
      expectedArrival: form.expectedArrival || "-",
      lines: lines.length,
      units: totalUnits,
    }),
    [form, lines, totalUnits],
  );

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const addLine = () =>
    setLines((p) => [
      ...p,
      {
        id: String(Date.now()),
        sku: "",
        name: "",
        uom: "Pcs",
        qty: 0,
        remarks: "",
      },
    ]);

  const updateLine = (idx, patch) =>
    setLines((p) => p.map((l, i) => (i === idx ? { ...l, ...patch } : l)));

  const removeLine = (idx) => {
    setDeleteTarget({ idx, line: lines[idx] });
    setDeleteOpen(true);
  };

  const confirmDeleteLine = () => {
    if (!deleteTarget) return;
    setLines((p) => p.filter((_, i) => i !== deleteTarget.idx));
    toast.success(`Deleted ${deleteTarget.asnNo} successfully`);
    setDeleteOpen(false);
    setDeleteTarget(null);
  };
  const onSaveDraft = () => console.log("Save draft", { form, lines });
  const onConfirm = () => console.log("Save & confirm", { form, lines });

  return (
    <FormPage
      breadcrumbs={[
        { label: "Inbound", to: "/inbound" },
        { label: "Create ASN" },
      ]}
      title="Create ASN"
      topActions={
        <>
          <button className="px-4 py-2 border rounded-md text-sm bg-white text-red-600 border-red-200">
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
            className="px-4 py-2 rounded-md text-sm bg-primary text-white flex items-center gap-2"
          >
            ✓ Save & Confirm ASN
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-6">
          {/* Basic Information */}
          <FormCard title="Basic Information">
            <FormGrid>
              <SelectField
                label="Warehouse"
                required
                value={form.warehouse}
                onClick={() => console.log("open warehouse dropdown")}
              />
              <SelectField
                label="Client"
                required
                value={form.client}
                onClick={() => console.log("open client dropdown")}
              />

              <SelectField
                label="Supplier"
                required
                value={form.supplier}
                placeholder="Select Supplier"
                onClick={() => set("supplier", "Global Supplies Ltd")}
              />
              <InputField
                label="Expected Arrival"
                required
                value={form.expectedArrival}
                onChange={(v) => set("expectedArrival", v)}
              />

              <InputField
                label="Reference No"
                placeholder="e.g. PO-99283-A"
                value={form.referenceNo}
                onChange={(v) => set("referenceNo", v)}
              />
              <SelectField
                label="Dock Door"
                value={form.dockDoor}
                onClick={() => console.log("open dock dropdown")}
              />

              <TextareaField
                label="Notes"
                placeholder="Add any internal notes for the receiving team..."
                value={form.notes}
                onChange={(v) => set("notes", v)}
              />
            </FormGrid>
          </FormCard>
          {/* Shipment Details */}
          <FormCard title="Shipment Details">
            <FormGrid>
              <InputField
                label="Transporter Name"
                placeholder="e.g. FedEx"
                value={form.transporterName}
                onChange={(v) => set("transporterName", v)}
              />
              <InputField
                label="Vehicle No"
                placeholder="e.g. NY-8829"
                value={form.vehicleNo}
                onChange={(v) => set("vehicleNo", v)}
              />
              <InputField
                label="Driver Name"
                placeholder="Driver Name"
                value={form.driverName}
                onChange={(v) => set("driverName", v)}
              />
              <InputField
                label="Driver Phone"
                placeholder="+1 (555) ..."
                value={form.driverPhone}
                onChange={(v) => set("driverPhone", v)}
              />

              <PillGroup
                label="Special Handling"
                value={form.specialHandling}
                onChange={(v) => set("specialHandling", v)}
                options={[
                  { label: "Fragile", value: "Fragile" },
                  { label: "Cold Chain", value: "Cold Chain" },
                  { label: "Top Load Only", value: "Top Load Only" },
                  { label: "Hazardous", value: "Hazardous" },
                ]}
              />
            </FormGrid>
          </FormCard>
          {/* ASN Lines */}
          <AsnLines
            lines={lines}
            onAdd={addLine}
            onUpdate={updateLine}
            onRemove={removeLine}
          />
          {/* Attachments */}
          <AttachmentsDropzone
            value={attachments}
            onChange={setAttachments}
          />{" "}
          <div className="h-10"></div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-4 space-y-6">
          <SummaryCard data={summaryData} />
          <ChecklistCard items={readiness} />
          <div className="h-10"></div>
        </div>
      </div>
      <ConfirmDeleteModal
        open={deleteOpen}
        title="Delete ASN Line"
        message={
          deleteTarget?.line
            ? `Are you sure you want to delete "${deleteTarget.line.sku}"? This cannot be undone.`
            : "Are you sure you want to delete this line?"
        }
        confirmText="Delete Line"
        onClose={() => {
          setDeleteOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={confirmDeleteLine}
      />
    </FormPage>
  );
};

export default CreateASN;
