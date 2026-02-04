import React, { useEffect, useState } from "react";
import ConfirmDeleteModal from "@/pages/components/modals/ConfirmDeleteModal"; // reuse your modal shell if you want
import http from "@/api/http";
import Pagination from "@/pages/components/Pagination";

const SkuPickerModal = ({ open, onClose, onSelect, clientId }) => {
  const [loading, setLoading] = useState(false);
  const [skus, setSkus] = useState([]);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 10,
  });

  const load = async (page = 1) => {
    try {
      setLoading(true);
      const qs = new URLSearchParams();
      qs.set("page", String(page));
      qs.set("limit", "10");
      if (clientId) qs.set("client_id", String(clientId));
      if (search.trim()) qs.set("search", search.trim());

      const res = await http.get(`/skus?${qs.toString()}`);
      const list = res?.data?.data?.skus || [];
      const pag = res?.data?.data?.pagination || {};

      setSkus(Array.isArray(list) ? list : []);
      setPagination({
        total: pag.total ?? 0,
        page: pag.page ?? page,
        pages: pag.pages ?? 1,
        limit: pag.limit ?? 10,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => load(1), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="font-semibold">Select SKU</div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900"
          >
            ✕
          </button>
        </div>

        <div className="p-4 border-b">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search SKU code / name…"
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          {!clientId ? (
            <div className="text-xs text-amber-600 mt-2">
              Select Client first to load SKUs
            </div>
          ) : null}
        </div>

        <div className="max-h-[55vh] overflow-y-auto">
          {loading ? (
            <div className="p-4 text-sm text-gray-500">Loading…</div>
          ) : skus.length === 0 ? (
            <div className="p-4 text-sm text-gray-500">No SKUs found</div>
          ) : (
            skus.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  onSelect(s);
                  onClose();
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b"
              >
                <div className="text-sm font-medium text-gray-900">
                  {s.sku_code} ({s.sku_name})
                </div>
                <div className="text-xs text-gray-500">
                  UOM: {s.uom || "-"} • {s.category || "-"}
                </div>
              </button>
            ))
          )}
        </div>

        <div className="p-3 border-t">
          <Pagination pagination={pagination} onPageChange={(p) => load(p)} />
        </div>
      </div>
    </div>
  );
};

export default SkuPickerModal;
