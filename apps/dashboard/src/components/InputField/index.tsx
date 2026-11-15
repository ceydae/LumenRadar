import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/utils/cn";

interface Props extends ComponentProps<"input"> {
  label: string;
  trailing?: ReactNode;
}

export default function InputField({
  label,
  id,
  trailing,
  className,
  ...props
}: Props) {
  return (
    <div className="input-field">
      <label htmlFor={id}>{label}</label>
      <div className={cn("input-control", trailing && "input-with-action")}>
        <input {...props} id={id} className={className} />
        {trailing}
      </div>
    </div>
  );
}
