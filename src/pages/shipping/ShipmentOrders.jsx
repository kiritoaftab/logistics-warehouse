import React from "react";

const ShipmentOrders = () => {
  const rows = [
    {
      orderNo: "ORD-10023",
      shipTo: "New York, NY",
      cartons: 4,
      status: "In Transit",
    },
    {
      orderNo: "ORD-10045",
      shipTo: "Boston, MA",
      cartons: 6,
      status: "In Transit",
    },
    {
      orderNo: "ORD-10088",
      shipTo: "Philadelphia, PA",
      cartons: 2,
      status: "In Transit",
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between px-6 py-5">
        <div className="text-lg font-semibold text-gray-900">
          Orders in Shipment
        </div>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
          {rows.length} Orders
        </span>
      </div>

      <div className="border-t">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">Order No</th>
                <th className="px-6 py-4 font-medium">Ship-to</th>
                <th className="px-6 py-4 font-medium">Cartons</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((r) => (
                <tr key={r.orderNo}>
                  <td className="px-6 py-5">
                    <button className="font-semibold text-blue-600 hover:text-blue-700">
                      {r.orderNo}
                    </button>
                  </td>
                  <td className="px-6 py-5 text-gray-800">{r.shipTo}</td>
                  <td className="px-6 py-5 text-gray-800">{r.cartons}</td>
                  <td className="px-6 py-5">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      In Transit
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-end">
                      <div className="flex flex-col gap-2">
                        <button className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-50">
                          Open Order
                        </button>
                        <button className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-50">
                          View Cartons
                        </button>
                      </div>
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

export default ShipmentOrders;
