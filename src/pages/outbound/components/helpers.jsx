// utils/helpers.jsx
export const pillToneForLineStatus = (status) => {
  if (status === "Fully Allocated") return "green";
  if (status === "Partial") return "orange";
  if (status === "No Stock") return "red";
  return "gray";
};

export const pillToneForAllocationStatus = (status) => {
  if (status === "Full") return "green";
  if (status === "Partial") return "orange";
  return "red";
};

export const Pill = ({ text, tone = "gray" }) => {
  const map = {
    gray: "bg-gray-100 text-gray-700",
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    orange: "bg-orange-50 text-orange-700",
    red: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`text-xs px-2 py-1 rounded-full font-medium ${map[tone] || map.gray}`}
    >
      {text}
    </span>
  );
};
