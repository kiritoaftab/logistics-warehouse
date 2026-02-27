// import React from "react";

// const QueueCard = ({ title, children }) => {
//   return (
//     <div className="bg-white rounded-xl border border-gray-200">
//       <div className="flex items-center justify-between px-4 py-3 border-b">
//         <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
//         <button className="text-sm text-blue-600 font-medium">View all</button>
//       </div>

//       <div className="p-4">{children}</div>
//     </div>
//   );
// };

// export default QueueCard;

import React from "react";
import { useNavigate } from "react-router-dom";

const QueueCard = ({ title, children, viewAllPath, warehouseId }) => {
  const navigate = useNavigate();

  const handleViewAll = () => {
    if (!viewAllPath) return;

    // Append warehouse filter
    const path = warehouseId
      ? `${viewAllPath}?warehouse_id=${warehouseId}`
      : viewAllPath;

    navigate(path);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>

        {viewAllPath && (
          <button
            onClick={handleViewAll}
            className="text-sm text-blue-600 font-medium hover:underline"
          >
            View all
          </button>
        )}
      </div>

      <div className="p-4">{children}</div>
    </div>
  );
};

export default QueueCard;
