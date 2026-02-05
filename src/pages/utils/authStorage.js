const USER_KEY = "user";
const PERMS_KEY = "perms";
const PERMS_TS_KEY = "perms_ts";
const TOKEN_KEY = "auth_token";

export const getToken = () => {
  return sessionStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
  sessionStorage.setItem(TOKEN_KEY, token);
};

export const getUser = () => {
  const raw = sessionStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const getUserRole = () => {
  const user = getUser();
  return user?.roles?.[0]?.role_code || null;
};

export const setUser = (userObj) => {
  sessionStorage.setItem(USER_KEY, JSON.stringify(userObj));
};

export const clearAuth = () => {
  sessionStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(PERMS_KEY);
  sessionStorage.removeItem(PERMS_TS_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
};

export const getPerms = () => {
  const raw = sessionStorage.getItem(PERMS_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const setPerms = (permsMap) => {
  sessionStorage.setItem(PERMS_KEY, JSON.stringify(permsMap));
  sessionStorage.setItem(PERMS_TS_KEY, String(Date.now()));
};

export const permsAreFresh = (maxAgeMs = 6 * 60 * 60 * 1000) => {
  const ts = Number(sessionStorage.getItem(PERMS_TS_KEY) || 0);
  return ts && Date.now() - ts < maxAgeMs;
};
