import { toIsoOrNull } from "./validators";

export const buildAsnPayload = ({
  basicData,
  shipData,
  linesData,
  action = "draft", // ✅ default draft
}) => {
  const etaIso = toIsoOrNull(basicData?.eta);

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

    lines: (linesData?.lines || [])
      .filter((l) => Number(l?.sku_id) > 0) // draft-safe
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
