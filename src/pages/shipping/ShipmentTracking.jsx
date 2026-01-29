import React from "react";
import {
  RotateCw,
  Truck,
  Package,
  CheckCircle2,
  MapPin,
  User,
} from "lucide-react";

const ShipmentTracking = () => {
  const items = [
    {
      id: 1,
      title: "In Transit - Departed FedEx Facility",
      desc: "Package has left the sorting facility and is en route to the destination hub.",
      place: "Newark, NJ",
      source: "Carrier Update (API)",
      time: "Today, 09:15 AM",
      icon: <Truck size={18} />,
      emphasis: true,
    },
    {
      id: 2,
      title: "Arrived at FedEx Facility",
      desc: "Package arrived at origin sort facility.",
      place: "Newark, NJ",
      source: "Carrier Update (API)",
      time: "Yesterday, 06:45 PM",
      icon: <Package size={18} />,
    },
    {
      id: 3,
      title: "Picked Up",
      desc: "Carrier has picked up the shipment from the warehouse.",
      place: "WH-NYC-01",
      source: "Manual Entry",
      time: "Yesterday, 04:30 PM",
      icon: <CheckCircle2 size={18} />,
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="flex items-start justify-between gap-4 px-6 py-5">
        <div>
          <div className="text-lg font-semibold text-gray-900">
            Tracking Timeline
          </div>
          <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
            <span className="inline-flex items-center gap-2">
              <RotateCw size={14} />
              Last synced: Just now
            </span>
            <button className="font-medium text-blue-600 hover:text-blue-700">
              Sync now
            </button>
          </div>
        </div>

        <button className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-200">
          View Carrier Page
        </button>
      </div>

      <div className="border-t px-6 py-6">
        <div className="relative">
          {/* vertical line */}
          <div className="absolute left-[14px] top-2 bottom-2 w-px bg-gray-200" />

          <div className="space-y-6">
            {items.map((t) => (
              <div key={t.id} className="relative flex gap-4">
                {/* dot */}
                <div className="relative z-10 mt-2 h-7 w-7 rounded-full bg-blue-600" />
                {/* card */}
                <div
                  className={`w-full rounded-xl border ${
                    t.emphasis
                      ? "border-blue-200 bg-blue-50"
                      : "border-gray-200 bg-gray-50"
                  } p-5`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-blue-700">{t.icon}</div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {t.title}
                        </div>
                        <div className="mt-1 text-sm text-gray-600">
                          {t.desc}
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                          <span className="inline-flex items-center gap-2">
                            <MapPin size={14} />
                            {t.place}
                          </span>
                          <span className="inline-flex items-center gap-2">
                            <User size={14} />
                            {t.source}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="whitespace-nowrap text-sm font-medium text-gray-500">
                      {t.time}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentTracking;
