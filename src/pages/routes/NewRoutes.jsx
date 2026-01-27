import Dashboard from "../dashboard/Dashboard";
import Putaway from "../putaway/Putaway";
import PutawayDetails from "../putaway/PutawayDetails";

const NewRoutes = [
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/putaway", element: <Putaway /> },
  { path: "/putawaydetails", element: <PutawayDetails /> },
];

export default NewRoutes;
