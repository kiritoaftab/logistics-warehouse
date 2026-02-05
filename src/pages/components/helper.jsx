export const getStatusBadgeColor = (status) => {
  const colorMap = {
    PENDING: "bg-orange-100 text-orange-700",
    ASSIGNED: "bg-blue-100 text-blue-700",
    IN_PROGRESS: "bg-yellow-100 text-yellow-700",
    COMPLETED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };
  return colorMap[status] || "bg-gray-100 text-gray-700";
};
