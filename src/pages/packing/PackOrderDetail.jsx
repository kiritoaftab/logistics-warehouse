// packing/PackOrderDetail.jsx
import React, { useMemo, useState, useEffect } from "react";
import {
  Printer,
  ListChecks,
  Plus,
  X,
  RotateCcw,
  FileText,
  Trash2,
  Loader,
} from "lucide-react";
import http from "../../api/http";

const StatusChip = ({ text }) => {
  const map = {
    "Packing in Progress": "bg-blue-50 text-blue-700 border-blue-100",
    "PACKED": "bg-green-100 text-green-700 border-green-200",
    "PICKED": "bg-orange-50 text-orange-700 border-orange-100",
    "SHIPPED": "bg-gray-100 text-gray-700 border-gray-200",
    Closed: "bg-gray-100 text-gray-700 border-gray-200",
    Pending: "bg-orange-50 text-orange-700 border-orange-100",
    Waiting: "bg-sky-50 text-sky-700 border-sky-100",
  };
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
        map[text] || "bg-gray-50 text-gray-700 border-gray-200",
      ].join(" ")}
    >
      {text}
    </span>
  );
};

const Pill = ({ text }) => {
  const map = {
    Pending: "bg-orange-100 text-orange-700",
    Waiting: "bg-blue-100 text-blue-700",
    ALLOCATED: "bg-blue-100 text-blue-700",
    PICKED: "bg-orange-100 text-orange-700",
    Packed: "bg-green-100 text-green-700",
    SHIPPED: "bg-gray-100 text-gray-700",
  };
  return (
    <span
      className={[
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
        map[text] || "bg-gray-100 text-gray-700",
      ].join(" ")}
    >
      {text}
    </span>
  );
};

const PackOrderDetail = ({ orderId, onBack }) => {
  const [cartonType, setCartonType] = useState("Standard Medium Box");
  const [weight, setWeight] = useState("1.2");
  const [scanSku, setScanSku] = useState("");
  const [packQty, setPackQty] = useState("1");
  
  // State for API data
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartons, setCartons] = useState([]);
  const [currentCartonId, setCurrentCartonId] = useState("CTN-001");

  // Fetch order details from API
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Extract numeric ID if orderId is like "SO-00017"
        const numericId = orderId.toString().replace(/\D/g, '');
        const response = await http.get(`/sales-orders/${numericId}`);
        
        if (response.data) {
          setOrder(response.data);
          
          // Initialize cartons from packed data if any
          // This would need to be adjusted based on your actual carton data structure
          const initialCartons = [];
          // You might have a separate API for cartons or extract from order data
          setCartons(initialCartons);
        }
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError("Failed to load order details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  // Transform order data for display
  const orderInfo = useMemo(() => {
    if (!order) return null;
    
    // Calculate packed units from lines
    const totalUnits = parseFloat(order.total_ordered_units) || 0;
    const packedUnits = order.lines?.reduce(
      (sum, line) => sum + parseFloat(line.packed_qty || 0), 
      0
    ) || 0;
    
    // Determine status
    let displayStatus = order.status;
    if (order.packing_started_at && !order.packing_completed_at) {
      displayStatus = "Packing in Progress";
    }
    
    return {
      orderNo: order.order_no,
      client: order.client?.client_name || `Client #${order.client_id}`,
      shipTo: `${order.ship_to_city || ''}, ${order.ship_to_state || ''}`.replace(/^, |, $/g, '') || 'Address not available',
      lines: order.total_lines || 0,
      units: totalUnits,
      packed: packedUnits,
      status: displayStatus,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      shipToAddress: `${order.ship_to_address_line1 || ''} ${order.ship_to_address_line2 || ''}`.trim(),
      shipToPhone: order.ship_to_phone,
      referenceNo: order.reference_no,
      carrier: order.carrier,
      trackingNumber: order.tracking_number,
      specialInstructions: order.special_instructions,
      notes: order.notes,
    };
  }, [order]);

  // Transform line items
  const items = useMemo(() => {
    if (!order?.lines) return [];
    
    return order.lines.map((line, index) => ({
      id: line.id || index,
      sku: line.sku?.sku_code || `SKU-${line.sku_id}`,
      name: line.sku?.sku_name || 'Product',
      picked: parseFloat(line.picked_qty) || 0,
      remaining: (parseFloat(line.ordered_qty) - parseFloat(line.packed_qty)) || 0,
      status: line.status || 'PENDING',
      orderedQty: parseFloat(line.ordered_qty) || 0,
      packedQty: parseFloat(line.packed_qty) || 0,
    }));
  }, [order]);

  const cartonTypes = useMemo(
    () => [
      "Standard Small Box",
      "Standard Medium Box",
      "Standard Large Box",
      "Custom Box",
    ],
    [],
  );

  // Mock carton contents - replace with actual carton data from API
  const cartonContents = useMemo(
    () => [
      { id: 1, item: `${items[0]?.sku || 'SKU'} - ${items[0]?.name || 'Item'}`, qty: items[0]?.packedQty || 0 },
    ],
    [items],
  );

  const handleAddToCarton = () => {
    // TODO: integrate API to add item to carton
    console.log(`Added ${packQty} of ${scanSku} to carton`);
    // Reset form
    setScanSku("");
    setPackQty("1");
  };

  const handlePrintPackingSlip = () => {
    // TODO: integrate API to generate/print packing slip
    console.log("Print packing slip for order:", orderId);
  };

  const handleViewPickList = () => {
    // TODO: navigate to pick list view or open modal
    console.log("View pick list for order:", orderId);
  };

  const handleFinalizePacking = async () => {
    try {
      // TODO: integrate API to mark order as packed
      // await http.post(`/sales-orders/${orderId}/packing-complete`, {
      //   cartons: cartons,
      //   weight: weight,
      // });
      console.log("Finalizing packing for order:", orderId);
      // Navigate back after success
      onBack?.();
    } catch (err) {
      console.error("Error finalizing packing:", err);
      setError("Failed to finalize packing. Please try again.");
    }
  };

  const handleSaveProgress = async () => {
    // TODO: integrate API to save packing progress
    console.log("Saving packing progress for order:", orderId);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F7FE] p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !orderInfo) {
    return (
      <div className="min-h-screen bg-[#F3F7FE] p-6 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-sm">
          <p className="text-red-600 mb-4">{error || "Order not found"}</p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F7FE] p-6">
      <div className="mx-auto 2xl:max-w-[1900px] space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs text-gray-500">
              <span 
                onClick={onBack}
                className="hover:text-gray-700 cursor-pointer"
              >
                Packing
              </span>{" "}
              <span className="mx-1">›</span>
              <span className="hover:text-gray-700 cursor-pointer">
                Pack Order
              </span>{" "}
              <span className="mx-1">›</span>
              <span className="font-semibold text-gray-700">Detail</span>
            </div>
            <div className="text-2xl font-semibold text-gray-900">
              Pack Order {orderInfo.orderNo}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <StatusChip text={orderInfo.status} />
            <button 
              onClick={handleSaveProgress}
              className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Save Progress
            </button>
            <button 
              onClick={handleFinalizePacking}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              Finalize Packing
            </button>
            {onBack && (
              <button
                onClick={onBack}
                className="ml-2 rounded-md border border-gray-200 bg-white p-2 text-gray-600 hover:bg-gray-50"
                title="Back"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Top info card */}
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-center">
            {/* Left order meta */}
            <div className="lg:col-span-6">
              <div className="text-lg font-semibold text-gray-900">
                {orderInfo.orderNo}
              </div>
              <div className="text-sm text-gray-700">{orderInfo.client}</div>
              <div className="text-sm text-gray-500">
                Ship to: {orderInfo.shipTo}
              </div>
              {orderInfo.customerName && (
                <div className="text-sm text-gray-500 mt-1">
                  Customer: {orderInfo.customerName}
                </div>
              )}
            </div>

            {/* Middle stats */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-6">
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase">
                  LINES/UNITS
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {orderInfo.lines} <span className="text-gray-400">/</span>{" "}
                  {orderInfo.units}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase">
                  PACKED
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  <span className="text-blue-600">{orderInfo.packed}</span>{" "}
                  <span className="text-gray-400">/</span> {orderInfo.units}
                </div>
              </div>
            </div>

            {/* Right actions */}
            <div className="lg:col-span-2 flex flex-col gap-2 lg:items-end">
              <button 
                onClick={handlePrintPackingSlip}
                className="w-full lg:w-[220px] rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-100"
              >
                <Printer size={16} />
                Print Packing Slip
              </button>
              <button 
                onClick={handleViewPickList}
                className="w-full lg:w-[220px] rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-100"
              >
                <ListChecks size={16} />
                View Pick List
              </button>
            </div>
          </div>

          {/* Additional info if available */}
          {(orderInfo.referenceNo || orderInfo.carrier) && (
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              {orderInfo.referenceNo && (
                <div>
                  <span className="text-gray-500">Reference: </span>
                  <span className="text-gray-900">{orderInfo.referenceNo}</span>
                </div>
              )}
              {orderInfo.carrier && (
                <div>
                  <span className="text-gray-500">Carrier: </span>
                  <span className="text-gray-900">{orderInfo.carrier}</span>
                </div>
              )}
              {orderInfo.trackingNumber && (
                <div>
                  <span className="text-gray-500">Tracking: </span>
                  <span className="text-gray-900">{orderInfo.trackingNumber}</span>
                </div>
              )}
            </div>
          )}

          {/* Special instructions if any */}
          {orderInfo.specialInstructions && (
            <div className="mt-2 text-sm">
              <span className="text-gray-500">Special Instructions: </span>
              <span className="text-gray-900">{orderInfo.specialInstructions}</span>
            </div>
          )}
        </div>

        {/* 3-column layout - rest of your UI remains the same */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Left: Items to Pack */}
          <div className="lg:col-span-4 rounded-lg border border-gray-200 bg-white">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div className="text-sm font-semibold text-gray-900">
                Items to Pack
              </div>
              <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {items.length} Lines
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs font-semibold text-gray-500">
                  <tr>
                    <th className="px-5 py-3 text-left">SKU</th>
                    <th className="px-5 py-3 text-left">Ordered</th>
                    <th className="px-5 py-3 text-left">Picked</th>
                    <th className="px-5 py-3 text-left">Rem.</th>
                    <th className="px-5 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((it) => (
                    <tr key={it.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <div className="font-semibold text-gray-900">
                          {it.sku}
                        </div>
                        <div className="text-xs text-gray-500">{it.name}</div>
                      </td>
                      <td className="px-5 py-4 text-gray-900">{it.orderedQty}</td>
                      <td className="px-5 py-4 text-gray-900">{it.picked}</td>
                      <td className="px-5 py-4 text-gray-900">
                        {it.remaining}
                      </td>
                      <td className="px-5 py-4">
                        <Pill text={it.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Middle: Current Carton */}
          <div className="lg:col-span-5 rounded-lg border border-gray-200 bg-white">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div className="text-sm font-semibold text-gray-900">
                Current Carton:{" "}
                <span className="text-blue-600 font-semibold">{currentCartonId}</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">
                  New
                </button>
                <button className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700">
                  Close
                </button>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-semibold text-gray-500 mb-2">
                    Carton Type
                  </div>
                  <select
                    value={cartonType}
                    onChange={(e) => setCartonType(e.target.value)}
                    className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {cartonTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="text-xs font-semibold text-gray-500 mb-2">
                    Weight (kg)
                  </div>
                  <input
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1.2"
                  />
                </div>
              </div>

              {/* Pack Item (blue section) */}
              <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 space-y-3">
                <div className="text-sm font-semibold text-gray-900">
                  Pack Item
                </div>

                <div>
                  <div className="text-xs font-semibold text-gray-500 mb-2">
                    Scan SKU
                  </div>
                  <div className="relative">
                    <input
                      value={scanSku}
                      onChange={(e) => setScanSku(e.target.value)}
                      className="w-full rounded-md border border-blue-200 bg-white px-3 py-2 pr-12 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Click to scan..."
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-2 rounded-md border border-blue-200 bg-white p-1.5 text-gray-600 hover:bg-gray-50"
                      title="Scan"
                    >
                      <RotateCcw size={16} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-3 items-end">
                  <div className="col-span-4">
                    <div className="text-xs font-semibold text-gray-500 mb-2">
                      Pack Qty
                    </div>
                    <input
                      type="number"
                      min={1}
                      max={items.find(i => i.sku === scanSku)?.remaining || 1}
                      value={packQty}
                      onChange={(e) => setPackQty(e.target.value)}
                      className="w-full rounded-md border border-blue-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="1"
                    />
                  </div>
                  <div className="col-span-8">
                    <button
                      onClick={handleAddToCarton}
                      className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white flex items-center justify-center gap-2 hover:bg-blue-700"
                    >
                      <Plus size={16} />
                      Add to Carton
                    </button>
                  </div>
                </div>
              </div>

              {/* Carton Contents */}
              <div className="space-y-2">
                <div className="text-sm font-semibold text-gray-900">
                  Carton Contents
                </div>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-xs font-semibold text-gray-500">
                      <tr>
                        <th className="px-4 py-3 text-left">Item</th>
                        <th className="px-4 py-3 text-left">Qty</th>
                        <th className="px-4 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {cartonContents.map((c) => (
                        <tr key={c.id}>
                          <td className="px-4 py-3 text-gray-900">{c.item}</td>
                          <td className="px-4 py-3 text-gray-900">{c.qty}</td>
                          <td className="px-4 py-3 text-right">
                            <button className="inline-flex items-center justify-center rounded-md p-2 text-red-500 hover:bg-red-50">
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Carton actions + checklist */}
          <div className="lg:col-span-3 space-y-4">
            <div className="rounded-lg border border-gray-200 bg-white p-5">
              <div className="text-sm font-semibold text-gray-900 mb-3">
                Carton Actions
              </div>

              <div className="space-y-2">
                <button className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 flex items-center gap-2 hover:bg-gray-100">
                  <Printer size={16} />
                  Print Carton Label
                </button>
                <button className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 flex items-center gap-2 hover:bg-gray-100">
                  <Printer size={16} />
                  Reprint Label
                </button>
                <button className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 flex items-center gap-2 hover:bg-gray-100">
                  <FileText size={16} />
                  Add Note
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-5">
              <div className="text-sm font-semibold text-gray-900 mb-3">
                Completion Checklist
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">All items packed</span>
                  <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${
                    orderInfo.packed >= orderInfo.units 
                      ? 'bg-green-100 text-green-600' 
                      : 'border border-gray-200 text-gray-500'
                  }`}>
                    {orderInfo.packed >= orderInfo.units ? '✓' : <X size={14} />}
                  </span>
                </div>
                <div className="h-px bg-gray-100" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">All cartons closed</span>
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500">
                    <X size={14} />
                  </span>
                </div>
                <div className="h-px bg-gray-100" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">Labels generated</span>
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500">
                    <X size={14} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back link */}
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            ← Back to Packing
          </button>
        )}
      </div>
    </div>
  );
};

export default PackOrderDetail;