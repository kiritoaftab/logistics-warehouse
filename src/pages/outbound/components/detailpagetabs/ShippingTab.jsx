// src/pages/outbound/components/detailpagetabs/ShippingTab.jsx
import React, { useMemo, useRef, useState } from "react";
import { MapPin, Package, UploadCloud } from "lucide-react";

const StatusPill = ({ text, tone = "gray" }) => {
  const map = {
    gray: "bg-gray-100 text-gray-700",
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${map[tone]}`}>
      {text}
    </span>
  );
};

const ShippingTab = ({
  carrier = "FedEx Logistics",
  serviceLevel = "Overnight Express",
  totalUnits = 120,
  onGenerateAwb,
  onDispatchShipment,
  onPodUpload,
}) => {
  const [awb, setAwb] = useState("");
  const fileRef = useRef(null);

  const events = useMemo(
    () => [
      {
        id: 1,
        icon: <Package size={16} className="text-green-600" />,
        event: "Packed",
        timestamp: "Oct 24, 2023 10:45 AM",
        user: "Jane Doe (Packer)",
        status: "Completed",
        tone: "green",
      },
      {
        id: 2,
        icon: <MapPin size={16} className="text-gray-400" />,
        event: "Dispatched",
        timestamp: "-",
        user: "-",
        status: "Pending",
        tone: "blue",
      },
      {
        id: 3,
        icon: <MapPin size={16} className="text-gray-400" />,
        event: "Delivered",
        timestamp: "-",
        user: "-",
        status: "Pending",
        tone: "blue",
      },
    ],
    [],
  );

  const handleFilePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onPodUpload?.(file);
  };

  return (
    <div className="space-y-6">
      {/* 1) Shipping Details */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="text-sm font-semibold text-gray-900">
          Shipping Details
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <div className="text-xs font-medium text-gray-500">Carrier</div>
            <div className="mt-2 text-sm font-semibold text-gray-900">
              {carrier}
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-gray-500">
              Service Level
            </div>
            <div className="mt-2 text-sm font-semibold text-gray-900">
              {serviceLevel}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="text-xs font-medium text-gray-500">
            AWB / Tracking Number
          </div>

          <div className="mt-2 flex flex-col md:flex-row gap-3">
            <input
              value={awb}
              onChange={(e) => setAwb(e.target.value)}
              placeholder="Scan or enter AWB number"
              className="h-10 w-full md:flex-1 rounded-md border border-gray-200 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onGenerateAwb?.({ awb, totalUnits })}
                className="h-10 px-4 border rounded-md text-sm bg-white"
              >
                Generate AWB
              </button>

              <button
                type="button"
                onClick={() => onDispatchShipment?.({ awb, totalUnits })}
                className="h-10 px-4 rounded-md text-sm bg-blue-600 text-white"
              >
                Dispatch Shipment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2) Shipping Events */}
      <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
        <div className="px-6 py-4">
          <div className="text-sm font-semibold text-gray-900">
            Shipping Events
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-blue-50">
                <tr className="text-left text-xs font-medium text-gray-600">
                  <th className="px-4 py-3">Event</th>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">User / System</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>

              <tbody className="bg-white">
                {events.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {r.icon}
                        <span className="text-sm text-gray-900">{r.event}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {r.timestamp}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {r.user}
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill text={r.status} tone={r.tone} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 3) Proof of Delivery */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="text-sm font-semibold text-gray-900">
          Proof of Delivery
        </div>

        <input
          ref={fileRef}
          type="file"
          accept=".svg,.png,.jpg,.jpeg,.pdf"
          className="hidden"
          onChange={handleFilePick}
        />

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="mt-4 w-full border-2 border-dashed border-gray-200 rounded-lg bg-blue-50/40 p-10 hover:bg-blue-50 transition"
        >
          <div className="flex flex-col items-center justify-center text-center">
            <div className="h-12 w-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500">
              <UploadCloud size={18} />
            </div>

            <div className="mt-4 text-sm font-medium text-gray-900">
              Click to upload POD document
            </div>
            <div className="mt-1 text-xs text-gray-500">
              SVG, PNG, JPG or PDF (max. 10MB)
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ShippingTab;
