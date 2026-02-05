// src/pages/inbound/CreateASN.jsx
import { useCallback, useMemo, useRef, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import FormPage from "../components/forms/FormPage";
import SummaryCard from "../components/forms/SummaryCard";
import ChecklistCard from "../components/forms/ChecklistCard";
import { useToast } from "../components/toast/ToastProvider";
import ShipmentDetailsSection from "./components/asnform/ShipmentDetailsSection";
import AsnLinesSection from "./components/asnform/AsnLinesSection";
import { buildAsnPayload } from "./components/utils/asnMapper";
import {
  createToastQueue,
  getBackendErrorMessages,
  isAxiosError,
  logError,
  mapApiErrorsToForm,
  validateAll,
} from "./components/utils/validators";
import BasicInformationSection from "./components/asnform/BasicInformationSection";
import AttachmentsSection from "./components/asnform/AttachmentsSection";

const CreateASN = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const editAsn = location.state?.asn || null;
  const asnStatus = editAsn?.status || "DRAFT";
  const canConfirm = asnStatus === "DRAFT";
  const isCreate = String(id).toLowerCase() === "new";
  const mode = isCreate ? "create" : "edit";
  const numericAsnId =
    mode === "edit" && editAsn?.id ? String(editAsn.id) : null;

  const basicRef = useRef(null);
  const shipRef = useRef(null);
  const linesRef = useRef(null);
  const attachRef = useRef(null);
  const toastQueueRef = useRef(null);

  const [basicSnap, setBasicSnap] = useState(null);
  const [shipSnap, setShipSnap] = useState(null);
  const [linesSnap, setLinesSnap] = useState({
    lines: [],
    totalUnits: 0,
    totalLines: 0,
  });

  const [formErrors, setFormErrors] = useState({});

  const [attachSnap, setAttachSnap] = useState({ attachments: [], count: 0 });
  const onAttachmentsChange = useCallback((d) => setAttachSnap(d), []);

  if (!toastQueueRef.current) {
    toastQueueRef.current = createToastQueue(toast, {
      duration: 2600,
      gap: 250,
    });
  }

  const summaryData = useMemo(() => {
    const supplierLabel =
      basicSnap?.supplier_label ||
      (basicSnap?.supplier_id ? `Supplier: ${basicSnap.supplier_id}` : "-");

    const eta = basicSnap?.eta || "-";

    return {
      asnNumber:
        editAsn?.asn_no ||
        (mode === "edit" ? `ASN-${id}` : "GENERATED-ON-SAVE"),
      supplier: supplierLabel || "-",
      expectedArrival: eta,
      lines: linesSnap?.totalLines ?? 0,
      units: linesSnap?.totalUnits ?? 0,
      attachments: attachSnap?.count ?? 0,
    };
  }, [basicSnap, linesSnap, editAsn, mode, id]);

  const readiness = useMemo(() => {
    const warehouseOk = !!basicSnap?.warehouse_id;
    const clientOk = !!basicSnap?.client_id;
    const supplierOk = !!basicSnap?.supplier_id;
    const etaOk = !!basicSnap?.eta;
    const linesOk = (linesSnap?.totalLines ?? 0) > 0;

    return [
      { label: "Warehouse Selected", done: warehouseOk },
      { label: "Client Selected", done: clientOk },
      { label: "Supplier Selected", done: supplierOk },
      { label: "ETA Set", done: etaOk },
      { label: "Lines Added (>0)", done: linesOk },
    ];
  }, [basicSnap, linesSnap]);

  const onSaveDraft = async () => {
    let basicData, shipData, linesData, payload;

    try {
      basicData = basicRef.current.getData();
      shipData = shipRef.current.getData();
      linesData = linesRef.current.getData();

      const errors = validateAll({
        basicData,
        shipData,
        linesData,
        mode,
        action: "draft",
      });
      if (errors.length) {
        logError("ASN Draft Validation Failed", null, {
          errors,
          basicData,
          shipData,
          linesData,
        });
        toast.error(errors[0]);
        return;
      }

      payload = buildAsnPayload({
        basicData,
        shipData,
        linesData,
        attachData: attachSnap,
        action: "draft",
      });

      const result = await basicRef.current.saveHeader({
        mode,
        asnId: numericAsnId,
        payload,
      });

      const asnId = result?.asnId || numericAsnId;
      if (!asnId || !/^\d+$/.test(String(asnId))) {
        throw new Error("ASN numeric id missing after draft save");
      }

      await linesRef.current.saveLines({ asnId });

      toast.success("Draft saved");
      navigate("/inbound");
    } catch (e) {
      logError("ASN Save Failed", e, { payload });

      const data = e?.response?.data;

      const fieldErrors = mapApiErrorsToForm(data);
      if (Object.keys(fieldErrors).length) {
        setFormErrors((prev) => ({ ...prev, ...fieldErrors }));
      }

      const msgs = getBackendErrorMessages(data);

      if (msgs.length) {
        toastQueueRef.current.clear();
        toastQueueRef.current.showErrors(msgs);
        return;
      }

      toast.error(data?.message || e?.message || "Something went wrong");
    }
  };

  const onConfirm = async () => {
    let basicData, shipData, linesData, payload;

    try {
      basicData = basicRef.current.getData();
      shipData = shipRef.current.getData();
      linesData = linesRef.current.getData();

      const errors = validateAll({
        basicData,
        shipData,
        linesData,
        mode,
        action: "confirm",
      });
      if (errors.length) {
        logError("ASN Validation Failed", null, {
          errors,
          basicData,
          shipData,
          linesData,
        });
        toast.error(errors[0]);
        return;
      }

      payload = buildAsnPayload({
        basicData,
        shipData,
        linesData,
        attachData: attachSnap,
        action: "confirm",
      });

      const result = await basicRef.current.saveHeader({
        mode,
        asnId: numericAsnId,
        payload,
      });

      const asnId = result?.asnId || numericAsnId;
      await linesRef.current.saveLines({ asnId });
      await basicRef.current.confirmAsn({ asnId });

      toast.success("ASN confirmed");

      setFormErrors({});
      setBasicSnap(null);
      setShipSnap(null);
      setLinesSnap({ lines: [], totalUnits: 0, totalLines: 0 });
      setAttachSnap({ attachments: [], count: 0 });

      basicRef.current?.reset?.();
      shipRef.current?.reset?.();
      linesRef.current?.reset?.();
      attachRef.current?.reset?.();

      navigate(`/inbound`, { replace: true });
    } catch (e) {
      if (!isAxiosError(e)) {
        throw e;
      }
      logError("ASN API Failed", e, { payload });

      const data = e?.response?.data;

      const fieldErrors = mapApiErrorsToForm(data);
      if (Object.keys(fieldErrors).length) {
        setFormErrors((prev) => ({ ...prev, ...fieldErrors }));
      }

      const msgs = getBackendErrorMessages(data);
      if (msgs.length) {
        toastQueueRef.current?.clear?.();
        toastQueueRef.current?.showErrors?.(msgs);
        return;
      }

      toast.error(data?.message || "Something went wrong");
    }
  };

  return (
    <FormPage
      breadcrumbs={[
        { label: "Inbound", to: "/inbound" },
        { label: mode === "edit" ? "Edit ASN" : "Create ASN" },
      ]}
      title={mode === "edit" ? "Edit ASN" : "Create ASN"}
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
          {canConfirm && (
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-md text-sm bg-primary text-white"
            >
              {mode === "edit" ? "✓ Confirm ASN" : "✓ Save & Confirm ASN"}
            </button>
          )}
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <BasicInformationSection
            ref={basicRef}
            initialAsn={editAsn}
            mode={mode}
            onChange={(data) => setBasicSnap(data)}
            errors={formErrors}
          />
          <ShipmentDetailsSection
            ref={shipRef}
            initialAsn={editAsn}
            mode={mode}
            onChange={(data) => setShipSnap(data)}
          />
          <AsnLinesSection
            ref={linesRef}
            asnId={numericAsnId}
            mode={mode}
            clientId={basicSnap?.client_id}
            onChange={(data) => setLinesSnap(data)}
          />

          <AttachmentsSection
            ref={attachRef}
            initial={editAsn?.attachments || []}
            onChange={onAttachmentsChange}
          />
          <div className="h-10" />
        </div>

        <div className="lg:col-span-4 space-y-6">
          <SummaryCard data={summaryData} />
          <ChecklistCard items={readiness} />
          <div className="h-10" />
        </div>
      </div>
    </FormPage>
  );
};

export default CreateASN;
