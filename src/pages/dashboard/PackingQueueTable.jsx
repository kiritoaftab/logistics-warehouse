// PackingQueueTable.jsx
import React, { useState, useEffect } from "react";
import http from "../../api/http";

const StatusPill = ({ label }) => {
  const getStatusStyles = (status) => {
    const styles = {
      'PACKING': 'bg-blue-100 text-blue-700',
      'PACKED': 'bg-green-100 text-green-700'
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const styles = getStatusStyles(label);
  const formattedLabel = label ? label.charAt(0).toUpperCase() + label.slice(1).toLowerCase() : 'Unknown';

  return (
    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${styles}`}>
      {formattedLabel}
    </span>
  );
};

const PackingQueueTable = ({ warehouseId = '1' }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPackingQueue();
  }, [warehouseId]);

  const fetchPackingQueue = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const packingResponse = await http.get(
        `/sales-orders/?status=PACKING&page=1&limit=3&warehouse_id=${warehouseId}`
      );
      
      const packedResponse = await http.get(
        `/sales-orders/?status=PACKED&page=1&limit=2&warehouse_id=${warehouseId}`
      );
      
      let combinedOrders = [];
      
      if (packingResponse.data && packingResponse.data.orders) {
        combinedOrders = [...combinedOrders, ...packingResponse.data.orders];
      }
      
      if (packedResponse.data && packedResponse.data.orders) {
        combinedOrders = [...combinedOrders, ...packedResponse.data.orders];
      }
      
      setOrders(combinedOrders.slice(0, 4));
      
    } catch (err) {
      console.error("Error fetching packing queue:", err);
      setError("Failed to load packing queue");
    } finally {
      setLoading(false);
    }
  };

  const getCarrier = (order) => {
    return order.carrier || '—';
  };

  const getItemCount = (order) => {
    return order.total_lines || 0;
  };

  if (loading) {
    return (
      <div className="text-center py-4 text-gray-500">
        Loading...
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
        No orders found
      </div>
    );
  }

  return (
    <table className="w-full text-sm">
      <thead className="text-gray-500">
        <tr className="border-b">
          <th className="text-left py-2 font-medium">Order</th>
          <th className="text-left font-medium">Carrier</th>
          <th className="text-left font-medium">Items</th>
          <th className="text-left font-medium">Status</th>
        </tr>
      </thead>

      <tbody>
        {orders.map((order) => (
          <tr key={order.id} className="border-b last:border-0">
            <td className="py-3 font-medium text-blue-600">{order.order_no}</td>
            <td className="py-3 text-gray-700">{getCarrier(order)}</td>
            <td className="py-3 text-gray-700">{getItemCount(order)}</td>
            <td className="py-3">
              <StatusPill label={order.status} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PackingQueueTable;