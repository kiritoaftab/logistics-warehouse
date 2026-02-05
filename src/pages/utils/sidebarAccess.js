import { AUTH_ONLY, ROUTE_PERMS, GROUP_PATHS } from "../routes/routePerms";
import { hasPermission } from "./permissions";

export const canSeeMenuPath = (perms, path) => {
  const groupModules = GROUP_PATHS[path];
  if (groupModules) {
    return groupModules.some((moduleCode) =>
      hasPermission(perms, moduleCode, "READ"),
    );
  }
  const rule = ROUTE_PERMS[path];
  if (!rule) return false;
  if (rule.module === AUTH_ONLY) return true;
  return hasPermission(perms, rule.module, rule.perm || "READ");
};
