// import React from "react";

// const PageHeader = ({ title, subtitle, actions }) => {
//   return (
//     <div className="flex flex-col gap-4 mb-6">
//       <div className="flex items-start justify-between">
//         <div>
//           <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
//           <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
//         </div>

//         {actions && <div className="flex items-center gap-2">{actions}</div>}
//       </div>
//     </div>
//   );
// };

// export default PageHeader;

import React from "react";

const PageHeader = ({ title, subtitle, actions }) => {
  return (
    <div className="mb-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        {/* LEFT */}
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900 truncate">
            {title}
          </h1>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>

        {/* RIGHT (ACTIONS) */}
        {actions && (
          <div className="w-full md:w-auto">
            <div className="flex flex-wrap gap-2 md:justify-end">{actions}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
