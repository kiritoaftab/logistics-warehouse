import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import http from "../../api/http";
import {
  getUser,
  getToken,
  getPerms,
  setPerms,
  permsAreFresh,
  clearAuth,
} from "./authStorage";
import { normalizePermissions } from "./permissions";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userSession, setUserSession] = useState(() => getUser());
  const [perms, setPermState] = useState(() => getPerms());
  const [loadingPerms, setLoadingPerms] = useState(false);

  const refreshPermissions = async ({ force = false } = {}) => {
    const user = getUser();
    const token = getToken();

    if (!user || !token) {
      clearAuth();
      setUserSession(null);
      setPermState(null);
      return { ok: false, reason: "No user/token" };
    }

    const cachedPerms = getPerms();
    if (!force && cachedPerms && permsAreFresh()) {
      setPermState(cachedPerms);
      return { ok: true, source: "cache" };
    }

    const roleId = user?.roles?.[0]?.id;
    if (!roleId) return { ok: false, reason: "No roleId on user" };

    try {
      setLoadingPerms(true);
      const res = await http.get(`/roles/${roleId}`);
      const permsMap = normalizePermissions(res?.data?.data?.permissions || []);
      setPerms(permsMap);
      setPermState(permsMap);
      return { ok: true, source: "api" };
    } catch (e) {
      clearAuth();
      setUserSession(null);
      setPermState(null);
      return { ok: false, reason: "Permissions API failed" };
    } finally {
      setLoadingPerms(false);
    }
  };

  useEffect(() => {
    refreshPermissions({ force: true });
  }, []);

  const value = useMemo(
    () => ({
      userSession,
      setUserSession,
      perms,
      loadingPerms,
      refreshPermissions,
      logout: () => {
        clearAuth();
        setUserSession(null);
        setPermState(null);
      },
    }),
    [userSession, perms, loadingPerms],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
