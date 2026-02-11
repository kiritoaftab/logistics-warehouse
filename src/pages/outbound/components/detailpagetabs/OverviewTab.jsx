// tabs/OverviewTab.jsx
import KeyValueCard from "../../../inbound/components/asndetails/KeyValueCard";
import ShipmentJourney from "../../../inbound/components/asndetails/ShipmentJourney";

const OverviewTab = ({ order, onEditShipTo, onEditShipping }) => {
  // Create shipment journey steps based on order status
  const getJourneySteps = () => {
    const steps = [
      { 
        label: "Created", 
        time: order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }) : "Pending",
        state: "done" 
      },
      { 
        label: "Confirmed", 
        time: order.confirmed_at ? new Date(order.confirmed_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }) : "Pending",
        state: order.confirmed_at ? "done" : "todo" 
      },
      { 
        label: "Allocated", 
        time: order.allocated_at ? new Date(order.allocated_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }) : "Pending",
        state: order.allocated_at ? "done" : "todo" 
      },
      { 
        label: "Picked", 
        time: order.picking_completed_at ? new Date(order.picking_completed_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }) : "Pending",
        state: order.picking_completed_at ? "done" : 
               order.picking_started_at ? "active" : "todo" 
      },
      { 
        label: "Packed", 
        time: order.packing_completed_at ? new Date(order.packing_completed_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }) : "Pending",
        state: order.packing_completed_at ? "done" : 
               order.packing_started_at ? "active" : "todo" 
      },
      { 
        label: "Shipped", 
        time: order.shipped_at ? new Date(order.shipped_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }) : "Pending",
        state: order.shipped_at ? "done" : "todo" 
      },
    ];
    return steps;
  };

  return (
    <div className="space-y-6">
      <ShipmentJourney steps={getJourneySteps()} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <KeyValueCard
          title="Ship-to Details"
          onEdit={onEditShipTo}
          items={[
            { label: "Name", value: order.ship_to_name },
            { label: "Contact", value: `${order.customer_name} (${order.customer_phone})` },
            {
              label: "Address",
              value: `${order.ship_to_address_line1}\n${order.ship_to_address_line2 || ''}\n${order.ship_to_city}, ${order.ship_to_state} ${order.ship_to_pincode}\n${order.ship_to_country}`
            },
            {
              label: "Special Instructions",
              value: order.special_instructions || "No special instructions"
            },
          ]}
        />

        <KeyValueCard
          title="Shipping & Carrier"
          onEdit={onEditShipping}
          items={[
            {
              label: "Carrier",
              value: order.carrier || "Not assigned"
            },
            { label: "Service Level", value: order.carrier_service || "Standard" },
            { label: "Tracking Number", value: order.tracking_number || "Pending" },
            { label: "Reference No", value: order.reference_no || "—" },
          ]}
        />
      </div>
    </div>
  );
};

export default OverviewTab;