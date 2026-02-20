// PickingQueueTable.jsx
import React, { useState, useEffect } from "react";
import http from "../../api/http";

const PriorityPill = ({ label }) => {
  const getPriorityStyles = (priority) => {
    const styles = {
      'HIGH': 'bg-red-100 text-red-700',
      'URGENT': 'bg-red-100 text-red-700',
      'NORMAL': 'bg-gray-100 text-gray-700',
      'LOW': 'bg-blue-100 text-blue-700'
    };
    return styles[priority] || 'bg-gray-100 text-gray-700';
  };

  const styles = getPriorityStyles(label);
  
  // Format priority text (capitalize first letter, rest lowercase)
  const formattedLabel = label ? label.charAt(0).toUpperCase() + label.slice(1).toLowerCase() : 'Normal';

  return (
    <span className={`px-2 py-0.5 text-xs rounded-full ${styles}`}>
      {formattedLabel}
    </span>
  );
};

const PickingQueueTable = ({ warehouseId = '1' }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPickingQueue();
  }, [warehouseId]);

  const fetchPickingQueue = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch orders with PICKING status (active picks)
      const pickingResponse = await http.get(
        `/sales-orders/?status=PICKING&page=1&limit=5&warehouse_id=${warehouseId}`
      );
      
      // Fetch orders with PICKED status (completed picks)
      const pickedResponse = await http.get(
        `/sales-orders/?status=PICKED&page=1&limit=5&warehouse_id=${warehouseId}`
      );
      
      let combinedOrders = [];
      
      // Process PICKING orders (active)
      if (pickingResponse.data && pickingResponse.data.orders) {
        const pickingOrders = pickingResponse.data.orders.map(order => ({
          ...order,
          queueType: 'active' // Mark as active picking
        }));
        combinedOrders = [...combinedOrders, ...pickingOrders];
      }
      
      // Process PICKED orders (completed)
      if (pickedResponse.data && pickedResponse.data.orders) {
        const pickedOrders = pickedResponse.data.orders.map(order => ({
          ...order,
          queueType: 'completed' // Mark as completed
        }));
        combinedOrders = [...combinedOrders, ...pickedOrders];
      }
      
      // Sort by priority (HIGH/URGENT first) and then by date
      combinedOrders.sort((a, b) => {
        const priorityOrder = { 'HIGH': 1, 'URGENT': 1, 'NORMAL': 2, 'LOW': 3 };
        const aPriority = priorityOrder[a.priority] || 2;
        const bPriority = priorityOrder[b.priority] || 2;
        
        if (aPriority !== bPriority) {
          return aPriority - bPriority;
        }
        
        // If same priority, sort by date (most recent first for active)
        if (a.queueType === 'active' && b.queueType === 'active') {
          return new Date(b.order_date) - new Date(a.order_date);
        }
        return 0;
      });
      
      // Limit to 5 orders total for display
      setOrders(combinedOrders.slice(0, 5));
      
    } catch (err) {
      console.error("Error fetching picking queue:", err);
      setError("Failed to load picking queue");
    } finally {
      setLoading(false);
    }
  };

  // Calculate SLA time
  const getSLADisplay = (order) => {
    if (order.queueType === 'completed') {
      if (order.picking_completed_at) {
        const completed = new Date(order.picking_completed_at);
        const now = new Date();
        const diffMs = now - completed;
        const diffMins = Math.floor(diffMs / 60000);
        
        if (diffMins < 60) {
          return `${diffMins}m ago`;
        } else {
          const diffHours = Math.floor(diffMins / 60);
          return `${diffHours}h ago`;
        }
      }
      return 'Completed';
    } else {
      if (order.picking_started_at) {
        const started = new Date(order.picking_started_at);
        const now = new Date();
        const diffMs = now - started;
        const diffMins = Math.floor(diffMs / 60000);
        
        if (diffMins < 60) {
          return `${diffMins}m`;
        } else {
          const diffHours = Math.floor(diffMins / 60);
          return `${diffHours}h`;
        }
      }
      return '—';
    }
  };

  // Get item count
  const getItemCount = (order) => {
    return order.total_lines || 0;
  };

  // Get progress percentage
  const getProgress = (order) => {
    if (order.queueType === 'active' && order.total_lines > 0) {
      const pickedLines = order.lines?.filter(line => parseFloat(line.picked_qty) > 0).length || 0;
      return Math.round((pickedLines / order.total_lines) * 100);
    }
    return order.queueType === 'completed' ? 100 : 0;
  };

  if (loading) {
    return (
      <div className="text-center py-4 text-gray-500">
        Loading picking queue...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        {error}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No picking orders found
      </div>
    );
  }

  return (
    <table className="w-full text-sm">
      <thead className="text-gray-500">
        <tr className="border-b">
          <th className="text-left py-2 font-medium w-[30%]">Order</th>
          <th className="text-left font-medium w-[20%]">Priority</th>
          <th className="text-left font-medium w-[15%]">Items</th>
          <th className="text-left font-medium w-[20%]">Time</th>
          <th className="text-left font-medium w-[15%]">Progress</th>
        </tr>
      </thead>

      <tbody>
        {orders.map((order) => {
          const progress = getProgress(order);
          const itemCount = getItemCount(order);
          
          return (
            <tr 
              key={order.id} 
              className="border-b last:border-0 hover:bg-gray-50"
            >
              <td className="py-3">
                <div className="flex items-center">
                  <span className={`font-medium ${
                    order.queueType === 'completed' 
                      ? 'text-gray-600' 
                      : 'text-blue-600'
                  }`}>
                    {order.order_no}
                  </span>
                  {order.queueType === 'completed' && (
                    <span className="ml-1.5 text-green-600 text-xs">✓</span>
                  )}
                </div>
              </td>
              
              <td className="py-3">
                <PriorityPill label={order.priority} />
              </td>
              
              <td className="py-3">
                <span className="text-gray-700">{itemCount}</span>
              </td>
              
              <td className="py-3">
                <span className={order.queueType === 'active' ? 'text-gray-900' : 'text-gray-500'}>
                  {getSLADisplay(order)}
                </span>
              </td>
              
              <td className="py-3">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        order.queueType === 'completed' 
                          ? 'bg-green-500' 
                          : progress > 0 ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 w-8">
                    {progress}%
                  </span>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default PickingQueueTable;