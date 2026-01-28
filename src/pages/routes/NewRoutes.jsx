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
  { path: "/orderDetails", element: <OrderDetail /> },
  {
    path: "/inventory",
    element: <Inventory />,
    children: [
      { index: true, element: <InventoryStockBySKU /> }, // This is what shows at /inventory
      // Add other child routes when you create them:
      // { path: "location", element: <InventoryByLocation /> },
      // { path: "holds", element: <InventoryHolds /> },
      // { path: "transactions", element: <InventoryTransactions /> },
    ],
  },
];
export default NewRoutes;
