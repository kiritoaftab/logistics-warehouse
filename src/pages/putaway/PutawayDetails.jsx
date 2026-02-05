import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import PutawayTaskSummary from "./PutawayTaskSummary";
import ScanConfirmCard from "./ScanConfirmCard";
import PutawayRightPanel from "./PutawayRightPanel";
import http from "../../api/http";
import { useToast } from "../components/toast/ToastProvider";

const PutawayDetails = () => {
  const { id } = useParams(); // This is grn_line_id
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [locations, setLocations] = useState([]);
  
  // State for assign modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignForm, setAssignForm] = useState({
    user_id: "",
    destination_location: ""
  });
  const [assigning, setAssigning] = useState(false);
  
  // Other states
  const [scanSku, setScanSku] = useState("");
  const [goodQty, setGoodQty] = useState(0);
  const [holdQty, setHoldQty] = useState(0);
  const [bin, setBin] = useState("");
  const [saving, setSaving] = useState(false);
  const [completing, setCompleting] = useState(false);

  // Fetch task data, users, and locations
  useEffect(() => {
    fetchTaskData();
    fetchUsers();
    fetchLocations();
    
    // Check if we need to open assign modal from state
    if (location.state?.openAssign) {
      setAssignModalOpen(true);
    }
  }, [id, location.state]);

  const fetchTaskData = async () => {
    try {
      setLoading(true);
      const response = await http.get(`/grn-lines/${id}`);
      
      if (response.data.success) {
        const taskData = response.data.data;
        setTask(taskData);
        setGoodQty(taskData.qty || 0);
        setScanSku(taskData.sku?.sku_code || "");
        setBin(taskData.destination_location?.location_code || "");
        
        // Pre-fill assign form with existing data
        if (taskData) {
          setAssignForm({
            user_id: taskData.assigned_to || "",
            destination_location: taskData.destination_location_id || ""
          });
        }
      } else {
        toast.error("Failed to fetch task details");
        navigate("/putaway");
      }
    } catch (error) {
      console.error("Error fetching task data:", error);
      toast.error("Failed to load putaway task");
      navigate("/putaway");
    } finally {
      setLoading(false);
    }
  };

  // Fetch users for assignment
  const fetchUsers = async () => {
    try {
      const response = await http.get('/users?role=operator,supervisor');
      if (response.data.success) {
        setUsers(response.data.data.users || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    }
  };

  // Fetch locations for assignment
  const fetchLocations = async () => {
    try {
      const response = await http.get('/locations?page=1&limit=100');
      if (response.data.success) {
        const filteredLocations = response.data.data.locations.filter(
          loc => loc.is_putawayable === true && loc.is_active === true
        );
        setLocations(filteredLocations);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
      toast.error("Failed to load locations");
    }
  };

  // Format task data for display
  const formatTaskData = () => {
    if (!task) return null;

    const statusMap = {
      'PENDING': 'Pending',
      'ASSIGNED': 'Assigned',
      'IN_PROGRESS': 'In Progress',
      'COMPLETED': 'Completed',
      'CANCELLED': 'Cancelled'
    };

    // Calculate capacity usage
    const capacity = task.destination_location?.capacity || 0;
    const currentUsage = task.destination_location?.current_usage || 0;
    const capacityUsedPercent = capacity > 0 ? Math.round((currentUsage / capacity) * 100) : 0;
    const remainingCapacity = Math.max(0, capacity - currentUsage);

    return {
      status: statusMap[task.putaway_status] || task.putaway_status,
      taskId: task.pt_task_id || "N/A",
      grn: task.grn?.grn_no || `GRN-${String(task.grn_id).padStart(5, '0')}`,
      asn: `ASN-${String(task.asn_line_id).padStart(5, '0')}`,
      skuName: task.sku?.sku_name || "N/A",
      skuCode: task.sku?.sku_code || "N/A",
      qty: task.qty || 0,
      qtyLabel: `${task.qty || 0} ${task.sku?.uom || "EA"}`,
      assignedTo: task.assignee ? `${task.assignee.first_name} ${task.assignee.last_name}`.trim() || task.assignee.username : "Not assigned",
      sourceLocation: task.source_location?.location_code || "N/A",
      suggestedZone: task.destination_location?.zone ? `Zone ${task.destination_location.zone}` : "N/A",
      suggestedBin: task.destination_location?.location_code || "N/A",
      createdAt: task.created_at ? formatDate(task.created_at) : "N/A",
      priority: "Normal",
      capacityUsedPercent,
      remainingCapacityText: `${remainingCapacity} units`,
      maxCapacityText: `Max: ${capacity} units`,
      batchNo: task.batch_no || "N/A",
      expiryDate: "N/A",
      destinationLocation: task.destination_location,
      putawayStatus: task.putaway_status,
      fragile: task.sku?.fragile || false,
      assignedToId: task.assigned_to,
      destinationLocationId: task.destination_location_id
    };
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const today = new Date();
    
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  // Handle assign task API call
  const handleAssignTask = async () => {
    if (!assignForm.user_id || !assignForm.destination_location) {
      toast.error("Please select a user and destination location");
      return;
    }

    try {
      setAssigning(true);
      
      const payload = {
        line_id: parseInt(id),
        user_id: parseInt(assignForm.user_id),
        destination_location: parseInt(assignForm.destination_location)
      };

      console.log("Assigning task with payload:", payload);
      const response = await http.post('/grns/assign-putaway', payload);
      
      if (response.data.success) {
        toast.success("Putaway task assigned successfully!");
        setAssignModalOpen(false);
        fetchTaskData(); // Refresh task data
      } else {
        toast.error(response.data.message || "Failed to assign task");
      }
    } catch (error) {
      console.error("Error assigning task:", error);
      toast.error(error.response?.data?.message || "Failed to assign putaway task");
    } finally {
      setAssigning(false);
    }
  };

  // Open assign modal
  const openAssignModal = () => {
    if (task) {
      setAssignForm({
        user_id: task.assigned_to || "",
        destination_location: task.destination_location_id || ""
      });
      setAssignModalOpen(true);
    }
  };

  // Handle SKU scan
  const handleSKUScan = (scannedSKU) => {
    const currentSKU = task?.sku?.sku_code;
    
    if (currentSKU && scannedSKU !== currentSKU) {
      toast.error(`SKU mismatch! Expected: ${currentSKU}, Scanned: ${scannedSKU}`);
      setScanSku("");
      return;
    }
    
    setScanSku(scannedSKU);
    toast.success("SKU verified successfully!");
  };

  // Handle quantity changes
  const handleGoodQtyChange = (value) => {
    const numericValue = parseInt(value) || 0;
    const totalQty = task?.qty || 0;
    
    if (numericValue > totalQty) {
      toast.error(`Good quantity cannot exceed ${totalQty}`);
      setGoodQty(totalQty);
    } else {
      setGoodQty(numericValue);
    }
  };

  const handleHoldQtyChange = (value) => {
    const numericValue = parseInt(value) || 0;
    const totalQty = task?.qty || 0;
    
    if (numericValue > totalQty) {
      toast.error(`Damaged/Hold quantity cannot exceed ${totalQty}`);
      setHoldQty(totalQty);
    } else {
      setHoldQty(numericValue);
    }
  };

  // Calculate remaining quantity
  const calculateRemainingQty = () => {
    if (!task) return 0;
    const totalQty = task.qty || 0;
    const allocatedQty = goodQty + holdQty;
    return Math.max(0, totalQty - allocatedQty);
  };

  // Save draft
  const handleSaveDraft = async () => {
    try {
      setSaving(true);
      
      const draftData = {
        scanSku,
        goodQty,
        holdQty,
        bin,
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem(`putaway-draft-${id}`, JSON.stringify(draftData));
      toast.success("Draft saved successfully!");
      
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error("Failed to save draft");
    } finally {
      setSaving(false);
    }
  };

  // Complete task - FIXED VERSION
 const handleCompleteTask = async () => {
  console.log("=== Starting complete task for Task ID:", id, "===");
  
  try {
    // STEP 1: First fetch fresh task data
    console.log("Fetching fresh task data...");
    const freshTaskResponse = await http.get(`/grn-lines/${id}`);
    
    if (!freshTaskResponse.data.success) {
      toast.error("Failed to fetch task data");
      return;
    }
    
    const freshTask = freshTaskResponse.data.data;
    console.log("Fresh task data:", {
      taskId: freshTask.id,
      ptTaskId: freshTask.pt_task_id,
      status: freshTask.putaway_status,
      grnId: freshTask.grn_id,
      grnStatus: freshTask.grn?.status
    });
    
    // STEP 2: Check if this specific task is already completed
    if (freshTask.putaway_status === 'COMPLETED') {
      toast.error(`Task ${freshTask.pt_task_id} is already completed`);
      setTask(freshTask); // Update local state
      return;
    }
    
    // STEP 3: Check if the GRN is already closed/completed
    if (freshTask.grn?.status === 'CLOSED' || freshTask.grn?.status === 'COMPLETED') {
      toast.error(`GRN ${freshTask.grn?.grn_no} is already closed. Cannot complete individual tasks.`);
      setTask(freshTask);
      return;
    }
    
    // STEP 4: Validate task can be completed
    if (freshTask.putaway_status === 'PENDING') {
      toast.error("Task must be assigned before completion");
      setTask(freshTask);
      return;
    }

    if (!freshTask.assigned_to) {
      toast.error("Task must be assigned to a user");
      setTask(freshTask);
      return;
    }

    if (!freshTask.destination_location_id) {
      toast.error("Destination location must be assigned");
      setTask(freshTask);
      return;
    }

    // STEP 5: Validate quantities
    const remainingQty = calculateRemainingQty();
    if (remainingQty > 0) {
      toast.error(`Please allocate all ${freshTask.qty} units. Remaining: ${remainingQty}`);
      return;
    }

    if (!scanSku || scanSku !== freshTask.sku?.sku_code) {
      toast.error("Please scan and verify the SKU");
      return;
    }

    // STEP 6: Confirm with user
    if (!window.confirm(`Complete putaway task ${freshTask.pt_task_id} (GRN: ${freshTask.grn?.grn_no})?`)) {
      return;
    }

    setCompleting(true);
    
    // STEP 7: Check GRN status separately before attempting completion
    console.log("Checking GRN status...");
    const grnCheckResponse = await http.get(`/grns/${freshTask.grn_id}`);
    
    if (grnCheckResponse.data.success) {
      const grnData = grnCheckResponse.data.data;
      console.log("GRN data:", grnData);
      
      if (grnData.status === 'CLOSED' || grnData.status === 'COMPLETED') {
        toast.error(`GRN ${grnData.grn_no} is already ${grnData.status}. Cannot add more putaway tasks.`);
        setCompleting(false);
        return;
      }
    }
    
    // STEP 8: Prepare payload for THIS SPECIFIC TASK (ID 7)
    const payload = {
      line_id: parseInt(id), // This should be 7
      good_qty: parseInt(goodQty),
      damaged_qty: parseInt(holdQty),
      destination_location: parseInt(freshTask.destination_location_id),
      scanned_sku: scanSku
    };

    console.log("Sending completion for Task ID 7:", {
      endpoint: `/grns/${freshTask.grn_id}/complete-putaway`,
      payload: payload,
      taskDetails: {
        line_id: id,
        expected: 7,
        grn_id: freshTask.grn_id
      }
    });

    // STEP 9: Make API call
    const response = await http.post(`/grns/${freshTask.grn_id}/complete-putaway`, payload);
    
    console.log("Completion response:", response.data);
    
    if (response.data.success) {
      toast.success(`Task ${freshTask.pt_task_id} completed successfully!`);
      
      // Update local state
      setTask(prev => ({
        ...prev,
        putaway_status: 'COMPLETED',
        putaway_completed_at: new Date().toISOString()
      }));
      
      // Show inventory update
      if (response.data.data?.inventory) {
        const inventory = response.data.data.inventory;
        toast.info(`Inventory: ${inventory.on_hand_qty} on hand, ${inventory.available_qty} available`);
      }
      
      // Navigate after delay
      setTimeout(() => {
        navigate("/putaway");
      }, 2000);
      
    } else {
      toast.error(response.data.message || "Failed to complete task");
    }
    
  } catch (error) {
    console.error("Error completing task:", error);
    
    // Handle specific error for GRN already completed
    if (error.response?.data?.message === "Putaway task already completed" || 
        error.response?.data?.message?.includes("already completed")) {
      
      // This means the GRN (GRN ID 5) is already completed
      toast.error(`GRN ${task?.grn?.grn_no} is already completed. All tasks under it are marked as completed.`);
      
      // Force fetch the latest task data
      try {
        const latestTask = await http.get(`/grn-lines/${id}`);
        if (latestTask.data.success) {
          setTask(latestTask.data.data);
        }
      } catch (refreshError) {
        console.error("Failed to refresh:", refreshError);
      }
      
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Failed to complete task");
    }
  } finally {
    setCompleting(false);
  }
};

  // Start task (if assigned)
  const handleStartTask = async () => {
    try {
      console.log("Starting task with ID:", id);
      
      // Update task status to IN_PROGRESS
      const payload = {
        status: 'IN_PROGRESS'
      };
      
      const response = await http.put(`/grn-lines/${id}/status`, payload);
      
      if (response.data.success) {
        toast.success("Putaway task started!");
        fetchTaskData(); // Refresh data
      } else {
        toast.error(response.data.message || "Failed to start task");
      }
    } catch (error) {
      console.error("Error starting task:", error);
      toast.error("Failed to start putaway task");
    }
  };

  // Handle back button
  const handleBack = () => {
    navigate("/putaway");
  };

  // Load draft data on component mount
  useEffect(() => {
    const loadDraft = () => {
      const draft = localStorage.getItem(`putaway-draft-${id}`);
      if (draft) {
        try {
          const draftData = JSON.parse(draft);
          setScanSku(draftData.scanSku || "");
          setGoodQty(draftData.goodQty || 0);
          setHoldQty(draftData.holdQty || 0);
          setBin(draftData.bin || "");
        } catch (error) {
          console.error("Error loading draft:", error);
        }
      }
    };

    if (!loading && task) {
      loadDraft();
    }
  }, [id, loading, task]);

  // Format location for dropdown
  const formatLocationOption = (location) => {
    let displayText = location.location_code;
    if (location.zone && location.aisle && location.rack && location.level) {
      displayText += ` (${location.zone}-${location.aisle}-${location.rack}-${location.level})`;
    }
    return displayText;
  };

  // If loading, show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading putaway task details...</div>
      </div>
    );
  }

  // If no task found
  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900 mb-2">
              Task Not Found
            </div>
            <div className="text-gray-600 mb-4">
              The putaway task you're looking for doesn't exist.
            </div>
            <button
              onClick={() => navigate("/putaway")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Back to Putaway Tasks
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formattedTask = formatTaskData();
  const remainingQty = calculateRemainingQty();
  const requiredQty = task.qty || 0;
  const allocatedQty = goodQty + holdQty;
  const isTaskCompleted = task.putaway_status === 'COMPLETED';
  const isTaskAssigned = task.putaway_status === 'ASSIGNED';
  const isTaskInProgress = task.putaway_status === 'IN_PROGRESS';
  const isTaskPending = task.putaway_status === 'PENDING';
  
  // Check if task can be completed
  const canCompleteTask = (isTaskAssigned || isTaskInProgress) && 
                         remainingQty === 0 && 
                         scanSku === task.sku?.sku_code &&
                         task.destination_location_id;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {formattedTask && (
        <PutawayTaskSummary 
          task={formattedTask} 
          onSaveDraft={handleSaveDraft}
          onBack={handleBack}
          onAssign={openAssignModal}
          isPending={isTaskPending}
        />
      )}
      
      <div className="mx-auto 2xl:max-w-[1900px] px-6 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <ScanConfirmCard
              task={formattedTask}
              scanSku={scanSku}
              setScanSku={handleSKUScan}
              goodQty={goodQty}
              setGoodQty={handleGoodQtyChange}
              holdQty={holdQty}
              setHoldQty={handleHoldQtyChange}
            />
          </div>

          <div className="space-y-6">
            <PutawayRightPanel 
              task={formattedTask} 
              bin={bin}
              setBin={setBin}
            />
          </div>
        </div>
      </div>

      {/* Assign Task Modal */}
      {assignModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {task.putaway_status === 'PENDING' ? 'Assign' : 'Re-assign'} Putaway Task
              </h3>
              <button
                onClick={() => setAssignModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Task Details</div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Task ID:</span>
                      <div className="font-medium">{task.pt_task_id}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">SKU:</span>
                      <div className="font-medium">{task.sku?.sku_name}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Quantity:</span>
                      <div className="font-medium">{task.qty} {task.sku?.uom}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Source:</span>
                      <div className="font-medium">{task.source_location?.location_code}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign To User *
                </label>
                <select
                  value={assignForm.user_id}
                  onChange={(e) => setAssignForm({...assignForm, user_id: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select User</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.first_name} {user.last_name} ({user.username})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destination Location *
                </label>
                <select
                  value={assignForm.destination_location}
                  onChange={(e) => setAssignForm({...assignForm, destination_location: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Location</option>
                  {locations.map(location => (
                    <option key={location.id} value={location.id}>
                      {formatLocationOption(location)}
                    </option>
                  ))}
                </select>
                {task.sku?.putaway_zone && (
                  <p className="text-xs text-gray-500 mt-1">
                    Suggested Zone: {task.sku.putaway_zone}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setAssignModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignTask}
                  disabled={assigning}
                  className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {assigning ? "Assigning..." : "Assign Task"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Footer Summary */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white shadow-lg">
        <div className="mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4 2xl:max-w-[1900px]">
          {/* Metrics */}
          <div className="flex items-center gap-6 md:gap-8">
            <div className="min-w-[100px] md:min-w-[120px]">
              <div className="text-[11px] uppercase tracking-wide text-gray-500">
                Required
              </div>
              <div className="mt-1 text-lg md:text-xl font-semibold text-gray-900">
                {requiredQty}
              </div>
            </div>

            <div className="h-8 md:h-10 w-px bg-gray-200" />

            <div className="min-w-[100px] md:min-w-[120px]">
              <div className="text-[11px] uppercase tracking-wide text-gray-500">
                Allocated
              </div>
              <div className="mt-1 text-lg md:text-xl font-semibold text-blue-600">
                {allocatedQty}
              </div>
            </div>

            <div className="h-8 md:h-10 w-px bg-gray-200" />

            <div className="min-w-[100px] md:min-w-[120px]">
              <div className="text-[11px] uppercase tracking-wide text-gray-500">
                Remaining
              </div>
              <div className={`mt-1 text-lg md:text-xl font-semibold ${
                remainingQty === 0 ? 'text-green-600' : 'text-gray-400'
              }`}>
                {remainingQty}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {isTaskAssigned && !isTaskInProgress && !isTaskCompleted && (
              <>
                <button
                  onClick={openAssignModal}
                  className="rounded-lg bg-blue-600 px-4 md:px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                >
                  Re-assign Task
                </button>
                <button
                  onClick={handleStartTask}
                  className="rounded-lg bg-green-600 px-4 md:px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700"
                >
                  Start Task
                </button>
              </>
            )}

            {isTaskPending && !isTaskCompleted && (
              <button
                onClick={openAssignModal}
                className="rounded-lg bg-blue-600 px-4 md:px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
              >
                Assign Task
              </button>
            )}

            <button
              onClick={handleCompleteTask}
              disabled={isTaskCompleted || completing || !canCompleteTask}
              className={`rounded-lg px-4 md:px-6 py-2 text-sm font-medium text-white shadow-sm ${
                isTaskCompleted 
                  ? 'bg-gray-400 cursor-not-allowed'
                  : canCompleteTask
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {completing ? "Completing..." : 
               isTaskCompleted ? "Task Completed" : 
               "Complete Task"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PutawayDetails;