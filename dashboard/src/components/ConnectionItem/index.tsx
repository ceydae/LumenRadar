import { ArrowUpRight, Cable, Globe2 } from "lucide-react";
import Badge from "@/components/Badge";

interface Props {
  kind: "web" | "api";
  name: string;
  detail: string;
  status: string;
  onInspect: () => void;
}

export default function ConnectionItem({
  kind,
  name,
  detail,
  status,
  onInspect,
}: Props) {
  const Icon = kind === "web" ? Globe2 : Cable;
  return (
    <div className="connection-item">
      <div className="connection-icon">
        <Icon size={20} aria-hidden="true" />
      </div>
      <div className="connection-copy">
        <div className="connection-title">
          <strong>{name}</strong>
          <Badge tone={status === "Connected" ? "success" : "neutral"}>
            {status}
          </Badge>
        </div>
        <span>{detail}</span>
      </div>
      <button
        className="icon-button"
        type="button"
        aria-label={`View ${name} connection details`}
        onClick={onInspect}
      >
        <ArrowUpRight size={17} aria-hidden="true" />
      </button>
    </div>
  );
}
