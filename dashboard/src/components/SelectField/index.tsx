"use client";

import { ChevronDown } from "lucide-react";

interface Props {
  label: string;
  value: string;
  options: readonly { value: string; label: string }[];
  onChange: (value: string) => void;
}

export default function SelectField({
  label,
  value,
  options,
  onChange,
}: Props) {
  return (
    <label className="select-field">
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown aria-hidden="true" size={15} />
    </label>
  );
}
