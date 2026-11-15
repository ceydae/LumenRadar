import ConnectionItem from "@/components/ConnectionItem";
import type { Project } from "@/types/analytics";
import Panel from "@/components/Panel";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { getSourceStatus } from "@/utils/project";

export default function ConnectionsSummary({
  project,
  onInspect,
}: {
  project: Project;
  onInspect: () => void;
}) {
  return (
    <Panel
      title="Data connections"
      description="Your project's signal sources."
      className="connections-panel"
    >
      <div className="connections-summary" aria-label="Data connections">
        <ConnectionItem
          kind="web"
          name="Web analytics"
          detail={project.domain}
          status={getSourceStatus(project.webConnected, project.webConfigured)}
          onInspect={onInspect}
        />
        <ConnectionItem
          kind="api"
          name="API analytics"
          detail={
            project.apiConfigured
              ? project.serviceName || "OpenTelemetry collector"
              : "No API source selected"
          }
          status={getSourceStatus(project.apiConnected, project.apiConfigured)}
          onInspect={onInspect}
        />
      </div>
      <div className="connection-coverage">
        <span>Sources selected</span>
        <strong>
          {Number(project.webConfigured) + Number(project.apiConfigured)}
          <span> / 2</span>
        </strong>
        <div className="coverage-track" aria-hidden="true">
          <span
            style={{
              width: `${(Number(project.webConfigured) + Number(project.apiConfigured)) * 50}%`,
            }}
          />
        </div>
        <p>Reporting starts when your selected sources send activity.</p>
      </div>
      <button className="connection-action" onClick={onInspect}>
        Connection details
        <ArrowUpRight size={15} aria-hidden="true" />
      </button>
      <div className="privacy-note">
        <ShieldCheck size={17} aria-hidden="true" />
        <span>
          Project-level reporting.
          <br />
          Individual visitor identities aren’t shown.
        </span>
      </div>
    </Panel>
  );
}
