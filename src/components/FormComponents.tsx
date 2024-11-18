import React from "react";

export const AboutMe = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="mb-6">
    <label className="block mb-2 text-sm font-medium">About Me</label>
    <textarea
      className="w-full p-2 border rounded"
      rows={4}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export const Birthdate = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 10);
  const maxDateString = maxDate.toISOString().split("T")[0];

  return (
    <div className="mb-6">
      <label className="block mb-2 text-sm font-medium">Birthdate</label>
      <input
        type="date"
        className="w-full p-2 border rounded"
        value={value}
        max={maxDateString}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export const Address = ({
  address,
  city,
  state,
  zip,
  onChange,
}: {
  address: string;
  city: string;
  state: string;
  zip: string;
  onChange: (value: {
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  }) => void;
}) => (
  <div className="mb-6 space-y-4">
    <div>
      <label className="block mb-2 text-sm font-medium">Street Address</label>
      <input
        type="text"
        className="w-full p-2 border rounded"
        value={address}
        onChange={(e) => onChange({ address: e.target.value })}
      />
    </div>
    <div>
      <label className="block mb-2 text-sm font-medium">City</label>
      <input
        type="text"
        className="w-full p-2 border rounded"
        value={city}
        onChange={(e) => onChange({ city: e.target.value })}
      />
    </div>
    <div>
      <label className="block mb-2 text-sm font-medium">State</label>
      <input
        type="text"
        className="w-full p-2 border rounded"
        value={state}
        onChange={(e) => onChange({ state: e.target.value })}
      />
    </div>
    <div>
      <label className="block mb-2 text-sm font-medium">ZIP Code</label>
      <input
        type="text"
        className="w-full p-2 border rounded"
        value={zip}
        onChange={(e) => onChange({ zip: e.target.value })}
      />
    </div>
  </div>
);
