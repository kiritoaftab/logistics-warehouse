import Dashboard from "../dashboard/Dashboard";
import Putaway from "../putaway/Putaway";
import PutawayDetails from "../putaway/PutawayDetails";
import CreateASN from "../inbound/CreateASN";
import InboundASN from "../inbound/InboundASN";
import AsnDetail from "../inbound/AsnDetail";
import AsnReceiving from "../inbound/AsnReceiving";
import Inventory from "../inventory/Inventory";
import InventoryStockBySKU from "../inventory/InventoryStockBySKU";
import { useRoutes, Navigate } from "react-router-dom";
import OutboundOrders from "../outbound/OutboundOrders";
import CreateSalesOrder from "../outbound/CreateSalesOrder";
import OrderDetail from "../outbound/OrderDetail";
import Picking from "../picking/Picking";
import PickWaves from "../picking/PickWaves";
import PickTasks from "../picking/PickTasks";
import PickTaskDetail from "../picking/PickTaskDetail";
import PickExceptions from "../picking/PickExceptions";
<<<<<<< HEAD
import Packing from "../packing/Packing";
import Shipping from "../shipping/Shipping";
=======
import Masters from "../masters/Masters";
>>>>>>> 9df0ae352bbc3fdcd29e8a15d979c551d28ca817

const NewRoutes = [
  { path: "/", element: <Navigate to="/inventory" replace /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/putaway", element: <Putaway /> },
  { path: "/putawaydetails", element: <PutawayDetails /> },
  { path: "/inbound", element: <InboundASN /> },
  { path: "/createASN", element: <CreateASN /> },
  { path: "/ASNdetails/:id", element: <AsnDetail /> },
  { path: "/ASNreceive", element: <AsnReceiving /> },
  { path: "/outbound", element: <OutboundOrders /> },
  { path: "/saleOrderCreate", element: <CreateSalesOrder /> },
  { path: "/orderDetails/:id", element: <OrderDetail /> },
  { path: "/masters", element: <Masters /> },
  {
    path: "/inventory",
    element: <Inventory />,
    children: [
      { index: true, element: <InventoryStockBySKU /> }, // This is what shows at /inventory
    ],
  },
  { path: "/picking", element: <Picking /> },
  { path: "/packing", element: <Packing /> },
  { path: "/shipping", element: <Shipping /> },
];
export default NewRoutes;
