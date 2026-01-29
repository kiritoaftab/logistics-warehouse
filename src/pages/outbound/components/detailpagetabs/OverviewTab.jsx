// tabs/OverviewTab.jsx
import React from "react";
import KeyValueCard from "../../../inbound/components/asndetails/KeyValueCard";
import OrderProgress from "./OrderProgress";

const OverviewTab = ({ onEditShipTo, onEditShipping }) => {
  return (
    <div className="space-y-6">
      <OrderProgress />

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
