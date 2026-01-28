import { ArrowLeft, Printer, PlayCircle } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { use, useMemo } from "react";
import AsnMetaBar from "./components/asndetails/AsnMetaBar";
import ShipmentJourney from "./components/asndetails/ShipmentJourney";
import KeyValueCard from "./components/asndetails/KeyValueCard";
import QuantitySummary from "./components/asndetails/QuantitySummary";
import { useNavigate } from "react-router-dom";

const AsnDetail = () => {
  const asnNo = "ASN-10293";
  const navigate = useNavigate();
  const breadcrumbs = useMemo(
    () => [{ label: "Inbound", to: "/inbound" }, { label: "ASN Detail" }],
    [],
  );

  const journeySteps = useMemo(
    () => [
      { label: "Created", state: "done", time: "Oct 24, 09:00" },
      { label: "Confirmed", state: "done", time: "Oct 24, 10:30" },
      { label: "In Receiving", state: "active", time: "Today, 08:45" },
      { label: "GRN Posted", state: "todo", time: "" },
      { label: "Putaway", state: "todo", time: "" },
      { label: "Closed", state: "todo", time: "" },
    ],
    [],
  );

  return (
    <div className="max-w-full">
      <PageHeader
        breadcrumbs={breadcrumbs}
        title={asnNo}
        actions={
          <>
            <button
              onClick={() => navigate("/inbound")}
              className="px-4 py-2 border rounded-md text-sm bg-white flex items-center gap-2"
            >
              <ArrowLeft size={16} /> Back to List
            </button>
            <button className="px-4 py-2 border rounded-md text-sm bg-white text-red-600 border-red-200">
              Cancel ASN
            </button>
            <button className="px-4 py-2 border rounded-md text-sm bg-white flex items-center gap-2">
              <Printer size={16} /> Print ASN
            </button>
            <button className="px-4 py-2 rounded-md text-sm bg-blue-600 text-white flex items-center gap-2">
              <PlayCircle size={16} /> Start Receiving
            </button>
          </>
        }
      />

      {/* Meta Bar */}
      <AsnMetaBar
        status="In Receiving"
        client="Acme Corp"
        supplier="Global Supplies Ltd"
        eta="Today, 08:30 AM"
        dock="D-04"
        progressText="450 / 1,200 Units"
        rightLinks={[
          {
            label: "Open Receiving ↗",
            onClick: () => console.log("open receiving"),
          },
          {
            label: "Putaway Tasks →",
            onClick: () => console.log("putaway tasks"),
          },
        ]}
      />

      <div className="mt-6 space-y-6">
        {/* Shipment Journey */}
        <ShipmentJourney steps={journeySteps} />

        {/* Bottom 2 cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7 h-full">
            <KeyValueCard
              title="Party & Shipment Info"
              onEdit={() => console.log("edit")}
              items={[
                { label: "Client", value: "Acme Corp" },
                { label: "Supplier", value: "Global Supplies Ltd" },
                { label: "Reference No", value: "PO-99283-A" },
                { label: "Carrier / Vehicle", value: "FedEx / NY-8829" },
                { label: "Driver Name", value: "Mike Johnson" },
                { label: "Dock Door", value: "D-04" },
                { label: "Notes", value: "Handle with care, electronics..." },
              ]}
            />
          </div>

          <div className="lg:col-span-5 h-full">
            <QuantitySummary
              expectedUnits={1200}
              receivedUnits={450}
              damagedUnits={0}
              shortageUnits={50}
              expectedLines={15}
              completionPercent={37}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsnDetail;
