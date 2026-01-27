import Dashboard from "../dashboard/Dashboard";
import Putaway from "../putaway/Putaway";
import PutawayDetails from "../putaway/PutawayDetails";
import CreateASN from "../inbound/CreateASN";
import InboundASN from "../inbound/InboundASN";

const NewRoutes = [
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/putaway", element: <Putaway /> },
  { path: "/putawaydetails", element: <PutawayDetails /> },
  { path: "/inbound", element: <InboundASN /> },
  { path: "/createASN", element: <CreateASN /> },
];

export default NewRoutes;
