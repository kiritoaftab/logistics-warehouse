import React from "react";
import { ChevronDown } from "lucide-react";

const Label = ({ children, required }) => (
  <label className="text-xs font-medium text-gray-700">
    {children} {required && <span className="text-red-500">*</span>}
  </label>
);

const base =
  "w-full border rounded-md px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300";

export const InputField = ({
  label,
  required,
  placeholder,
  value,
  onChange,
  disabled,
  type = "text",
}) => (
  <div className="flex flex-col gap-1">
    <Label required={required}>{label}</Label>
    <input
      type={type}
      className={`${base} ${disabled ? "opacity-70 cursor-not-allowed" : ""}`}
      placeholder={placeholder}
      value={value || ""}
      onChange={(e) => onChange?.(e.target.value)}
      disabled={disabled}
    />
  </div>
);

export const TextareaField = ({
  label,
  required,
  placeholder,
  value,
  onChange,
  rows = 4,
}) => (
  <div className="flex flex-col gap-1 md:col-span-2">
    <Label required={required}>{label}</Label>
    <textarea
      rows={rows}
      className={base}
      placeholder={placeholder}
      value={value || ""}
      onChange={(e) => onChange?.(e.target.value)}
    />
  </div>
);

// UI-select (button style). You can later replace with your dropdown component.
export const SelectField = ({
  label,
  required,
  value,
  placeholder,
  onClick,
}) => (
  <div className="flex flex-col gap-1">
    <Label required={required}>{label}</Label>
    <button
      type="button"
      onClick={onClick}
      className={`${base} flex items-center justify-between`}
    >
      <span className="truncate text-left">
        {value || placeholder || "Select"}
      </span>
      <ChevronDown size={16} className="text-gray-400" />
    </button>
  </div>
);
