import React, { useMemo, useState } from "react";
import { ArrowLeft, Printer } from "lucide-react";

import FormPage from "../components/forms/FormPage";
import CusTable from "../components/CusTable";
import AttachmentsDropzone from "../components/forms/AttachmentsDropzone";

import ReceivingSkuCard from "./components/receiving/ReceivingSkuCard";
import ShortageCard from "./components/receiving/ShortageCard";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const AsnReceiving = () => {
  const { asnNo } = useParams();
  const location = useLocation();
  const { id } = location.state || {};
  const [attachments, setAttachments] = useState([]);
  const navigate = useNavigate();
  // right panel form
  const [scanSku, setScanSku] = useState("99201");
  const [palletId, setPalletId] = useState("P-10023");
  const [batchNo, setBatchNo] = useState("B-2023-X");
  const [goodQty, setGoodQty] = useState(50);
  const [damagedQty, setDamagedQty] = useState(0);

  const [receipts, setReceipts] = useState([
    { id: "R1", pallet: "P-10020", batch: "B-2023-X", qty: 200 },
    { id: "R2", pallet: "P-10021", batch: "B-2023-Y", qty: 250 },
  ]);

  // left table
  const receivingLines = useMemo(
    () => [
      {
        id: "L1",
        sku: "SKU-99201",
        skuDesc: "Wireless Mouse - Black",
        uom: "EA",
        exp: 500,
        rcvd: 450,
        dmg: 0,
        flags: "Batch",
        status: "Partial",
      },
      {
        id: "L2",
        sku: "SKU-99205",
        skuDesc: "Mech Keyboard - RGB",
        uom: "EA",
        exp: 200,
        rcvd: 0,
        dmg: 0,
        flags: "Serial",
        status: "Pending",
      },
      {
        id: "L3",
        sku: "SKU-88100",
        skuDesc: "USB-C Cable 2m",
        uom: "PK",
        exp: 500,
        rcvd: 0,
        dmg: 0,
        flags: "-",
        status: "Pending",
      },
      {
        id: "L4",
        sku: "SKU-77299",
        skuDesc: "Monitor Stand",
        uom: "EA",
        exp: 50,
        rcvd: 50,
        dmg: 0,
        flags: "-",
        status: "Completed",
      },
    ],
    [],
  );

  const [activeLineId, setActiveLineId] = useState(receivingLines[0]?.id);
  const activeLine = useMemo(
    () =>
      receivingLines.find((x) => x.id === activeLineId) || receivingLines[0],
    [receivingLines, activeLineId],
  );

  const columns = useMemo(
    () => [
      { key: "idx", title: "#", render: (_row, idx) => idx + 1 },
      {
        key: "skuDetails",
        title: "SKU Details",
        render: (row) => (
          <div className="min-w-0">
            <div className="text-sm font-medium text-gray-900">{row.sku}</div>
            <div className="text-xs text-gray-500 truncate">{row.skuDesc}</div>
          </div>
        ),
      },
      { key: "uom", title: "UOM" },
      { key: "exp", title: "Exp" },
      { key: "rcvd", title: "Rcvd" },
      { key: "dmg", title: "Dmg" },
      {
        key: "flags",
        title: "Flags",
        render: (row) =>
          row.flags && row.flags !== "-" ? (
            <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
              {row.flags}
            </span>
          ) : (
            <span className="text-gray-400">-</span>
          ),
      },
      {
        key: "status",
        title: "Status",
        render: (row) => (
          <span
            className={[
              "px-2 py-1 rounded-full text-xs",
              row.status === "Partial"
                ? "bg-yellow-50 text-yellow-700"
                : row.status === "Completed"
                  ? "bg-green-50 text-green-700"
                  : "bg-gray-100 text-gray-700",
            ].join(" ")}
          >
            {row.status}
          </span>
        ),
      },
    ],
    [],
  );

  const addToReceiving = () => {
    const qty = Number(goodQty || 0) + Number(damagedQty || 0);
    if (!qty) return;

    setReceipts((p) => [
      ...p,
      {
        id: String(Date.now()),
        pallet: palletId || "-",
        batch: batchNo || "-",
        qty,
      },
    ]);

    // reset inputs (optional)
    setGoodQty(0);
    setDamagedQty(0);
  };

  const deleteReceipt = (id) => {
    setReceipts((p) => p.filter((x) => x.id !== id));
  };

  return (
    <FormPage
      breadcrumbs={[
        { label: "Inbound", to: "/inbound" },
        { label: "ASN", to: `/ASNdetails/${id}` },
        { label: "Receiving" },
      ]}
      title="ASN Receiving"
      topActions={
        <>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 border rounded-md text-sm bg-white flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <button className="px-4 py-2 border rounded-md text-sm bg-white flex items-center gap-2">
            <Printer size={16} />
            Print GRN
          </button>
        </>
      }
      bottomLeft={
        <div className="flex items-center gap-8 text-xs text-gray-500">
          <div>
            <div className="uppercase">Total Expected</div>
            <div className="text-base font-semibold text-gray-900">1,200</div>
          </div>
          <div>
            <div className="uppercase">Received Good</div>
            <div className="text-base font-semibold text-green-600">450</div>
          </div>
          <div>
            <div className="uppercase">Damaged</div>
            <div className="text-base font-semibold text-red-600">0</div>
          </div>
          <div>
            <div className="uppercase">Discrepancy</div>
            <div className="text-base font-semibold text-red-600">-50</div>
          </div>
        </div>
      }
      bottomRight={
        <>
          <button className="px-4 py-2 border rounded-md text-sm bg-white">
            Save Draft
          </button>
          <button className="px-4 py-2 rounded-md text-sm bg-primary text-white">
            Post GRN
          </button>
        </>
      }
    >
      {/* TOP INFO STRIP */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <InfoItem label="ASN No" value="ASN-10293" />
          <InfoItem label="Client" value="Acme Corp" />
          <InfoItem label="Supplier" value="Global Supplies Ltd" />
          <InfoItem label="ETA" value="Today, 08:30 AM" />
          <InfoItem
            label="Dock Door"
            value={
              <select className="w-full rounded-md border border-gray-200 bg-slate-50 px-3 py-2 text-sm">
                <option>D-04</option>
                <option>D-01</option>
                <option>D-02</option>
              </select>
            }
          />
          <InfoItem
            label="Progress"
            value={
              <div className="text-sm">
                <span className="font-semibold text-green-600">450</span>
                <span className="text-gray-400"> / 1,200 Units</span>
              </div>
            }
          />
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* LEFT: Receiving Lines */}
        <div className="lg:col-span-8 h-full">
          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="px-4 py-3 border-b flex items-center justify-between">
              <div className="text-sm font-semibold text-gray-900">
                Receiving Lines (15)
              </div>
              <button className="px-3 py-1.5 border rounded-md text-sm bg-white">
                Auto-calc shorts
              </button>
            </div>

            <div className="p-0">
              {/* NOTE: CusTable expects row.id and columns */}
              <CusTable
                columns={columns.map((c) => ({
                  ...c,
                  render:
                    c.key === "skuDetails"
                      ? (row) => (
                          <button
                            className="w-full text-left"
                            onClick={() => setActiveLineId(row.id)}
                          >
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-gray-900">
                                {row.sku}
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                {row.skuDesc}
                              </div>
                            </div>
                          </button>
                        )
                      : c.render,
                }))}
                data={receivingLines}
              />
            </div>
          </div>
        </div>

        {/* RIGHT: SKU Panel + Shortage + Attachments */}
        <div className="lg:col-span-4 h-full space-y-4">
          <ReceivingSkuCard
            skuTitle={`${activeLine?.sku}: ${activeLine?.skuDesc}`}
            partialText="Partial: 450 / 500"
            scanSku={scanSku}
            setScanSku={setScanSku}
            palletId={palletId}
            setPalletId={setPalletId}
            batchNo={batchNo}
            setBatchNo={setBatchNo}
            goodQty={goodQty}
            setGoodQty={setGoodQty}
            damagedQty={damagedQty}
            setDamagedQty={setDamagedQty}
            onAdd={addToReceiving}
            receipts={receipts}
            onDeleteReceipt={deleteReceipt}
          />

          <ShortageCard shortageUnits={50} />

          <div className="">
            <AttachmentsDropzone
              value={attachments}
              onChange={setAttachments}
            />
          </div>
        </div>
      </div>
    </FormPage>
  );
};

const InfoItem = ({ label, value }) => (
  <div>
    <div className="text-[11px] font-medium text-gray-500 uppercase mb-1">
      {label}
    </div>
    <div className="text-sm font-semibold text-gray-900">{value}</div>
  </div>
);

export default AsnReceiving;
