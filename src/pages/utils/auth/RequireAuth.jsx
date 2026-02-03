import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import { hasPermission } from "../permissions";
import { getToken } from "../authStorage";

export const RequireAuth = ({ children }) => {
  const token = getToken();
  const location = useLocation();

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
          reason: "Session expired or not logged in.",
        }}
      />
    );
  }

  return children;
};

export const RequirePermission = ({ moduleCode, permCode, children }) => {
  const { perms, loadingPerms } = useAuth();
  const location = useLocation();

  if (loadingPerms) return null;

  const ok = hasPermission(perms, moduleCode, permCode);

  if (!ok) {
    return (
      <Navigate
        to="/unauthorized"
        replace
        state={{
          from: location.pathname,
          moduleCode,
          permCode,
          reason: `Missing permission: ${moduleCode}.${permCode}`,
        }}
      />
    );
  }

  return children;
};
