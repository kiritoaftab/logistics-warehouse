import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../utils/AuthProvider";
import { getToken } from "../utils/authStorage";

const Unauthorized = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { refreshPermissions, loadingPerms } = useAuth();
  const [retrying, setRetrying] = useState(false);

  const state = location.state || {};
  const reason = state.reason || "You do not have access to this page.";
  const from = state.from || "/";
  const moduleCode = state.moduleCode || "-";
  const permCode = state.permCode || "-";

  useEffect(() => {
    toast.error(reason);
    console.warn("[UNAUTHORIZED]", { from, moduleCode, permCode, state });
  }, []);

  const handleRecheck = async () => {
    try {
      setRetrying(true);
      const res = await refreshPermissions({ force: true });

      if (res?.ok) {
        toast.success("Permissions refreshed. Rechecking access...");
        // go back to the page user wanted
        navigate(from, { replace: true });
      } else {
        toast.error(res?.reason || "Could not refresh permissions.");
      }
    } finally {
      setRetrying(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-gray-900">Unauthorized</h1>
      <p className="mt-2 text-sm text-gray-600">{reason}</p>

      <div className="mt-4 rounded-md border bg-white p-4 text-sm">
        <div>
          <b>Route:</b> {from}
        </div>
        <div>
          <b>Required:</b> {moduleCode}.{permCode}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={handleRecheck}
          disabled={retrying || loadingPerms}
          className="px-4 py-2 rounded-md bg-primary text-white text-sm disabled:opacity-60"
        >
          {retrying || loadingPerms ? "Rechecking..." : "Recheck Permissions"}
        </button>

        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-sm"
        >
          Go Back
        </button>

        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 rounded-md bg-gray-900 text-white text-sm"
        >
          Go Login
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
