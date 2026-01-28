import React from "react";
import Breadcrumbs from "../header/Breadcrumbs";

const FormPage = ({
  breadcrumb,
  breadcrumbs,
  title,
  topActions,
  children,
  bottomLeft,
  bottomRight,
}) => {
  return (
    <div className="min-h-screen pb-20">
      <div className="pb-5">
        {Array.isArray(breadcrumbs) && breadcrumbs.length > 0 ? (
          <div className="mb-2">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        ) : (
          breadcrumb && (
            <div className="text-xs text-gray-500 mb-1">{breadcrumb}</div>
          )
        )}

        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>

          {topActions && (
            <div className="flex flex-wrap gap-2 md:justify-end">
              {topActions}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div>{children}</div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex gap-2">{bottomLeft}</div>
          <div className="flex gap-2">{bottomRight}</div>
        </div>
      </div>
    </div>
  );
};

export default FormPage;
