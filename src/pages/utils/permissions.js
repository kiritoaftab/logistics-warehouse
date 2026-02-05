import { AUTH_ONLY } from "../routes/routePerms";
export const normalizePermissions = (permissionsArray = []) => {
  const map = {};

  permissionsArray.forEach((p) => {
    if (!p?.is_granted) return;

    const moduleCode = p?.module?.code;
    const permCode = p?.permission?.code;

    if (!moduleCode || !permCode) return;

    if (!map[moduleCode]) map[moduleCode] = {};
    map[moduleCode][permCode] = true;
  });

  return map;
};

export const hasPermission = (permsMap, moduleCode, permCode) => {
  if (permCode === AUTH_ONLY) return true;
  return !!permsMap?.[moduleCode]?.[permCode];
};

export const hasAnyPermission = (permsMap, moduleCode) => {
  const mod = permsMap?.[moduleCode];
  if (!mod) return false;
  return Object.values(mod).some(Boolean);
};
