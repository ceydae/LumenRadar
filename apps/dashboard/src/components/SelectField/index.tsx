"use client";

import { Check, ChevronDown } from "lucide-react";
import { Select } from "@animate-ui/react/primitives/radix-ui/select";

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
    <Select.Root value={value} onValueChange={onChange}>
      <div className="select-field">
        <Select.Trigger className="select-field-trigger" aria-label={label}>
          <Select.Value />
          <Select.Icon className="select-field-icon">
            <ChevronDown aria-hidden="true" size={15} />
          </Select.Icon>
        </Select.Trigger>
      </div>
      <Select.Portal>
        <Select.Content className="select-field-content" position="popper" align="end" sideOffset={6} collisionPadding={12}>
          <Select.Viewport>
            {options.map((option) => (
              <Select.Item className="select-field-option" key={option.value} value={option.value}>
                <Select.ItemText>{option.label}</Select.ItemText>
                <Select.ItemIndicator className="select-field-check">
                  <Check size={14} aria-hidden="true" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
