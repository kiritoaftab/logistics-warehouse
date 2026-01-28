import Dashboard from "../dashboard/Dashboard";
import Putaway from "../putaway/Putaway";
import PutawayDetails from "../putaway/PutawayDetails";
import CreateASN from "../inbound/CreateASN";
import InboundASN from "../inbound/InboundASN";
import AsnDetail from "../inbound/AsnDetail";
import AsnReceiving from "../inbound/AsnReceiving";

const NewRoutes = [
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/putaway", element: <Putaway /> },
  { path: "/putawaydetails", element: <PutawayDetails /> },
  { path: "/inbound", element: <InboundASN /> },
  { path: "/createASN", element: <CreateASN /> },
  { path: "/ASNdetails", element: <AsnDetail /> },
  { path: "/ASNreceive", element: <AsnReceiving /> },
];

export default NewRoutes;
