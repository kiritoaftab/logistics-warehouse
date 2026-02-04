import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import FormCard from "@/pages/components/forms/FormCard";
import FormGrid from "@/pages/components/forms/FormGrid";
import { InputField } from "@/pages/components/forms/Field";
import PillGroup from "@/pages/components/forms/PillGroup";

const ShipmentDetailsSection = forwardRef(({ initialAsn, onChange }, ref) => {
  const [form, setForm] = useState(() => ({
    transporter_name: initialAsn?.transporter_name || "",
    vehicle_no: initialAsn?.vehicle_no || "",
    driver_name: initialAsn?.driver_name || "",
    driver_phone: initialAsn?.driver_phone || "",
    // backend → string → UI array
    special_handling: initialAsn?.special_handling
      ? String(initialAsn.special_handling)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [],
  }));

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const validate = (action = "draft") => {
    const errs = [];
    // keeping shipment optional even on confirm
    // add rules later if needed
    return errs;
  };

  // ✅ expose functions to parent
  useImperativeHandle(ref, () => ({
    getData: () => ({ ...form }),
    validate,
    reset: () => {
      setForm({
        transporter_name: "",
        vehicle_no: "",
        driver_name: "",
        driver_phone: "",
        special_handling: [],
      });
    },
  }));

  // ✅ avoid onChange dependency loop
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // push snapshot only when form changes
  useEffect(() => {
    onChangeRef.current?.({ ...form });
  }, [form]);

  return (
    <FormCard title="Shipment Details">
      <FormGrid>
        <InputField
          label="Transporter Name"
          placeholder="e.g. Blue Dart"
          value={form.transporter_name}
          onChange={(v) => set("transporter_name", v)}
        />

        <InputField
          label="Vehicle No"
          placeholder="e.g. KA01AB1234"
          value={form.vehicle_no}
          onChange={(v) => set("vehicle_no", v)}
        />

        <InputField
          label="Driver Name"
          placeholder="Driver Name"
          value={form.driver_name}
          onChange={(v) => set("driver_name", v)}
        />

        <InputField
          label="Driver Phone"
          type="number"
          placeholder="Enter Number here"
          value={form.driver_phone}
          onChange={(v) => {
            if (v.length <= 10) set("driver_phone", v);
          }}
        />

        <PillGroup
          label="Special Handling"
          value={form.special_handling}
          onChange={(v) => set("special_handling", v)}
          options={[
            { label: "Fragile", value: "Fragile" },
            { label: "Cold Chain", value: "Cold Chain" },
            { label: "Top Load Only", value: "Top Load Only" },
            { label: "Hazardous", value: "Hazardous" },
          ]}
        />
      </FormGrid>
    </FormCard>
  );
});

export default ShipmentDetailsSection;
