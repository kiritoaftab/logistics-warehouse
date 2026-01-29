// tabs/LinesTab.jsx
import React, { useMemo } from "react";
import { Layers } from "lucide-react";
import CusTable from "../../../components/CusTable";
import { pillToneForLineStatus, Pill } from "../helpers";

const LinesTab = () => {
  const rows = useMemo(
    () => [
      {
        id: "1",
        sku: "SKU-10045",
        name: "Wireless Mouse - Black",
        requested: 50,
        allocated: 50,
        picked: 0,
        packed: 0,
        shipped: 0,
        rule: "FIFO",
        status: "Fully Allocated",
      },
      {
        id: "2",
        sku: "SKU-10299",
        name: "Mechanical Keyboard",
        requested: 20,
        allocated: 10,
        picked: 0,
        packed: 0,
        shipped: 0,
        rule: "FIFO",
        status: "Partial",
      },
      {
        id: "3",
        sku: "SKU-20441",
        name: "USB-C Hub 4-Port",
        requested: 10,
        allocated: 0,
        picked: 0,
        packed: 0,
        shipped: 0,
        rule: "Batch",
        status: "Pending",
      },
      {
        id: "4",
        sku: "SKU-30012",
        name: "Monitor Stand",
        requested: 5,
        allocated: 5,
        picked: 0,
        packed: 0,
        shipped: 0,
        rule: "FEFO",
        status: "Fully Allocated",
      },
      {
        id: "5",
        sku: "SKU-99102",
        name: "Webcam 1080p",
        requested: 35,
        allocated: 0,
        picked: 0,
        packed: 0,
        shipped: 0,
        rule: "FIFO",
        status: "No Stock",
      },
    ],
    [],
  );

  const columns = useMemo(
    () => [
      {
        key: "sku",
        title: "SKU",
        render: (r) => (
          <div>
            <div className="text-sm font-semibold text-gray-900">{r.sku}</div>
            <div className="text-xs text-gray-500">{r.name}</div>
          </div>
        ),
      },
      { key: "requested", title: "Requested" },
      { key: "allocated", title: "Allocated" },
      { key: "picked", title: "Picked" },
      { key: "packed", title: "Packed" },
      { key: "shipped", title: "Shipped" },
      { key: "rule", title: "Rule" },
      {
        key: "status",
        title: "Status",
        render: (r) => (
          <Pill text={r.status} tone={pillToneForLineStatus(r.status)} />
        ),
      },
      {
        key: "actions",
        title: "Actions",
        render: () => (
          <button className="h-8 w-8 inline-flex items-center justify-center rounded-md bg-gray-100 text-gray-700">
            <Layers size={16} />
          </button>
        ),
      },
    ],
    [],
  );

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <CusTable columns={columns} data={rows} />
    </div>
  );
};

export default LinesTab;
