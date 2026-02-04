import React, { useEffect, useRef, useState } from "react";
import http from "../../../api/http";
import Pagination from "../Pagination";
import { createPortal } from "react-dom";

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

  const btnRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  const calcPos = () => {
    const r = btnRef.current?.getBoundingClientRect();
    if (!r) return;
    setPos({
      top: r.bottom + 8, // 8px gap
      left: r.left,
      width: r.width,
    });
  };

  useEffect(() => {
    if (!open) return;

    calcPos();

    const onScroll = () => calcPos();
    const onResize = () => calcPos();

    window.addEventListener("scroll", onScroll, true); // true catches nested scroll
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

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

      {open &&
        createPortal(
          <div
            className="fixed z-[999999] rounded-md border border-gray-200 bg-white shadow-xl overflow-hidden"
            style={{ top: pos.top, left: pos.left, width: pos.width }}
          >
            {/* optional search */}
            {enableSearch ? (
              <div className="p-2 border-b border-gray-100">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
            ) : null}

            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="px-3 py-3 text-sm text-gray-500">Loading…</div>
              ) : items.length === 0 ? (
                <div className="px-3 py-3 text-sm text-gray-500">
                  No records found
                </div>
              ) : (
                items.map((it) => {
                  const active = String(it.id) === String(value);
                  const view = renderItem?.(it) || {
                    title: String(it.id),
                    subtitle: "",
                  };

                  return (
                    <button
                      key={it.id}
                      type="button"
                      onClick={() => {
                        onChange(String(it.id), it);
                        setOpen(false);
                      }}
                      className={[
                        "w-full px-3 py-2 text-left hover:bg-gray-50",
                        active ? "bg-blue-50" : "",
                      ].join(" ")}
                    >
                      <div className="text-sm font-medium text-gray-900">
                        {view.title}
                      </div>
                      {view.subtitle ? (
                        <div className="text-xs text-gray-500">
                          {view.subtitle}
                        </div>
                      ) : null}
                    </button>
                  );
                })
              )}
            </div>

            <div className="border-t border-gray-200">
              <Pagination
                pagination={pagination}
                onPageChange={(p) => loadPage(p)}
              />
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default PaginatedClientDropdown;
