import React from "react";
import FormCard from "./FormCard";
import { UploadCloud } from "lucide-react";

const AttachmentsDropzone = ({ onPick, className }) => {
  return (
    <FormCard title="Attachments">
      <div
        className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center text-center bg-gray-50 ${className}`}
      >
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-3">
          <UploadCloud className="text-blue-600" size={18} />
        </div>

        <button
          type="button"
          onClick={onPick}
          className="text-blue-600 font-medium"
        >
          Click to upload
        </button>
        <div className="text-gray-500 text-sm">or drag and drop</div>
        <div className="text-gray-400 text-xs mt-2">
          Packing lists, invoices, or e-way bills (PDF, PNG, JPG)
        </div>
      </div>
    </FormCard>
  );
};

export default AttachmentsDropzone;
