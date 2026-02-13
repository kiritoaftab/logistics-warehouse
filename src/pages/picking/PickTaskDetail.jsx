// pages/picking/PickTaskDetail.jsx
import React, { useState, useEffect } from "react";
import {
  X,
  ExternalLink,
  Clock,
  User,
  KeyRound,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import http from "../../api/http";
import { format } from "date-fns";
import { useToast } from "../components/toast/ToastProvider";
import PaginatedEntityDropdown from "../inbound/components/asnform/common/PaginatedEntityDropdown";

const StatusChip = ({ text }) => {
  const statusMap = {
    PENDING: { label: "Pending", className: "bg-gray-100 text-gray-600" },
    ASSIGNED: { label: "Assigned", className: "bg-blue-100 text-blue-700" },
    "IN PROGRESS": {
      label: "In Progress",
      className: "bg-orange-100 text-orange-700",
    },
    IN_PROGRESS: {
      label: "In Progress",
      className: "bg-orange-100 text-orange-700",
    },
    COMPLETED: { label: "Completed", className: "bg-green-100 text-green-700" },
    DONE: { label: "Done", className: "bg-green-100 text-green-700" },
    EXCEPTION: { label: "Exception", className: "bg-red-100 text-red-700" },
    CANCELLED: { label: "Cancelled", className: "bg-gray-100 text-gray-700" },
    Current: { label: "Current", className: "bg-blue-100 text-blue-700" },
    Done: { label: "Done", className: "bg-green-100 text-green-700" },
    "In Progress": {
      label: "In Progress",
      className: "bg-orange-100 text-orange-700",
    },
    Pending: { label: "Pending", className: "bg-gray-100 text-gray-600" },
  };

  const statusInfo = statusMap[text] || {
    label: text,
    className: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusInfo.className}`}
    >
      {statusInfo.label}
    </span>
  );
};

const StepBadge = ({ state, index }) => {
  if (state === "done" || state === "completed") {
    return (
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white text-xs font-bold">
        ✓
      </div>
    );
  }
  if (state === "current" || state === "in_progress") {
    return (
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">
        {index}
      </div>
    );
  }
  return (
    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-500 text-xs font-bold">
      {index}
    </div>
  );
};

const PickTaskDetail = ({ taskId, onClose, onBack }) => {
  const toast = useToast();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [binScan, setBinScan] = useState("");
  const [skuScan, setSkuScan] = useState("");
  const [qty, setQty] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [selectedUser, setSelectedUser] = useState("");
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    if (taskId) {
      fetchTaskDetails();
    }
  }, [taskId]);

  useEffect(() => {
    if (
      task &&
      (task.status === "IN PROGRESS" || task.status === "IN_PROGRESS")
    ) {
      setQty(task.qty_to_pick || "");
    }
  }, [task]);

  const fetchTaskDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await http.get(`/pick-tasks/${taskId}`);
      setTask(response.data);

      // Pre-fill bin scan with source location if task is in progress
      if (
        response.data.status === "IN PROGRESS" ||
        response.data.status === "IN_PROGRESS"
      ) {
        setBinScan(response.data.sourceLocation?.location_code || "");
      }
    } catch (err) {
      console.error("Error fetching task details:", err);
      setError(err.response?.data?.message || "Failed to load task details");
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd MMM yyyy, HH:mm");
    } catch {
      return dateString;
    }
  };

  const formatTimeElapsed = (startTime) => {
    if (!startTime) return "0m 0s";
    try {
      const start = new Date(startTime);
      const now = new Date();
      const diffInSeconds = Math.floor((now - start) / 1000);

      const minutes = Math.floor(diffInSeconds / 60);
      const seconds = diffInSeconds % 60;

      return `${minutes}m ${seconds}s`;
    } catch {
      return "N/A";
    }
  };

  const handleCompleteTask = async () => {
    if (!qty || parseFloat(qty) <= 0) {
      alert("Enter valid quantity");
      return;
    }

    if (parseFloat(qty) !== parseFloat(task.qty_to_pick)) {
      alert("Quantity must match required amount for full completion");
      return;
    }

    try {
      setSubmitting(true);

      const response = await http.post(`/pick-tasks/${taskId}/complete`, {
        qty_picked: parseFloat(qty),
        short_pick_reason: "",
        short_pick_notes: "",
      });

      if (response.data) {
        toast.success("Task completed successfully!");
        fetchTaskDetails();
        setQty("");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to complete task");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRaiseException = async () => {
    const reason = prompt("Enter exception reason (Shortage/Damage/Other):");
    if (!reason) return;

    const notes = prompt("Enter notes (optional):");

    try {
      setSubmitting(true);

      const response = await http.post(`/pick-tasks/${taskId}/exception`, {
        reason,
        notes: notes || "",
        qty_short: parseFloat(task.qty_to_pick) - parseFloat(qty || 0),
      });

      if (response.data) {
        alert("Exception logged successfully!");
        fetchTaskDetails();
      }
    } catch (err) {
      console.error("Error raising exception:", err);
      alert(err.response?.data?.message || "Failed to raise exception");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePartialPick = async () => {
    if (!qty || parseFloat(qty) <= 0) {
      alert("Enter picked quantity");
      return;
    }

    if (parseFloat(qty) >= parseFloat(task.qty_to_pick)) {
      alert("Use Complete Task for full quantity");
      return;
    }

    const reason = prompt("Enter short pick reason:");
    if (!reason) {
      alert("Reason is required for partial pick");
      return;
    }

    const notes = prompt("Enter short pick notes:");

    try {
      setSubmitting(true);

      const response = await http.post(`/pick-tasks/${taskId}/complete`, {
        qty_picked: parseFloat(qty),
        short_pick_reason: reason,
        short_pick_notes: notes || "",
      });

      if (response.data) {
        alert("Partial pick recorded successfully!");
        fetchTaskDetails();
        setQty("");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to record partial pick");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelfAssign = async () => {
    try {
      setAssigning(true);

      await http.post(`/pick-tasks/self-assign`, {
        wave_id: task.wave?.id,
      });

      toast.success("Task assigned to you");
      fetchTaskDetails();
    } catch (err) {
      toast.error(err.response?.data?.message || "Self assign failed");
    } finally {
      setAssigning(false);
    }
  };

  const handleAssignToUser = async () => {
    if (!selectedUser) {
      toast.error("Select a user");
      return;
    }

    try {
      setAssigning(true);

      await http.post(`/pick-tasks/assign`, {
        task_ids: [task.id],
        user_id: selectedUser,
      });

      toast.success("Task assigned successfully");
      fetchTaskDetails();
      setSelectedUser("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Assignment failed");
    } finally {
      setAssigning(false);
    }
  };

  // Create task steps from the pick sequence
  const getTaskSteps = () => {
    if (!task) return [];

    // Since we only have one task, we create a single step
    // In a real scenario, you might have multiple pick tasks in a sequence
    const status = task.status;
    let stepState = "pending";

    if (status === "COMPLETED" || status === "DONE") {
      stepState = "done";
    } else if (
      status === "IN PROGRESS" ||
      status === "IN_PROGRESS" ||
      status === "ASSIGNED"
    ) {
      stepState = "current";
    }

    return [
      {
        idx: 1,
        state: stepState,
        bin: task.sourceLocation?.location_code || "N/A",
        sku: task.orderLine?.sku?.sku_code || "N/A",
        skuSub: task.orderLine?.sku?.sku_name || "N/A",
        req: parseFloat(task.qty_to_pick).toFixed(0),
        picked: parseFloat(task.qty_picked).toFixed(0),
        status: task.status,
      },
    ];
  };

  const handleStartTask = async () => {
    try {
      setSubmitting(true);

      const response = await http.post(`/pick-tasks/${taskId}/start`);

      if (response.data) {
        toast.success("Task started successfully!");
        fetchTaskDetails();
      }
    } catch (err) {
      console.error("Error starting task:", err);
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to start task",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E9F1FB] p-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="min-h-screen bg-[#E9F1FB] p-6">
        <div className="mx-auto 2xl:max-w-[1900px]">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center gap-3 text-red-800 mb-4">
              <AlertCircle size={24} />
              <h3 className="text-lg font-semibold">Error Loading Task</h3>
            </div>
            <p className="text-red-700 mb-4">{error || "Task not found"}</p>
            <button
              onClick={onBack || onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const steps = getTaskSteps();
  const currentStep = steps[0];
  const isPending = task.status === "PENDING";
  const isAssigned = task.status === "ASSIGNED";
  const isCompleted = task.status === "COMPLETED" || task.status === "DONE";
  const isInProgress = task.status === "IN_PROGRESS";

  return (
    <div className="min-h-screen bg-[#E9F1FB] p-6">
      <div className="mx-auto 2xl:max-w-[1900px] space-y-4">
        {/* Top bar */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            {/* <div className="text-xs text-gray-500">
              <span className="hover:text-gray-700 cursor-pointer">
                Picking
              </span>{" "}
              <span className="mx-1">›</span>
              <span className="hover:text-gray-700 cursor-pointer">
                Tasks
              </span>{" "}
              <span className="mx-1">›</span>
              <span className="font-semibold text-gray-700">
                Task #{task.task_no}
              </span>
            </div> */}

            <div className="text-2xl font-semibold text-gray-900">
              Pick Task Detail
            </div>
          </div>

          <div className="flex items-center gap-3">
            <StatusChip text={task.status} />

            {/* <button
              type="button"
              className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Save Progress
            </button> */}
            {isPending && (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleSelfAssign}
                  disabled={assigning}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  Self Assign
                </button>
                <button
                  type="button"
                  onClick={handleAssignToUser}
                  disabled={assigning || !selectedUser}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
                >
                  Assign To
                </button>
                <div className="w-60">
                  <PaginatedEntityDropdown
                    endpoint="/users"
                    listKey="users"
                    value={selectedUser}
                    onChange={(val) => setSelectedUser(val)}
                    placeholder="Assign to user"
                    enableSearch
                    searchParam="search"
                    renderItem={(u) => ({
                      title: `${u.first_name} ${u.last_name}` || u.username,
                      subtitle: u.email,
                    })}
                  />
                </div>
              </div>
            )}

            {isAssigned && (
              <button
                type="button"
                onClick={handleStartTask}
                disabled={submitting}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Starting...
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    Start Task
                  </>
                )}
              </button>
            )}

            {/* <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              title="Close"
            >
              <X size={16} />
            </button> */}
          </div>
        </div>

        {/* Info card */}
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            <div>
              <div className="text-xs font-medium text-gray-500">Task ID</div>
              <div className="text-sm font-semibold text-gray-900">
                {task.task_no}
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-gray-500">Wave ID</div>
              <div className="text-sm font-semibold text-blue-600">
                {task.wave?.wave_no || "N/A"}
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-gray-500">Client</div>
              <div className="text-sm font-semibold text-gray-900">
                Client {task.order?.client_id || "N/A"}
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-gray-500">Zone</div>
              <div className="text-sm font-semibold text-gray-900">
                {task.sourceLocation?.zone
                  ? `Zone ${task.sourceLocation.zone}`
                  : task.wave?.zone_filter || "N/A"}
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-gray-500">
                Assigned To
              </div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
                  <User size={12} className="text-gray-600" />
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  {task.picker
                    ? `${task.picker.first_name} ${task.picker.last_name}`.trim() ||
                      task.picker.username
                    : `User ${task.assigned_to || "N/A"}`}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-5">
            <div className="md:col-span-2">
              <div className="text-xs font-medium text-gray-500">
                Order / SKU
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {task.order?.order_no || "N/A"} •{" "}
                {task.orderLine?.sku?.sku_name || "N/A"}
              </div>
            </div>

            <div className="md:col-span-3">
              <div className="text-xs font-medium text-gray-500">
                Time Elapsed
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <Clock size={14} className="text-gray-400" />
                {formatTimeElapsed(
                  task.pick_started_at || task.assigned_at || task.createdAt,
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Left: Pick Steps */}
          <div className="lg:col-span-2 rounded-lg border border-gray-200 bg-white">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div className="text-sm font-semibold text-gray-900">
                Pick Steps
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700">
                <KeyRound size={14} className="text-gray-500" />
                Sequence Enforced
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs font-semibold text-gray-500">
                  <tr>
                    <th className="px-5 py-3 text-left">#</th>
                    <th className="px-5 py-3 text-left">Bin</th>
                    <th className="px-5 py-3 text-left">SKU</th>
                    <th className="px-5 py-3 text-left">Req</th>
                    <th className="px-5 py-3 text-left">Picked</th>
                    <th className="px-5 py-3 text-left">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {steps.map((s) => {
                    const isCurrent = s.state === "current";
                    return (
                      <tr
                        key={s.idx}
                        className={`relative ${isCurrent ? "bg-blue-50" : "bg-white"}`}
                      >
                        {isCurrent && (
                          <td
                            className="absolute left-0 top-0 h-full w-1 bg-blue-600"
                            aria-hidden
                          />
                        )}

                        <td className="px-5 py-4">
                          <StepBadge state={s.state} index={s.idx} />
                        </td>

                        <td className="px-5 py-4 font-semibold text-gray-900">
                          {s.bin}
                        </td>

                        <td className="px-5 py-4">
                          <div className="font-semibold text-gray-900">
                            {s.sku}
                          </div>
                          <div className="text-xs text-gray-500">
                            {s.skuSub}
                          </div>
                        </td>

                        <td className="px-5 py-4 text-gray-900">{s.req}</td>
                        <td className="px-5 py-4 text-gray-900">{s.picked}</td>
                        <td className="px-5 py-4">
                          <StatusChip text={s.status} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Scan & Confirm */}
          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div className="text-sm font-semibold text-gray-900">
                Scan & Confirm
              </div>
              <button
                type="button"
                className="rounded-md p-2 text-gray-500 hover:bg-gray-50"
                title="Expand"
              >
                <ExternalLink size={16} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Summary card */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-medium text-gray-500">
                      Pick From
                    </div>
                    <div className="text-lg font-semibold text-blue-600">
                      {currentStep.bin}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-medium text-gray-500">
                      Required Qty
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      {currentStep.req} EA
                    </div>
                  </div>

                  <div className="col-span-1">
                    <div className="text-xs font-medium text-gray-500">SKU</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {currentStep.sku}
                    </div>
                    <div className="text-xs text-gray-500">
                      {currentStep.skuSub}
                    </div>
                  </div>

                  <div className="col-span-1 text-right">
                    <div className="text-xs font-medium text-gray-500">
                      Batch Required
                    </div>
                    <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                      {task.orderLine?.batch_preference ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Scan inputs */}
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    1. Scan Bin Location
                  </div>
                  <input
                    value={binScan}
                    onChange={(e) => setBinScan(e.target.value)}
                    disabled={isCompleted}
                    className={`mt-2 w-full rounded-md border px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 ${
                      binScan === task.sourceLocation?.location_code && binScan
                        ? "bg-green-50 border-green-300"
                        : "bg-white border-gray-200"
                    }`}
                    placeholder="Scan bin location..."
                  />
                  {binScan &&
                    binScan !== task.sourceLocation?.location_code && (
                      <p className="mt-1 text-xs text-red-600">
                        Expected: {task.sourceLocation?.location_code}
                      </p>
                    )}
                </div>

                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    2. Scan SKU Barcode
                  </div>
                  <input
                    value={skuScan}
                    onChange={(e) => setSkuScan(e.target.value)}
                    disabled={isCompleted}
                    className={`mt-2 w-full rounded-md border px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 ${
                      skuScan === task.orderLine?.sku?.sku_code && skuScan
                        ? "bg-green-50 border-green-300"
                        : "bg-white border-gray-200"
                    }`}
                    placeholder="Scan SKU..."
                  />
                  {skuScan && skuScan !== task.orderLine?.sku?.sku_code && (
                    <p className="mt-1 text-xs text-red-600">
                      Expected: {task.orderLine?.sku?.sku_code}
                    </p>
                  )}
                </div>

                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    3. Confirm Quantity
                  </div>
                  <input
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    type="number"
                    disabled={isCompleted}
                    className="mt-2 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400"
                    placeholder={`${currentStep.req}`}
                    min={0}
                    max={currentStep.req}
                    step="0.001"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isInProgress && (
          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleCompleteTask}
              disabled={submitting}
              className="flex-1 bg-green-600 text-white py-3 rounded-md font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Complete Task
                </>
              )}
            </button>

            <button
              onClick={handleRaiseException}
              disabled={submitting}
              className="flex-1 border border-red-300 text-red-700 py-3 rounded-md font-medium hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Raise Exception
            </button>

            <button
              onClick={handlePartialPick}
              disabled={submitting || !qty || parseFloat(qty) <= 0}
              className="px-6 border border-gray-300 text-gray-700 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Partial Pick
            </button>
          </div>
        )}

        {/* Back button */}
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 mt-4"
          >
            ← Back to Tasks
          </button>
        )}
      </div>
    </div>
  );
};

export default PickTaskDetail;
