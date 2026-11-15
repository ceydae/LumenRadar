"use client";

import { Tooltip } from "@animate-ui/react/primitives/radix-ui/tooltip";
import { Info } from "lucide-react";

export default function InfoTooltip({
  label,
  children,
}: {
  label: string;
  children: string;
}) {
  return (
    <Tooltip.Provider delayDuration={250}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button className="info-button" type="button" aria-label={label}>
            <Info size={14} aria-hidden="true" />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content sideOffset={8} className="tooltip-content">
            {children}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
