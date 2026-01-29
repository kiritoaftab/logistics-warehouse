import React from "react";
import { Upload, Eye, Download, Trash2 } from "lucide-react";

const ShipmentDocuments = () => {
  const docs = [
    {
      id: 1,
      type: "PDF",
      name: "Carrier Manifest.pdf",
      sub: "Carrier Handover",
      uploadedBy: "System",
      date: "Oct 24, 2024 14:35",
      size: "245 KB",
      actions: ["view", "download"],
    },
    {
      id: 2,
      type: "PDF",
      name: "Shipping Labels - Batch 1.pdf",
      sub: "Shipping Label",
      uploadedBy: "John Doe",
      date: "Oct 24, 2024 13:10",
      size: "1.2 MB",
      actions: ["view", "download"],
    },
    {
      id: 3,
      type: "JPG",
      name: "Pickup Receipt.jpg",
      sub: "Carrier Receipt",
      uploadedBy: "Mike Smith",
      date: "Oct 24, 2024 14:40",
      size: "850 KB",
      actions: ["view", "download", "delete"],
    },
    {
      id: 4,
      type: "PDF",
      name: "Proof of Delivery (POD).pdf",
      sub: "Delivery Proof",
      uploadedBy: "FedEx API",
      date: "-",
      size: "-",
      status: "Pending",
      actions: [],
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5">
        <div className="text-lg font-semibold text-gray-900">
          Documents <span className="text-gray-500">({docs.length})</span>
        </div>

        <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          <Upload size={16} />
          Upload Document
        </button>
      </div>

      {/* Table */}
      <div className="border-t">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-blue-50 text-gray-600">
              <tr>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">File Name</th>
                <th className="px-6 py-4 font-medium">Uploaded By</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Size</th>
                <th className="px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {docs.map((d) => (
                <tr key={d.id} className="bg-white">
                  <td className="px-6 py-5">
                    <FileTypePill type={d.type} />
                  </td>

                  <td className="px-6 py-5">
                    <div className="font-semibold text-gray-900">{d.name}</div>
                    <div className="text-xs text-gray-500">{d.sub}</div>
                  </td>

                  <td className="px-6 py-5 text-gray-900">{d.uploadedBy}</td>
                  <td className="px-6 py-5 text-gray-900">{d.date}</td>
                  <td className="px-6 py-5 text-gray-900">{d.size}</td>

                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-2">
                      {d.status === "Pending" ? (
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                          Pending
                        </span>
                      ) : (
                        <>
                          {d.actions.includes("view") && (
                            <IconBtn title="View">
                              <Eye size={16} />
                            </IconBtn>
                          )}
                          {d.actions.includes("download") && (
                            <IconBtn title="Download">
                              <Download size={16} />
                            </IconBtn>
                          )}
                          {d.actions.includes("delete") && (
                            <IconBtn
                              title="Delete"
                              className="border-red-200 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                            </IconBtn>
                          )}
                        </>
                      )}
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

export default ShipmentDocuments;

const FileTypePill = ({ type }) => {
  const map = {
    PDF: "bg-red-50 text-red-700 border-red-200",
    JPG: "bg-blue-50 text-blue-700 border-blue-200",
    PNG: "bg-blue-50 text-blue-700 border-blue-200",
  };

  return (
    <span
      className={`inline-flex w-12 items-center justify-center rounded-lg border px-2 py-1 text-xs font-bold ${
        map[type] || "bg-gray-50 text-gray-700 border-gray-200"
      }`}
    >
      {type}
    </span>
  );
};

const IconBtn = ({ children, title, className = "" }) => (
  <button
    title={title}
    className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 ${className}`}
  >
    {children}
  </button>
);
