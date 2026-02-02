import React, { useEffect, useRef, useState } from "react";
import http from "../../../api/http";
import Pagination from "../Pagination";

const PaginatedClientDropdown = ({
  value,
  onChange,
  placeholder = "Select client",
  limit = 10,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [clients, setClients] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit,
  });

  const wrapRef = useRef(null);

  // close on outside click
  useEffect(() => {
    const onDocClick = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const loadPage = async (page = 1) => {
    try {
      setLoading(true);

      const res = await http.get(`/clients?page=${page}&limit=${limit}`);

      const list = res?.data?.data?.clients || [];
      const pag = res?.data?.data?.pagination || {};

      setClients(Array.isArray(list) ? list : []);
      setPagination({
        total: pag.total ?? 0,
        page: pag.page ?? page,
        pages: pag.pages ?? 1,
        limit: pag.limit ?? limit,
      });
    } catch (e) {
      setClients([]);
      setPagination({ total: 0, page: 1, pages: 1, limit });
    } finally {
      setLoading(false);
    }
  };

  // load first page when opened
  useEffect(() => {
    if (!open) return;
    loadPage(1);
  }, [open]);

  const selected = clients.find((c) => String(c.id) === String(value));
  const selectedLabel = value
    ? selected
      ? `${selected.client_name} (${selected.client_code})`
      : `Selected: ${value}`
    : placeholder;

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((s) => !s)}
        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-left text-sm
                   focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
      >
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {selectedLabel}
        </span>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
          {/* List */}
          <div className="max-h-44 overflow-y-auto">
            {loading ? (
              <div className="px-3 py-3 text-sm text-gray-500">Loading…</div>
            ) : clients.length === 0 ? (
              <div className="px-3 py-3 text-sm text-gray-500">
                No clients found
              </div>
            ) : (
              clients.map((c) => {
                const active = String(c.id) === String(value);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      onChange(String(c.id)); // ✅ return only id
                      setOpen(false);
                    }}
                    className={[
                      "w-full px-3 py-2 text-left hover:bg-gray-50",
                      active ? "bg-blue-50" : "",
                    ].join(" ")}
                  >
                    <div className="text-sm font-medium text-gray-900">
                      {c.client_name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {c.client_code} • {c.email || "-"}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Pagination */}
          <div className="border-t border-gray-200">
            <Pagination
              pagination={pagination}
              onPageChange={(p) => loadPage(p)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PaginatedClientDropdown;
