export const AUTH_ONLY = "AUTH_ONLY";

export const ROUTE_PERMS = {
  "/dashboard": { module: "DASHBOARD", perm: "READ" },

  "/putaway": { module: "PUTAWAY", perm: "READ" },
  "/putawaydetails": { module: "PUTAWAY", perm: "READ" },

  "/inbound": { module: "INBOUND", perm: "READ" },
  "/createASN/:id": { module: "INBOUND", perm: "CREATE" },
  "/ASNdetails/:id": { module: "INBOUND", perm: "READ" },
  "/ASNreceive/:id": { module: "INBOUND", perm: "UPDATE" },

  "/outbound": { module: "ORDERS", perm: "READ" },
  "/orderDetails/:id": { module: "ORDERS", perm: "READ" },
  "/saleOrderCreate/:id": { module: "ORDERS", perm: "CREATE" },

  "/masters": { module: AUTH_ONLY, perm: AUTH_ONLY },
  "/reports": { module: AUTH_ONLY, perm: AUTH_ONLY },

  "/inboundTAT": { module: "REPORTS", perm: "READ" },
  "/putawayAging": { module: "REPORTS", perm: "READ" },
  "/inventoryAccuracy": { module: "REPORTS", perm: "READ" },
  "/spaceUtilization": { module: "REPORTS", perm: "READ" },
  "/pickProductivity": { module: "REPORTS", perm: "READ" },
  "/packProductivity": { module: "REPORTS", perm: "READ" },
  "/outboundSLA": { module: "REPORTS", perm: "READ" },
  "/billingRevenue": { module: "REPORTS", perm: "READ" },

  "/inventory": { module: "INVENTORY", perm: "READ" },

  "/picking": { module: "ORDERS", perm: "READ" },
  "/packing": { module: "ORDERS", perm: "READ" },
  "/shipping": { module: "ORDERS", perm: "READ" },
  "/shippingdetails": { module: "ORDERS", perm: "READ" },

  "/billing": { module: "REPORTS", perm: "READ" },

  "/setting": { module: "SETTINGS", perm: "READ" },
};
