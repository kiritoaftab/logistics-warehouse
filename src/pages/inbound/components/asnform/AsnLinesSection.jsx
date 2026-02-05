import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

import AsnLines from "@/pages/components/forms/AsnLines";
import ConfirmDeleteModal from "@/pages/components/modals/ConfirmDeleteModal";
import { useToast } from "@/pages/components/toast/ToastProvider";

import http from "@/api/http";
import SkuPickerModal from "./common/SkuPickerModal";
import { deleteAsnLine, updateAsnLine } from "../api/masters.api";

const toUiLine = (apiLine) => ({
  id: apiLine?.id, // server line id
  sku_id: apiLine?.sku_id ? String(apiLine.sku_id) : "",
  sku: apiLine?.sku ? `${apiLine.sku.sku_code} (${apiLine.sku.sku_name})` : "",
  uom: apiLine?.uom || "EA",
  expected_qty: apiLine?.expected_qty ?? 0,
  remarks: apiLine?.remarks || "",
  _dirty: false,
  _new: false,
});

const AsnLinesSection = forwardRef(
  ({ asnId, initialAsn, mode, onChange, clientId }, ref) => {
    const toast = useToast();

    const [lines, setLines] = useState(() => {
      return [];
    });
    const [skuModal, setSkuModal] = useState({ open: false, idx: null });

    const [loading, setLoading] = useState(false);

    // delete modal
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deletedIds, setDeletedIds] = useState([]);

    const onOpenSku = (idx) => setSkuModal({ open: true, idx });

    const totalUnits = useMemo(
      () => lines.reduce((sum, l) => sum + (Number(l.expected_qty) || 0), 0),
      [lines],
    );

    useEffect(() => {
      if (!asnId) return;
      if (mode !== "edit") return;

      let alive = true;

      (async () => {
        try {
          setLoading(true);
          const res = await http.get(`/asn-lines/asn/${asnId}`);
          const list = res?.data?.data || [];
          if (!alive) return;
          setLines(Array.isArray(list) ? list.map(toUiLine) : []);
          setDeletedIds([]);
        } catch (e) {
          if (!alive) return;
          setLines([]);
        } finally {
          if (alive) setLoading(false);
        }
      })();

      return () => {
        alive = false;
      };
    }, [asnId, mode]);

    // ✅ avoid onChange dependency loop
    const onChangeRef = useRef(onChange);
    useEffect(() => {
      onChangeRef.current = onChange;
    }, [onChange]);

    const snapshot = useMemo(
      () => ({
        lines: lines.map((l) => ({
          id: l.id,
          sku_id: l.sku_id,
          expected_qty: l.expected_qty,
          uom: l.uom,
          remarks: l.remarks,
        })),
        totalUnits,
        totalLines: lines.length,
      }),
      [lines, totalUnits],
    );

    // push snapshot only when snapshot changes
    useEffect(() => {
      onChangeRef.current?.(snapshot);
    }, [snapshot]);

    const addLine = () =>
      setLines((p) => [
        ...p,
        {
          id: null, // no server id yet
          sku_id: "",
          sku: "",
          uom: "EA",
          expected_qty: 0,
          remarks: "",
          _dirty: true,
          _new: true,
          _tempId: String(Date.now()),
        },
      ]);

    const updateLine = (idx, patch) =>
      setLines((p) =>
        p.map((l, i) => (i === idx ? { ...l, ...patch, _dirty: true } : l)),
      );

    const removeLine = (idx) => {
      setDeleteTarget({ idx, line: lines[idx] });
      setDeleteOpen(true);
    };

    const confirmDeleteLine = () => {
      if (!deleteTarget) return;

      const line = deleteTarget.line;
      // if line has server id, track it for delete API on save
      if (line?.id) {
        setDeletedIds((p) => [...p, line.id]);
      }

      setLines((p) => p.filter((_, i) => i !== deleteTarget.idx));
      setDeleteOpen(false);
      setDeleteTarget(null);
      toast.success("Line removed");
    };

    const validate = (action = "draft") => {
      const errs = [];

      if (action === "confirm") {
        if (!lines.length) errs.push("At least 1 ASN line is required");

        lines.forEach((l, idx) => {
          if (!l.sku_id) errs.push(`Line ${idx + 1}: SKU is required`);
          if ((Number(l.expected_qty) || 0) <= 0)
            errs.push(`Line ${idx + 1}: Expected Qty must be > 0`);
        });
      }

      return errs;
    };

    const saveLines = async ({ asnId: saveAsnId }) => {
      if (!saveAsnId) throw new Error("ASN ID missing for saving lines");

      // 1) delete removed lines
      for (const id of deletedIds) {
        await deleteAsnLine(id);
      }
      setDeletedIds([]);

      // 2) create new + update dirty
      const nextLines = [...lines];

      for (let i = 0; i < nextLines.length; i++) {
        const l = nextLines[i];

        // create
        if (!l.id && (l._new || l._tempId)) {
          // const created = await createAsnLine({
          //   asn_id: Number(saveAsnId),
          //   sku_id: Number(l.sku_id),
          //   expected_qty: Number(l.expected_qty) || 0,
          //   uom: l.uom || "EA",
          //   remarks: l.remarks || "",
          // });

          // // after create, store new server id and reset flags
          // nextLines[i] = {
          //   ...l,
          //   id: created?.id || created?.data?.id || l.id,
          //   _dirty: false,
          //   _new: false,
          // };
          continue;
        }

        // update
        if (l.id && l._dirty) {
          await updateAsnLine(l.id, {
            sku_id: Number(l.sku_id),
            expected_qty: Number(l.expected_qty) || 0,
            uom: l.uom || "EA",
            remarks: l.remarks || "",
          });
          nextLines[i] = { ...l, _dirty: false };
        }
      }

      setLines(nextLines);
    };

    useImperativeHandle(ref, () => ({
      getData: () => ({
        lines: lines.map((l) => ({
          id: l.id,
          sku_id: l.sku_id,
          expected_qty: l.expected_qty,
          uom: l.uom,
          remarks: l.remarks,
        })),
        totalUnits,
        totalLines: lines.length,
      }),
      validate,
      saveLines,
      reset: () => {
        setLines([]);
        setDeletedIds([]);
        setDeleteOpen(false);
        setDeleteTarget(null);
      },
    }));

    return (
      <>
        <AsnLines
          clientId={clientId}
          lines={lines.map((l) => ({
            ...l,
            qty: l.expected_qty,
          }))}
          onAdd={addLine}
          onUpdate={(idx, patch) => {
            // map qty -> expected_qty
            const mapped = { ...patch };
            if (Object.prototype.hasOwnProperty.call(mapped, "qty")) {
              mapped.expected_qty = mapped.qty;
              delete mapped.qty;
            }
            updateLine(idx, mapped);
          }}
          onRemove={removeLine}
          loading={loading}
          onOpenSku={onOpenSku}
        />

        <ConfirmDeleteModal
          open={deleteOpen}
          title="Delete ASN Line"
          message={
            deleteTarget?.line
              ? `Are you sure you want to delete this line? This cannot be undone.`
              : "Are you sure you want to delete this line?"
          }
          confirmText="Delete Line"
          onClose={() => {
            setDeleteOpen(false);
            setDeleteTarget(null);
          }}
          onConfirm={confirmDeleteLine}
        />
        <SkuPickerModal
          open={skuModal.open}
          clientId={clientId}
          onClose={() => setSkuModal({ open: false, idx: null })}
          onSelect={(sku) => {
            const idx = skuModal.idx;
            if (idx === null) return;

            updateLine(idx, {
              sku_id: String(sku.id),
              sku: `${sku.sku_code} (${sku.sku_name})`,
              name: sku.sku_name || "",
              uom: sku.uom || "EA",
            });
          }}
        />
      </>
    );
  },
);

export default AsnLinesSection;
