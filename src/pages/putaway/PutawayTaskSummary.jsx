import React from "react";

const StatusPill = ({ status }) => {
  const isPending = status === "Pending";
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        isPending
          ? "bg-orange-100 text-orange-700"
          : "bg-gray-100 text-gray-700",
      ].join(" ")}
    >
      {status}
    </span>
  );
};

const KeyValue = ({ label, children }) => (
  <div className="min-w-0">
    <div className="text-sm text-gray-500">{label}</div>
    <div className="mt-1 truncate text-base font-semibold text-gray-900">
      {children}
    </div>
  </div>
);

const LinkText = ({ children }) => (
  <span className="cursor-pointer font-semibold text-blue-600 hover:underline">
    {children}
  </span>
);

const PutawayTaskSummary = ({ task }) => {
  return (
    <div className="border-b border-gray-200 bg-gray-50">
      <div className="mx-auto 2xl:max-w-[1900px] px-6 py-4">
        {/* Breadcrumb */}
        <div className="mb-2 text-sm text-gray-500">
          <span className="text-blue-600 hover:underline cursor-pointer">
            Putaway
          </span>{" "}
          <span className="mx-2">›</span>
          <span className="text-blue-600 hover:underline cursor-pointer">
            Task List
          </span>{" "}
          <span className="mx-2">›</span>
          <span className="text-gray-800">{task.taskId}</span>
        </div>

        {/* Title row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold text-gray-900">
              Putaway Task Detail
            </h1>
            <StatusPill status={task.status} />
          </div>

          <div className="flex items-center gap-3">
            <button className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-800 shadow-sm">
              Save Draft
            </button>
            <button className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-800 shadow-sm">
              Back
            </button>
          </div>
        </div>

        {/* Big summary card */}
        <div className="mt-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-6">
            <KeyValue label="Task ID / Status">{task.taskId}</KeyValue>

            <div className="min-w-0">
              <div className="text-sm text-gray-500">Ref Documents</div>
              <div className="mt-1 truncate text-base">
                <LinkText>{task.grn}</LinkText>
                <span className="mx-2 text-gray-300">•</span>
                <LinkText>{task.asn}</LinkText>
              </div>
            </div>

            <div className="min-w-0">
              <div className="text-sm text-gray-500">SKU Details</div>
              <div className="mt-1 truncate text-base font-semibold text-gray-900">
                {task.skuName}
              </div>
              <div className="mt-0.5 text-sm text-gray-500">{task.skuCode}</div>
            </div>

            <KeyValue label="Quantity">{task.qty}</KeyValue>
            <KeyValue label="Assigned To">{task.assignedTo}</KeyValue>
            <div />
          </div>

          <div className="my-6 h-px w-full bg-gray-100" />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-6">
            <KeyValue label="Source Location">{task.sourceLocation}</KeyValue>
            <KeyValue label="Suggested Zone">{task.suggestedZone}</KeyValue>

            <div className="min-w-0">
              <div className="text-sm text-gray-500">Suggested Bin</div>
              <div className="mt-1 truncate text-base">
                <LinkText>{task.suggestedBin}</LinkText>
              </div>
            </div>

            <KeyValue label="Created">{task.createdAt}</KeyValue>

            <div className="min-w-0 md:col-span-2">
              <div className="text-sm text-gray-500">Priority</div>
              <div className="mt-2 inline-flex w-full max-w-[280px] items-center rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
                {task.priority}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PutawayTaskSummary;
