import { useEffect, useRef, useState, useMemo } from "react";
import http from "@/api/http";
import FormPage from "@/pages/components/forms/FormPage";
import { useToast } from "@/pages/components/toast/ToastProvider";
import { getWarehouses } from "../../inbound/components/api/masters.api";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const CreatePickWavePage = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [waveType, setWaveType] = useState("MANUAL");
  const [waveStrategy, setWaveStrategy] = useState("BATCH");
  const [priority, setPriority] = useState("NORMAL");
  const [carrier, setCarrier] = useState("");
  const [carrierCutoffTime, setCarrierCutoffTime] = useState("");
  const [zoneFilter, setZoneFilter] = useState("");
  const [notes, setNotes] = useState("");

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  // Validation errors
  const [errors, setErrors] = useState({
    warehouse: "",
    orders: "",
    carrierCutoffTime: "",
  });

  // Fetch warehouses
  useEffect(() => {
    const fetchWarehouses = async () => {
      const data = await getWarehouses();
      setWarehouses(data);
    };
    fetchWarehouses();
  }, []);

  // Fetch eligible orders for selected warehouse
  useEffect(() => {
    if (!selectedWarehouse) {
      setOrders([]);
      setSelectedOrders([]);
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await http.get(
          `/pick-waves/eligible-orders?warehouse_id=${selectedWarehouse}`,
        );
        setOrders(res.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch orders");
      }
    };

    fetchOrders();
    setSelectedOrders([]);
  }, [selectedWarehouse, toast]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOrders = useMemo(
    () =>
      orders.filter(
        (o) =>
          o.order_no.toLowerCase().includes(search.toLowerCase()) ||
          o.customer_name.toLowerCase().includes(search.toLowerCase()),
      ),
    [orders, search],
  );

  const selectedOrderIds = selectedOrders.map((o) => o.id);

  const inputClasses =
    "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";
  const errorClasses = "text-xs text-red-500 mt-1";

  // Validate required fields
  const validateForm = () => {
    const newErrors = { warehouse: "", orders: "", carrierCutoffTime: "" };
    let valid = true;

    if (!selectedWarehouse) {
      newErrors.warehouse = "Warehouse is required";
      valid = false;
    }

    if (!selectedOrders.length) {
      newErrors.orders = "Please select at least one order";
      valid = false;
    }

    if (!carrierCutoffTime) {
      newErrors.carrierCutoffTime = "Carrier Cutoff Time is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const createPickWave = async () => {
    if (!validateForm()) return; // stop if invalid

    try {
      const payload = {
        warehouse_id: Number(selectedWarehouse),
        order_ids: selectedOrders.map((o) => Number(o.id)),
        wave_type: waveType,
        wave_strategy: waveStrategy,
        priority,
        carrier,
        carrier_cutoff_time: carrierCutoffTime,
        zone_filter: zoneFilter,
        notes,
      };

      const res = await http.post("/pick-waves/", payload);
      console.log(res);
      toast.success(res.data.message);
      navigate("/picking");
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to create pick wave",
      );
    }
  };

  return (
    <FormPage
      title="Create Pick Wave"
      breadcrumbs={[
        { label: "Pick Waves", to: "/picking" },
        { label: "Create Pick Wave" },
      ]}
      topActions={
        <>
          <button
            onClick={() => navigate("/picking")}
            className="px-4 py-2 border rounded-md text-sm bg-white"
          >
            Cancel
          </button>
          <button
            onClick={createPickWave}
            className="px-4 py-2 rounded-md text-sm bg-primary text-white"
          >
            Create Pick Wave
          </button>
        </>
      }
      bottomRight={
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setSelectedOrders([]);
              setSelectedWarehouse("");
              setCarrier("");
              setCarrierCutoffTime("");
              setZoneFilter("");
              setNotes("");
              setWaveType("MANUAL");
              setWaveStrategy("BATCH");
              setPriority("NORMAL");
              setErrors({ warehouse: "", orders: "", carrierCutoffTime: "" });
            }}
            className="px-6 py-2.5 rounded-md border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            onClick={createPickWave}
            className="px-6 py-2.5 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700"
          >
            Create Pick Wave
          </button>
        </div>
      }
    >
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">
        {/* Warehouse & Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className={labelClasses}>
              Warehouse <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedWarehouse}
              onChange={(e) => {
                setSelectedWarehouse(e.target.value);
                if (errors.warehouse)
                  setErrors((prev) => ({ ...prev, warehouse: "" }));
              }}
              className={inputClasses}
            >
              <option value="">Select Warehouse</option>
              {warehouses.map((wh) => (
                <option key={wh.id} value={wh.id}>
                  {wh.warehouse_name}
                </option>
              ))}
            </select>
            {errors.warehouse && (
              <div className={errorClasses}>{errors.warehouse}</div>
            )}
          </div>

          <div>
            <label className={labelClasses}>Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className={inputClasses}
            >
              <option value="NORMAL">Normal</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
        </div>

        {/* Orders Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <label className={labelClasses}>
            Orders <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            disabled={!selectedWarehouse}
            onClick={() => setDropdownOpen((s) => !s)}
            className={`${inputClasses} flex justify-between items-center`}
          >
            <span>
              {selectedOrders.length
                ? `${selectedOrders.length} selected`
                : selectedWarehouse
                  ? "Select orders"
                  : "Select warehouse first"}
            </span>
            {dropdownOpen ? <FiChevronUp /> : <FiChevronDown />}
          </button>

          {dropdownOpen && selectedWarehouse && (
            <div className="absolute left-1/2 transform -translate-x-1/2 z-50 mt-2 w-80 max-h-56 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-xl">
              <div className="p-2 border-b border-gray-100">
                <input
                  type="text"
                  placeholder="Search orders…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={inputClasses}
                />
              </div>

              {filteredOrders.length === 0 ? (
                <div className="px-3 py-3 text-sm text-gray-500">
                  No orders found
                </div>
              ) : (
                filteredOrders.map((o) => {
                  const selected = selectedOrderIds.includes(o.id);
                  return (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => {
                        setSelectedOrders((prev) => {
                          if (prev.find((x) => x.id === o.id)) return prev;
                          if (errors.orders)
                            setErrors((prev) => ({ ...prev, orders: "" }));
                          return [...prev, o];
                        });
                      }}
                      className={`w-full px-3 py-2 text-left hover:bg-gray-50 ${
                        selected ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="text-sm font-medium text-gray-900">
                        {o.order_no}
                      </div>
                      <div className="text-xs text-gray-500">
                        {o.customer_name}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          )}

          {/* Selected Orders Tags */}
          {selectedOrders.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedOrders.map((o) => (
                <span
                  key={o.id}
                  className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                >
                  {o.order_no}
                  <button
                    onClick={() =>
                      setSelectedOrders((prev) =>
                        prev.filter((x) => x.id !== o.id),
                      )
                    }
                    className="hover:text-blue-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          {errors.orders && <div className={errorClasses}>{errors.orders}</div>}
        </div>

        {/* Wave & Carrier */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className={labelClasses}>Wave Type</label>
            <select
              value={waveType}
              onChange={(e) => setWaveType(e.target.value)}
              className={inputClasses}
            >
              <option value="MANUAL">Manual</option>
              <option value="TIME_BASED">Time Based</option>
              <option value="CARRIER_BASED">Carrier Based</option>
              <option value="ZONE_BASED">Zone Based</option>
              <option value="PRIORITY_BASED">Priority Based</option>
            </select>
          </div>

          <div>
            <label className={labelClasses}>Wave Strategy</label>
            <select
              value={waveStrategy}
              onChange={(e) => setWaveStrategy(e.target.value)}
              className={inputClasses}
            >
              <option value="BATCH">Batch</option>
              <option value="ZONE_PICKING">Zone Picking</option>
              <option value="CLUSTER_PICKING">Cluster Picking</option>
              <option value="WAVE_PICKING">Wave Picking</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className={labelClasses}>Carrier</label>
            <input
              type="text"
              value={carrier}
              onChange={(e) => setCarrier(e.target.value)}
              placeholder="Enter carrier name"
              className={inputClasses}
            />
          </div>
          <div>
            <label className={labelClasses}>
              Carrier Cutoff Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              value={carrierCutoffTime}
              onChange={(e) => {
                setCarrierCutoffTime(e.target.value);
                if (errors.carrierCutoffTime)
                  setErrors((prev) => ({ ...prev, carrierCutoffTime: "" }));
              }}
              className={inputClasses}
            />
            {errors.carrierCutoffTime && (
              <div className={errorClasses}>{errors.carrierCutoffTime}</div>
            )}
          </div>
        </div>

        <div>
          <label className={labelClasses}>Zone Filter</label>
          <input
            type="text"
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            placeholder="Enter zone filter"
            className={inputClasses}
          />
        </div>

        <div>
          <label className={labelClasses}>Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes"
            rows={4}
            className={inputClasses}
          />
        </div>
      </div>
    </FormPage>
  );
};

export default CreatePickWavePage;
