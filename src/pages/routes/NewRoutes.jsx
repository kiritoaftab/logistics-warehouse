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
import Picking from "../picking/Picking";
import PickWaves from "../picking/PickWaves";
import PickTasks from "../picking/PickTasks";
import PickTaskDetail from "../picking/PickTaskDetail";
import PickExceptions from "../picking/PickExceptions";
import Packing from "../packing/Packing";
import Shipping from "../shipping/Shipping";
import ShipmentDetail from "../shipping/ShipmentDetail";
import Masters from "../masters/Masters";
import OutboundOrders from "../outbound/OutboundOrders";
import OrderDetail from "../outbound/OrderDetail";
import CreateSalesOrder from "../outbound/CreateSalesOrder";
import Reports from "../reports/Reports";
import InboundTAT from "../reports/InboundTAT";
import PutawayAging from "../reports/PutawayAging";
import InventoryAccuracy from "../reports/InventoryAccuracy";
import SpaceUtilization from "../reports/SpaceUtilization";
import PickProductivity from "../reports/PickProductivity";
import PackProductivity from "../reports/PackProductivity";
import OutboundSLA from "../reports/OutboundSLA";
import BillingRevenue from "../reports/BillingRevenue";
import Billing from "../billing/Billing";

const NewRoutes = [
  { path: "/", element: <Navigate to="/inventory" replace /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/putaway", element: <Putaway /> },
  { path: "/putawaydetails", element: <PutawayDetails /> },
  { path: "/inbound", element: <InboundASN /> },
  { path: "/createASN", element: <CreateASN /> },
  { path: "/ASNdetails/:id", element: <AsnDetail /> },
  { path: "/ASNreceive/:id", element: <AsnReceiving /> },
  { path: "/outbound", element: <OutboundOrders /> },
  { path: "/orderDetails/:id", element: <OrderDetail /> },
  { path: "/saleOrderCreate", element: <CreateSalesOrder /> },
  { path: "/masters", element: <Masters /> },
  { path: "/reports", element: <Reports /> },
  { path: "/inboundTAT", element: <InboundTAT /> },
  { path: "/putawayAging", element: <PutawayAging /> },
  { path: "/inventoryAccuracy", element: <InventoryAccuracy /> },
  { path: "/spaceUtilization", element: <SpaceUtilization /> },
  { path: "/pickProductivity", element: <PickProductivity /> },
  { path: "/packProductivity", element: <PackProductivity /> },
  { path: "/outboundSLA", element: <OutboundSLA /> },
  { path: "/billingRevenue", element: <BillingRevenue /> },

  {
    path: "/inventory",
    element: <Inventory />,
    children: [{ index: true, element: <InventoryStockBySKU /> }],
  },
  { path: "/picking", element: <Picking /> },
  { path: "/packing", element: <Packing /> },
  { path: "/shipping", element: <Shipping /> },
  { path: "/shippingdetails", element: <ShipmentDetail /> },
  { path: "/billing", element: <Billing /> },
];
export default NewRoutes;
