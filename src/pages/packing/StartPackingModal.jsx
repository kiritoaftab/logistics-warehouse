// packing/StartPackingModal.jsx
import React, { useState } from "react";
import { X, Scan, Package, Check, User } from "lucide-react";

const StartPackingModal = ({ onClose, onStartPacking }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [packStation, setPackStation] = useState("");
  const [packerName, setPackerName] = useState("");

  const availableOrders = [
    { id: 1, orderNo: "ORDER-2024-8801", client: "Acme Corp", units: 120 },
    { id: 2, orderNo: "ORDER-2024-8804", client: "Acme Corp", units: 450 },
    { id: 3, orderNo: "ORDER-2024-8792", client: "Beta Ltd", units: 24 },
    { id: 4, orderNo: "ORDER-2024-8785", client: "Gamma Inc", units: 96 },
  ];

  const packStations = ["Pack-01", "Pack-02", "Pack-03", "Pack-04"];
  const packers = ["John Doe", "Jane Smith", "Mike Brown", "Sarah Lee"];

  const handleScan = () => {
    const scannedOrder = prompt("Scan order barcode:");
    if (scannedOrder) {
      const order = availableOrders.find((o) => o.orderNo === scannedOrder);
      if (order) {
        setSelectedOrder(order);
      } else {
        alert("Order not found!");
      }
    }
  };

  const handleStart = () => {
    if (!selectedOrder || !packStation || !packerName) {
      alert("Please select order, pack station, and packer");
      return;
    }

    if (onStartPacking) {
      onStartPacking({
        order: selectedOrder,
        packStation,
        packer: packerName,
        startTime: new Date().toISOString(),
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <div>
            <h3 className="text-lg font-semibold">Start Packing</h3>
            <p className="text-sm text-gray-600">
              Select order to begin packing
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Order Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Select Order</label>
              <button
                type="button"
                onClick={handleScan}
                className="text-sm text-blue-600 flex items-center gap-1"
              >
                <Scan size={16} />
                Scan
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {availableOrders.map((order) => (
                <button
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`p-3 border rounded-lg text-left ${
                    selectedOrder?.id === order.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="font-medium">{order.orderNo}</div>
                  <div className="text-sm text-gray-600">{order.client}</div>
                  <div className="text-xs text-gray-500">
                    {order.units} units
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Pack Station */}
          <div>
            <label className="text-sm font-medium block mb-2">
              Pack Station
            </label>
            <select
              value={packStation}
              onChange={(e) => setPackStation(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">Select station</option>
              {packStations.map((station) => (
                <option key={station} value={station}>
                  {station}
                </option>
              ))}
            </select>
          </div>

          {/* Packer */}
          <div>
            <label className="text-sm font-medium block mb-2">
              Packer Name
            </label>
            <select
              value={packerName}
              onChange={(e) => setPackerName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">Select packer</option>
              {packers.map((packer) => (
                <option key={packer} value={packer}>
                  {packer}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleStart}
            disabled={!selectedOrder || !packStation || !packerName}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Packing
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartPackingModal;
