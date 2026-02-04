// src/pages/inbound/utils/asnReceiving.js

export const normalizeAsn = (res) => {
  // supports either {success:true,data:{...}} OR direct {...}
  return res?.data?.data || res?.data || res;
};

export const toReceivingRows = (lines = []) =>
  (lines || []).map((l) => {
    const exp = Number(l.expected_qty || 0);
    const good = Number(l.received_qty || 0);
    const dmg = Number(l.damaged_qty || 0);
    const total = good + dmg;

    let status = "Pending";
    if (exp > 0 && total === 0) status = "Pending";
    else if (exp > 0 && total >= exp) status = "Completed";
    else if (exp > 0 && total > 0 && total < exp) status = "Partial";
    else status = (l.status || "PENDING").toString();

    return {
      id: l.id,
      asnLineId: l.id,
      sku: l.sku?.sku_code || "-",
      skuDesc: l.sku?.sku_name || "-",
      uom: l.uom || l.sku?.uom || "-",
      exp,
      good,
      dmg,
      status,
      raw: l,
    };
  });

export const calcShortage = (line) => {
  const exp = Number(line?.expected_qty || 0);
  const good = Number(line?.received_qty || 0);
  const dmg = Number(line?.damaged_qty || 0);
  const total = good + dmg;
  return Math.max(0, exp - total);
};

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
