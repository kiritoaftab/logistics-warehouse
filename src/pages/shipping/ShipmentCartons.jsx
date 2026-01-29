import React from "react";
import { Eye, Printer } from "lucide-react";

const ShipmentCartons = () => {
  const rows = [
    {
      cartonId: "CTN-001928",
      orderNo: "ORD-559102",
      itemsCount: "4 SKUs",
      qty: 24,
      weight: "12.5 kg",
      label: "Printed",
    },
    {
      cartonId: "CTN-001929",
      orderNo: "ORD-559102",
      itemsCount: "2 SKUs",
      qty: 10,
      weight: "5.2 kg",
      label: "Printed",
    },
    {
      cartonId: "CTN-001930",
      orderNo: "ORD-559105",
      itemsCount: "1 SKU",
      qty: 50,
      weight: "18.0 kg",
      label: "Printed",
    },
    {
      cartonId: "CTN-001931",
      orderNo: "ORD-559108",
      itemsCount: "5 SKUs",
      qty: 15,
      weight: "8.4 kg",
      label: "Printed",
    },
    {
      cartonId: "CTN-001932",
      orderNo: "ORD-559108",
      itemsCount: "2 SKUs",
      qty: 8,
      weight: "3.1 kg",
      label: "Pending",
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white ">
      <div className="flex items-center justify-between px-6 py-5">
        <div className="text-lg font-semibold text-gray-900">Cartons (12)</div>

        <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50">
          <Printer size={16} />
          Print All Labels
        </button>
      </div>

      <div className="border-t ">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">Carton ID</th>
                <th className="px-6 py-4 font-medium">Order No</th>
                <th className="px-6 py-4 font-medium">Items Count</th>
                <th className="px-6 py-4 font-medium">Qty</th>
                <th className="px-6 py-4 font-medium">Weight</th>
                <th className="px-6 py-4 font-medium">Label Status</th>
                <th className="px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {rows.map((r) => (
                <tr key={r.cartonId}>
                  <td className="px-6 py-5 font-semibold text-gray-900">
                    {r.cartonId}
                  </td>
                  <td className="px-6 py-5 font-semibold text-gray-900">
                    {r.orderNo}
                  </td>
                  <td className="px-6 py-5 text-gray-800">{r.itemsCount}</td>
                  <td className="px-6 py-5 text-gray-800">{r.qty}</td>
                  <td className="px-6 py-5 text-gray-800">{r.weight}</td>
                  <td className="px-6 py-5">
                    <StatusPill value={r.label} />
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-2">
                      <IconBtn title="View">
                        <Eye size={16} />
                      </IconBtn>
                      <IconBtn title="Print">
                        <Printer size={16} />
                      </IconBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ShipmentCartons;

const StatusPill = ({ value }) => {
  const isPrinted = value === "Printed";
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        isPrinted
          ? "bg-green-100 text-green-700"
          : "bg-orange-100 text-orange-700"
      }`}
    >
      {value}
    </span>
  );
};

const IconBtn = ({ children, title }) => (
  <button
    title={title}
    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
  >
    {children}
  </button>
);
