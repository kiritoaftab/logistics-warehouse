export const validateAll = ({
  basicRef,
  shipRef,
  linesRef,
  action = "draft", // "draft" | "confirm"
}) => {
  const errors = [];

  // Section-level validation (each section defines its own rules)
  if (basicRef?.current?.validate) {
    errors.push(...(basicRef.current.validate(action) || []));
  }
  if (shipRef?.current?.validate) {
    errors.push(...(shipRef.current.validate(action) || []));
  }
  if (linesRef?.current?.validate) {
    errors.push(...(linesRef.current.validate(action) || []));
  }

  // unique + clean
  return Array.from(new Set(errors)).filter(Boolean);
};

export const toIsoOrNull = (value) => {
  if (!value) return null;

  const v = String(value).trim();

  // 1) datetime-local: "YYYY-MM-DDTHH:mm"
  const isoLocal = v.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
  if (isoLocal) {
    const [_, y, mo, d, h, mi] = isoLocal;
    const dt = new Date(
      Number(y),
      Number(mo) - 1,
      Number(d),
      Number(h),
      Number(mi),
      0,
    );
    if (!Number.isNaN(dt.getTime())) return dt.toISOString();
  }

  // 2) strict ISO (with Z or offset)
  const isoStrict = v.match(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?(\.\d+)?(Z|[+-]\d{2}:\d{2})$/,
  );
  if (isoStrict) {
    const d = new Date(v);
    if (!Number.isNaN(d.getTime())) return d.toISOString();
  }

  // 3) DD/MM/YYYY
  const dmy = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (dmy) {
    const dd = Number(dmy[1]);
    const mm = Number(dmy[2]);
    const yyyy = Number(dmy[3]);
    const dt = new Date(yyyy, mm - 1, dd, 0, 0, 0); // ✅ local
    if (!Number.isNaN(dt.getTime())) return dt.toISOString();
  }

  // 4) "MM/DD/YYYY, HH:mm AM/PM"
  const us = v.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4}),\s*(\d{1,2}):(\d{2})\s*(AM|PM)$/i,
  );
  if (us) {
    let mm = Number(us[1]);
    let dd = Number(us[2]);
    let yyyy = Number(us[3]);
    let hh = Number(us[4]);
    const min = Number(us[5]);
    const ap = String(us[6]).toUpperCase();
    if (ap === "PM" && hh < 12) hh += 12;
    if (ap === "AM" && hh === 12) hh = 0;

    const dt = new Date(yyyy, mm - 1, dd, hh, min, 0); // ✅ local
    if (!Number.isNaN(dt.getTime())) return dt.toISOString();
  }

  return null;
};

export const logError = (label, error, extra = {}) => {
  try {
    console.groupCollapsed(`❌ ${label}`);
    console.log("Extra context:", extra);

    if (error) {
      console.log("Error object:", error);
      console.log("Message:", error?.message);
      console.log("Stack:", error?.stack);

      // Axios-specific
      if (error?.response) {
        console.log("Response status:", error.response.status);
        console.log("Response data:", error.response.data);
        console.log("Response headers:", error.response.headers);
      }

      if (error?.config) {
        console.log("Request URL:", error.config.url);
        console.log("Request method:", error.config.method);
        console.log("Request data:", error.config.data);
        console.log("Request headers:", error.config.headers);
      }
    } else {
      console.log("No error object provided");
    }
  } catch (e) {
    // logging should never crash app
    console.error("logError failed", e);
  } finally {
    console.groupEnd();
  }
};

export const mapApiErrorsToForm = (data) => {
  if (!Array.isArray(data?.errors)) return {};

  return data.errors.reduce((acc, item) => {
    if (item?.field && item?.message) {
      acc[item.field] = item.message;
    }
    return acc;
  }, {});
};

export const createToastQueue = (toast, opts = {}) => {
  const duration = opts.duration ?? 2500; // ms per toast
  const gap = opts.gap ?? 200; // ms between toasts
  let running = false;
  const q = [];

  const run = async () => {
    if (running) return;
    running = true;

    while (q.length) {
      const item = q.shift();
      if (!item) continue;

      // show one toast
      toast.error(item);

      // wait for duration + small gap
      await new Promise((r) => setTimeout(r, duration + gap));
    }

    running = false;
  };

  return {
    push: (msg) => {
      if (!msg) return;
      q.push(msg);
      run();
    },
    showErrors: (msgs = []) => {
      msgs.filter(Boolean).forEach((m) => q.push(m));
      run();
    },
    clear: () => {
      q.length = 0;
    },
  };
};

export const getBackendErrorMessages = (data) => {
  if (!Array.isArray(data?.errors)) return [];
  return data.errors
    .map((e) => e?.message)
    .filter(Boolean)
    .map((m) => String(m).replace(/^asns\./, "")); // remove "asns."
};

export const isAxiosError = (e) =>
  !!e && (e.isAxiosError || !!e.response || !!e.config);

export const isBusinessError = (e) => {
  // Backend returned success:false OR validation errors
  const data = e?.response?.data;
  return (
    !!data &&
    (data.success === false || Array.isArray(data.errors) || !!data.message)
  );
};
