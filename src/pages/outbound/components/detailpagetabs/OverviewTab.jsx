// tabs/OverviewTab.jsx
import KeyValueCard from "../../../inbound/components/asndetails/KeyValueCard";
import ShipmentJourney from "../../../inbound/components/asndetails/ShipmentJourney";

const steps = [
  { no: 1, label: "Created", sub: "Oct 24, 10:00", state: "done" },
  { no: 2, label: "Confirmed", sub: "Oct 24, 10:05", state: "done" },
  { no: 3, label: "Allocating", sub: "In Progress", state: "active" },
  { no: 4, label: "Picking", sub: "", state: "todo" },
  { no: 5, label: "Packing", sub: "", state: "todo" },
  { no: 6, label: "Shipped", sub: "", state: "todo" },
];

// Map to ShipmentJourney format
const journeySteps = steps.map((s) => ({
  label: s.label,
  time: s.sub || "Pending",
  state: s.state, // "done" | "active" | "todo"
}));

const OverviewTab = ({ onEditShipTo, onEditShipping }) => {
  return (
    <div className="space-y-6">
      <ShipmentJourney steps={journeySteps} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <KeyValueCard
          title="Ship-to Details"
          onEdit={onEditShipTo}
          items={[
            { label: "Company Name", value: "Tech Retailers Inc." },
            { label: "Contact", value: "John Doe (+1 555-0123)" },
            {
              label: "Address",
              value: "123 Commerce Blvd, Suite 400\nNew York, NY, 10001",
            },
            {
              label: "Instructions",
              value: "Deliver to rear dock. Call security upon arrival.",
            },
          ]}
        />

        <KeyValueCard
          title="Shipping & Carrier"
          onEdit={onEditShipping}
          items={[
            {
              label: "Carrier Service",
              value: "FedEx Express (Client Account)",
            },
            { label: "Service Level", value: "Overnight / Priority" },
            { label: "Packaging", value: "Standard Carton" },
            { label: "Tracking No", value: "Pending Generation" },
          ]}
        />
      </div>
    </div>
  );
};

export default OverviewTab;
