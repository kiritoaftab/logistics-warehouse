import { InputField, TextareaField } from "../../components/forms/Field";
import FormGrid from "../../components/forms/FormGrid";

const ShipToCustomer = ({
  shipTo,
  setShipTo,
  phoneError,
  setPhoneError,
  emailError,
  setEmailError,
}) => {
  const setS = (field, value) => {
    setShipTo((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <div className="text-sm font-semibold text-gray-900">
          Ship-to / Customer
        </div>
        <button className="px-3 py-1.5 text-xs rounded-md border bg-white">
          Select Saved Address
        </button>
      </div>

      <div className="p-4">
        <FormGrid>
          <InputField
            label="Ship-to Name"
            required
            placeholder="Company or Contact Name"
            value={shipTo.name}
            onChange={(v) => setS("name", v)}
          />
          <InputField
            label="Phone"
            type="number"
            required
            placeholder="+1 (555) 000-0000"
            value={shipTo.phone}
            onChange={(v) => setS("phone", v)}
            validate="phone"
            error={phoneError}
            setError={setPhoneError}
          />
          <InputField
            label="Email"
            value={shipTo.email}
            onChange={(v) => setS("email", v)}
            validate="email"
            error={emailError}
            setError={setEmailError}
          />

          <InputField
            label="Address Line 1"
            required
            placeholder="Street address, P.O. box"
            value={shipTo.address1}
            onChange={(v) => setS("address1", v)}
          />

          <InputField
            label="Address Line 2"
            placeholder="Apartment, suite, unit, etc."
            value={shipTo.address2}
            onChange={(v) => setS("address2", v)}
          />

          <InputField
            label="City"
            required
            placeholder="City"
            value={shipTo.city}
            onChange={(v) => setS("city", v)}
          />
          <InputField
            label="State"
            required
            placeholder="State"
            value={shipTo.state}
            onChange={(v) => setS("state", v)}
          />
          <InputField
            label="Pincode"
            required
            placeholder="Zip Code"
            value={shipTo.pincode}
            onChange={(v) => setS("pincode", v)}
          />

          <InputField
            label="GSTIN / Tax ID"
            placeholder="Optional"
            value={shipTo.gstin}
            onChange={(v) => setS("gstin", v)}
          />

          <TextareaField
            label="Delivery Instructions"
            placeholder="Gate code, parking instructions, etc."
            value={shipTo.instructions}
            onChange={(v) => setS("instructions", v)}
          />
        </FormGrid>
      </div>
    </div>
  );
};

export default ShipToCustomer;
