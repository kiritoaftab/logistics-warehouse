import React from "react";
import { Package, RotateCw } from "lucide-react";

const ShipmentOverview = ({ shipmentDetails }) => {
  const timeline = [
    {
      id: 1,
      title: "Delivered",
      meta: "Estimated: Oct 26, 2024",
      type: "estimate",
    },
    {
      id: 2,
      title: "In Transit - Arrived at Hub",
      meta: "Oct 25, 2024 08:15 AM • Newark Facility",
      type: "active",
    },
    {
      id: 3,
      title: "Dispatched from Warehouse",
      meta: "Oct 24, 2024 02:30 PM • WH-NYC-01",
      type: "done",
    },
    {
      id: 4,
      title: "Shipment Created",
      meta: "Oct 24, 2024 10:00 AM • System",
      type: "done",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top 3 cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <MiniCard
          title={shipmentDetails.carrier}
          rightTitle={shipmentDetails.service}
        >
          <div className="text-sm text-gray-500">Tracking Number</div>
          <div className="mt-1 text-lg font-bold text-gray-900">
            {shipmentDetails.awb}
          </div>
        </MiniCard>

        <MiniCard title="Standard Overnight" rightTitle="">
          <div className="text-sm text-gray-500">Contact</div>
          <div className="mt-1 text-lg font-bold text-gray-900">
            +1 800-463-3339
          </div>
        </MiniCard>

        <MiniCard title="John Doe (Supervisor)" rightTitle="D-04">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-gray-500">Vehicle No</div>
              <div className="mt-1 font-bold text-gray-900">NY-554-KA</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Driver</div>
              <div className="mt-1 font-bold text-gray-900">Mike Ross</div>
            </div>
          </div>
        </MiniCard>
      </div>

      {/* Status timeline card */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between px-6 py-5">
          <div className="text-lg font-semibold text-gray-900">
            Status Timeline
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="inline-flex items-center gap-2">
              <RotateCw size={14} />
              Last synced: Just now
            </span>
            <button className="font-medium text-blue-600 hover:text-blue-700">
              Sync now
            </button>
          </div>
        </div>

        <div className="border-t px-6 py-6">
          <div className="relative">
            <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gray-200" />

            <div className="space-y-7">
              {timeline.map((t, idx) => (
                <div key={t.id} className="relative flex gap-4">
                  <TimelineDot type={t.type} />
                  <div className="min-w-0">
                    <div
                      className={`font-semibold ${idx === 0 ? "text-gray-600" : "text-gray-900"}`}
                    >
                      {t.title}
                    </div>
                    <div className="mt-1 text-sm text-gray-500">{t.meta}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentOverview;

const MiniCard = ({ title, rightTitle, children }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-6">
    <div className="flex items-start justify-between gap-3">
      <div className="font-semibold text-gray-900">{title}</div>
      {rightTitle ? (
        <div className="font-semibold text-gray-900">{rightTitle}</div>
      ) : null}
    </div>
    <div className="mt-5">{children}</div>
  </div>
);

const TimelineDot = ({ type }) => {
  if (type === "estimate") {
    return (
      <div className="relative z-10 mt-1 h-6 w-6 rounded-full border-2 border-gray-200 bg-white" />
    );
  }
  return (
    <div className="relative z-10 mt-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-blue-600 bg-white">
      <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />
    </div>
  );
};
