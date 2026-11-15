import type { LucideIcon } from "lucide-react";
import type { ConnectionMode } from "@/types/workspace";

export default function ConnectionChoice({
  value,
  label,
  description,
  icon: Icon,
  selected,
  disabled,
  onSelect,
}: {
  value: ConnectionMode;
  label: string;
  description: string;
  icon: LucideIcon;
  selected: boolean;
  disabled: boolean;
  onSelect: (value: ConnectionMode) => void;
}) {
  return (
    <label className="connection-choice">
      <input
        type="radio"
        name="connectionMode"
        value={value}
        checked={selected}
        disabled={disabled}
        onChange={() => onSelect(value)}
        required
      />
      <span className="choice-icon">
        <Icon size={20} aria-hidden="true" />
      </span>
      <span className="choice-copy">
        <strong>{label}</strong>
        <span>{description}</span>
      </span>
      <span className="choice-check" aria-hidden="true" />
    </label>
  );
}
