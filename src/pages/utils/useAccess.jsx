import { useMemo } from "react";
import { useAuth } from "./AuthProvider";
import { hasPermission } from "./permissions";

export const useAccess = (moduleCode) => {
  const { perms, loadingPerms } = useAuth();

  return useMemo(() => {
    const can = (perm) => {
      if (!moduleCode) return false;
      return hasPermission(perms, moduleCode, perm);
    };

    return {
      loading: loadingPerms,
      module: moduleCode,

      canRead: can("READ"),
      canCreate: can("CREATE"),
      canUpdate: can("UPDATE"),
      canDelete: can("DELETE"),
      canExport: can("EXPORT"),

      can,
    };
  }, [perms, loadingPerms, moduleCode]);
};

export const Can = ({ module, perm = "READ", children, fallback = null }) => {
  const access = useAccess(module);

  if (access.loading) return null;
  if (!access.can(perm)) return fallback;

  return <>{children}</>;
};

export const PermissionButton = ({
  module,
  perm = "READ",
  fallback = null,
  children,
  ...props
}) => {
  return (
    <Can module={module} perm={perm} fallback={fallback}>
      <button {...props}>{children}</button>
    </Can>
  );
};
