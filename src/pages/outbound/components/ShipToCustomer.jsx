import { useState } from "react";
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
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeSuggestions, setPincodeSuggestions] = useState([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const setS = (field, value) => {
    setShipTo((prev) => ({ ...prev, [field]: value }));
  };

  const fetchPincodeDetails = async (pincode) => {
    if (pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
      setPincodeSuggestions([]);
      setShowCityDropdown(false);
      setS("city", "");
      setS("state", "");
      return;
    }

    setPincodeLoading(true);
    try {
      const response = await fetch(
        `https://medicine.uur.co.in:4036/api/v1/pincode/${pincode}`,
      );
      const data = await response.json();

      if (data.success && data.data && data.data.length > 0) {
        setPincodeSuggestions(data.data);
        setShowCityDropdown(true);

        const firstSuggestion = data.data[0];
        setS("city", firstSuggestion.city || "");
        setS("state", firstSuggestion.state || "");
      } else {
        setPincodeSuggestions([]);
        setShowCityDropdown(false);
        setS("city", "");
        setS("state", "");
      }
    } catch (error) {
      console.error("Error fetching pincode details:", error);
      setPincodeSuggestions([]);
      setShowCityDropdown(false);
      setS("city", "");
      setS("state", "");
    } finally {
      setPincodeLoading(false);
    }
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
            placeholder="Enter Number"
            value={shipTo.phone}
            onChange={(v) => setS("phone", v)}
            validate="phone"
            error={phoneError}
            setError={setPhoneError}
          />

          <InputField
            placeholder="Enter Email"
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

          <div className="relative">
            <InputField
              label="Pincode"
              required
              placeholder="Zip Code"
              value={shipTo.pincode}
              onChange={(v) => {
                setS("pincode", v);
                fetchPincodeDetails(v);
              }}
            />
            {pincodeLoading && (
              <div className="absolute right-3 top-[38px]">
                <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {showCityDropdown ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <select
                value={shipTo.city}
                onChange={(e) => setS("city", e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              >
                {pincodeSuggestions.map((item) => (
                  <option key={item.city} value={item.city}>
                    {item.city}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <InputField
              label="City"
              required
              placeholder="City"
              value={shipTo.city}
              disabled
            />
          )}

          <InputField
            label="State"
            required
            placeholder="State"
            value={shipTo.state}
            disabled
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
