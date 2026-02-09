// LocationDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import http from "@/api/http";
import { useToast } from "@/pages/components/toast/ToastProvider";
import StatusPill from "../../StatusPill";
import { ArrowLeft, Package, Maximize2, Home } from "lucide-react";
import CusTable from "@/pages/components/CusTable";

export default function LocationDetailPage() {
  const { locationId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [locationDetails, setLocationDetails] = useState(null);
  const [inventoryData, setInventoryData] = useState([]);
  const [palletCount, setPalletCount] = useState(0);
  const [locationInfo, setLocationInfo] = useState(null);

  useEffect(() => {
    if (locationId) {
      fetchAllData();
    }
  }, [locationId]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchLocationDetails(),
        fetchLocationInventory()
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load location details");
    } finally {
      setLoading(false);
    }
  };

  const fetchLocationDetails = async () => {
    try {
      const res = await http.get(`/locations/${locationId}`);
      if (res.data?.success) {
        const data = res.data.data;
        setLocationDetails(data.location || data);
        setInventoryData(data.inventory || []);
        setPalletCount(data.pallet_count || 0);
      }
    } catch (error) {
      console.error("Error fetching location details:", error);
      toast.error("Failed to load location details");
    }
  };

  const fetchLocationInventory = async () => {
    try {
      const res = await http.get(`/inventory/location/${locationId}`);
      if (res.data?.success) {
        const data = res.data.data;
        setInventoryData(data.inventory || []);
        setLocationInfo(data.location_info);
      }
    } catch (error) {
      console.error("Error fetching location inventory:", error);
      // Don't show toast for this, as we might already have data from location details
    }
  };

  const handleBack = () => {
    navigate(".."); // Go back to previous page
  };

  // Define columns for the inventory table
  const inventoryColumns = [
    {
      key: "sku",
      title: "SKU Details",
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
            <Package size={20} className="text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {item.sku?.sku_code || "N/A"}
            </div>
            <div className="text-sm text-gray-500">{item.sku?.sku_name || "N/A"}</div>
            <div className="text-xs text-gray-400">
              {item.sku?.category || "N/A"} • {item.sku?.uom || "N/A"}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "client",
      title: "Client",
      render: (item) => (
        <div>
          <div className="font-medium">{item.client?.client_name || "N/A"}</div>
          <div className="text-xs text-gray-500">{item.client?.client_code || ""}</div>
        </div>
      ),
    },
    {
      key: "batch_no",
      title: "Batch",
      render: (item) => (
        <span className="font-medium">{item.batch_no || "-"}</span>
      ),
    },
    {
      key: "on_hand_qty",
      title: "On Hand",
      render: (item) => (
        <span className="font-medium">{item.on_hand_qty}</span>
      ),
    },
    {
      key: "available_qty",
      title: "Available",
      render: (item) => (
        <span className="font-medium text-green-600">{item.available_qty}</span>
      ),
    },
    {
      key: "hold_qty",
      title: "Hold",
      render: (item) => (
        <span className="font-medium text-orange-600">{item.hold_qty}</span>
      ),
    },
    {
      key: "allocated_qty",
      title: "Allocated",
      render: (item) => (
        <span className="font-medium text-blue-600">{item.allocated_qty}</span>
      ),
    },
    {
      key: "damaged_qty",
      title: "Damaged",
      render: (item) => (
        <span className="font-medium text-red-600">{item.damaged_qty}</span>
      ),
    },
    {
      key: "status",
      title: "Status",
      render: (item) => <StatusPill text={item.status} />,
    },
  ];

  // Calculate inventory totals
  const totals = inventoryData.reduce(
    (acc, item) => ({
      onHand: acc.onHand + (Number(item.on_hand_qty) || 0),
      available: acc.available + (Number(item.available_qty) || 0),
      hold: acc.hold + (Number(item.hold_qty) || 0),
      allocated: acc.allocated + (Number(item.allocated_qty) || 0),
      damaged: acc.damaged + (Number(item.damaged_qty) || 0),
    }),
    { onHand: 0, available: 0, hold: 0, allocated: 0, damaged: 0 }
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-gray-500">Loading location details...</div>
        </div>
      </div>
    );
  }

  if (!locationDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="text-gray-500 mb-4">Location not found</div>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Inventory
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* SKU Details - Full width on mobile, left on desktop */}
            <div className="order-2 sm:order-1 flex-1 min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
                {locationDetails.location_code}
                <span className="text-gray-600 ml-2 font-normal truncate">
                  • Zone {locationDetails.zone}
                </span>
              </h1>
              <p className="text-gray-500 text-xs sm:text-sm mt-1 truncate">
                Location ID: {locationId} • Type: {locationDetails.location_type} • 
                Warehouse: {locationDetails.warehouse?.warehouse_name}
              </p>
            </div>

            {/* Back Button - Top right on mobile, right on desktop */}
            <div className="order-1 sm:order-2 self-end sm:self-auto">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 whitespace-nowrap"
              >
                <ArrowLeft size={20} />
                <span className="hidden sm:inline">Back to Inventory</span>
                <span className="sm:hidden text-sm">Back</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Location Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Basic Info */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Home size={20} />
              Location Details
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500 block mb-1">Location Code</label>
                  <p className="font-medium text-lg">{locationDetails.location_code}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-1">Zone</label>
                  <p className="font-medium">Zone {locationDetails.zone}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500 block mb-1">Aisle</label>
                  <p className="font-medium">{locationDetails.aisle}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-1">Rack</label>
                  <p className="font-medium">{locationDetails.rack}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500 block mb-1">Level</label>
                  <p className="font-medium">{locationDetails.level}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-1">Location Type</label>
                  <p className="font-medium">{locationDetails.location_type}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-gray-500 block mb-1">Warehouse</label>
                <div>
                  <p className="font-medium">{locationDetails.warehouse?.warehouse_name}</p>
                  <p className="text-sm text-gray-500">{locationDetails.warehouse?.warehouse_code}</p>
                  <p className="text-sm text-gray-500">{locationDetails.warehouse?.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Capacity & Status */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Maximize2 size={20} />
              Capacity & Status
            </h2>
            <div className="space-y-6">
              {/* Capacity Information */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500 block mb-1">Capacity</label>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-lg">
                      {locationDetails.capacity?.toLocaleString() || "N/A"}
                    </span>
                    <span className="text-sm text-gray-500">units</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-gray-500 block mb-1">Current Usage</label>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-lg">
                      {locationDetails.current_usage?.toLocaleString() || "0"}
                    </span>
                    <span className="text-sm text-gray-500">units</span>
                  </div>
                </div>
                
                {locationDetails.available_capacity !== undefined && (
                  <div>
                    <label className="text-sm text-gray-500 block mb-1">Available Capacity</label>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-lg text-green-600">
                        {locationDetails.available_capacity.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500">units</span>
                    </div>
                  </div>
                )}
                
                {locationDetails.utilization_percent !== undefined && (
                  <div>
                    <label className="text-sm text-gray-500 block mb-1">Utilization</label>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-lg">
                        {locationDetails.utilization_percent}%
                      </span>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${Math.min(locationDetails.utilization_percent, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Status Badges */}
              <div>
                <label className="text-sm text-gray-500 block mb-2">Status</label>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs ${locationDetails.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {locationDetails.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs ${locationDetails.is_pickable ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                    {locationDetails.is_pickable ? 'Pickable' : 'Non-Pickable'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs ${locationDetails.is_putawayable ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                    {locationDetails.is_putawayable ? 'Putawayable' : 'Non-Putawayable'}
                  </span>
                </div>
              </div>
              
              {/* Pallet Information */}
              {palletCount > 0 && (
                <div>
                  <label className="text-sm text-gray-500 block mb-1">Pallets</label>
                  <p className="font-medium">{palletCount} pallet{palletCount !== 1 ? 's' : ''} in location</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Inventory Summary */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-500">Total SKUs</div>
            <div className="text-2xl font-bold mt-1">{inventoryData.length}</div>
          </div>
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-500">On Hand</div>
            <div className="text-2xl font-bold mt-1">{totals.onHand.toLocaleString()}</div>
          </div>
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-500">Available</div>
            <div className="text-2xl font-bold mt-1 text-green-600">{totals.available.toLocaleString()}</div>
          </div>
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-500">On Hold</div>
            <div className="text-2xl font-bold mt-1 text-orange-600">{totals.hold.toLocaleString()}</div>
          </div>
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-500">Allocated</div>
            <div className="text-2xl font-bold mt-1 text-blue-600">{totals.allocated.toLocaleString()}</div>
          </div>
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-500">Damaged</div>
            <div className="text-2xl font-bold mt-1 text-red-600">{totals.damaged.toLocaleString()}</div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Inventory</h2>
                <p className="text-gray-600 mt-1">
                  Showing {inventoryData.length} item{inventoryData.length !== 1 ? 's' : ''} in this location
                </p>
              </div>
              <button
                onClick={fetchAllData}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm"
              >
                Refresh Data
              </button>
            </div>
          </div>

          {inventoryData.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-2">No inventory found in this location</div>
              <div className="text-sm text-gray-500">
                This location is empty or inventory hasn't been assigned yet.
              </div>
            </div>
          ) : (
            <CusTable columns={inventoryColumns} data={inventoryData} />
          )}
        </div>
      </div>
    </div>
  );
}