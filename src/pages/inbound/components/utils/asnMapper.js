import { toIsoOrNull } from "./validators";

export const buildAsnPayload = ({
  basicData,
  shipData,
  linesData,
  attachData,
  action = "draft",
}) => {
  const etaIso = toIsoOrNull(basicData?.eta);

  const attachments = Array.isArray(attachData?.attachments)
    ? attachData.attachments
        .map((a) => (typeof a === "string" ? a : a?.url || a?.name || a?.key))
        .filter(Boolean)
    : [];

  const payload = {
    warehouse_id: basicData?.warehouse_id
      ? Number(basicData.warehouse_id)
      : null,
    client_id: basicData?.client_id ? Number(basicData.client_id) : null,
    supplier_id: basicData?.supplier_id ? Number(basicData.supplier_id) : null,
    dock_id: basicData?.dock_id ? Number(basicData.dock_id) : null,

    reference_no: basicData?.reference_no || "",

    transporter_name: shipData?.transporter_name || "",
    vehicle_no: shipData?.vehicle_no || "",
    driver_name: shipData?.driver_name || "",
    driver_phone: shipData?.driver_phone || "",

    special_handling: Array.isArray(shipData?.special_handling)
      ? shipData.special_handling.join(", ")
      : shipData?.special_handling || "",

    notes: basicData?.notes || "",

    attachments,

    lines: (linesData?.lines || [])
      .filter((l) => Number(l?.sku_id) > 0)
      .map((l) => ({
        sku_id: Number(l.sku_id),
        expected_qty: Number(l.expected_qty) || 0,
        uom: l.uom || "EA",
        remarks: l.remarks || "",
      })),
  };

  if (etaIso) payload.eta = etaIso;

  return payload;
};

export const lineStatusLabel = (line) => {
  const exp = Number(line.expected_qty || 0);
  const rcvd = Number(line.received_qty || 0);
  const dmg = Number(line.damaged_qty || 0);
  const total = rcvd + dmg;

  if (exp > 0 && total === 0) return "Pending";
  if (exp > 0 && total >= exp) return "Completed";
  if (exp > 0 && total > 0 && total < exp) return "Partial";

  return (line.status || "PENDING").toString();
};

export const toReceivingRows = (lines = []) =>
  lines.map((l) => {
    const exp = Number(l.expected_qty || 0);
    const rcvd = Number(l.received_qty || 0);
    const dmg = Number(l.damaged_qty || 0);

    return {
      id: l.id,
      asnLineId: l.id,
      sku: l.sku?.sku_code || "-",
      skuDesc: l.sku?.sku_name || "-",
      uom: l.uom || l.sku?.uom || "-",
      exp,
      rcvd,
      dmg,
      flags: "-",
      status: lineStatusLabel(l),
      raw: l,
    };
  });

export const calcTotals = (asn) => {
  const lines = asn?.lines || [];
  const totalExpected = lines.reduce(
    (s, l) => s + Number(l.expected_qty || 0),
    0,
  );
  const receivedGood = lines.reduce(
    (s, l) => s + Number(l.received_qty || 0),
    0,
  );
  const damaged = lines.reduce((s, l) => s + Number(l.damaged_qty || 0), 0);
  const discrepancy = receivedGood + damaged - totalExpected;

  return { totalExpected, receivedGood, damaged, discrepancy };
};
