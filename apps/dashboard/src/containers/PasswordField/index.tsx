"use client";

import { useState, type ComponentProps } from "react";
import { Eye, EyeOff } from "lucide-react";
import InputField from "@/components/InputField";

export default function PasswordField(
  props: Omit<ComponentProps<typeof InputField>, "type" | "trailing">,
) {
  const [visible, setVisible] = useState(false);
  return (
    <InputField
      {...props}
      type={visible ? "text" : "password"}
      trailing={
        <button
          className="password-toggle"
          type="button"
          onClick={() => setVisible((value) => !value)}
          disabled={props.disabled}
          aria-label={`${visible ? "Hide" : "Show"} ${props.label.toLowerCase()}`}
          aria-pressed={visible}
        >
          {visible ? (
            <EyeOff size={17} aria-hidden="true" />
          ) : (
            <Eye size={17} aria-hidden="true" />
          )}
        </button>
      }
    />
  );
}
