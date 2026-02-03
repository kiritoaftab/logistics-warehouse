import { AUTH_ONLY, ROUTE_PERMS } from "../routes/routePerms";
import { hasPermission } from "./permissions";

const PATH_ALIASES = {};

const GROUP_PATHS = {
  "/masters": ["USER_MANAGEMENT", "WAREHOUSE", "SUPPLIERS", "PALLET", "GRN"],
  "/reports": ["REPORTS", "INBOUND", "PUTAWAY", "INVENTORY", "ORDERS"],
};

export const canSeeMenuPath = (perms, path) => {
  const resolvedPath = PATH_ALIASES[path] || path;
  const group = GROUP_PATHS[resolvedPath];
  if (group) {
    return group.some((moduleCode) => hasPermission(perms, moduleCode, "READ"));
  }

  const rule = ROUTE_PERMS[resolvedPath];
  if (!rule) return false;

  if (rule.module === AUTH_ONLY) return true;

  return hasPermission(perms, rule.module, rule.perm || "READ");
};
