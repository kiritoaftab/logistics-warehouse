// InboundQueueTable.jsx
import React, { useState, useEffect } from "react";
import http from "../../api/http";
import { useNavigate } from "react-router-dom";

const StatusPill = ({ label, color }) => {
  const getStatusColor = (status) => {
    const statusMap = {
      CONFIRMED: "bg-yellow-100 text-yellow-700",
      IN_RECEIVING: "bg-blue-100 text-blue-700",
      GRN_POSTED: "bg-green-100 text-green-700",
      PUTAWAY_PENDING: "bg-purple-100 text-purple-700",
      PUTAWAY_COMPLETED: "bg-green-100 text-green-700",
      CLOSED: "bg-gray-100 text-gray-600",
    };
    return statusMap[status] || "bg-gray-100 text-gray-600";
  };

  const pillColor = color || getStatusColor(label);

  return (
    <span
      className={`px-2 py-0.5 text-xs rounded-full font-medium ${pillColor}`}
    >
      {label.replace(/_/g, " ")}
    </span>
  );
};

const InboundQueueTable = ({ warehouseId = "1" }) => {
  const navigate = useNavigate();

  const [asns, setAsns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInboundQueue();
  }, [warehouseId]);

  const fetchInboundQueue = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch latest 3 ASNs for the queue
      const response = await http.get(
        `/asns?page=1&limit=3&warehouse_id=${warehouseId}`,
      );

      if (response.data.success) {
        setAsns(response.data.data.asns);
      }
    } catch (err) {
      console.error("Error fetching inbound queue:", err);
      setError("Failed to load inbound queue");
    } finally {
      setLoading(false);
    }
  };

  // Format ETA time
  const formatETA = (eta) => {
    if (!eta) return "N/A";
    const date = new Date(eta);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="text-center py-4 text-gray-500">
        Loading inbound queue...
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  if (asns.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No inbound ASNs found
      </div>
    );
  }

  return (
    <table className="w-full text-sm">
      <thead className="text-gray-500">
        <tr className="border-b">
          <th className="text-left py-2 font-medium">ASN</th>
          <th className="text-left font-medium">ETA</th>
          <th className="text-left font-medium">Status</th>
          <th className="text-right font-medium">Action</th>
        </tr>
      </thead>

      <tbody>
        {asns.map((asn) => (
          <tr key={asn.id} className="border-b last:border-0">
            <td className="py-3 text-blue-600 font-medium">{asn.asn_no}</td>
            <td>{formatETA(asn.eta)}</td>
            <td>
              <StatusPill label={asn.status} />
            </td>
            <td className="text-right">
              <button
                className="text-blue-600 font-medium hover:text-blue-800 cursor-pointer"
                onClick={() => {
                  navigate(`/inbound/ASNdetails/${asn.id}`);
                }}
              >
                Open
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default InboundQueueTable;
