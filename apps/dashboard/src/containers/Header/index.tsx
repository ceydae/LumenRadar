import { ArrowUpRight, ChevronRight } from "lucide-react";
// import { CalendarDays } from "lucide-react";
// import SelectField from "@/components/SelectField";
import ProjectSwitcher from "@/components/ProjectSwitcher";
import Link from "next/link";
// import { dateRanges } from "@/data/demo-analytics";
// import type { DateRange } from "@/types/analytics";
import type { Project } from "@/types/analytics";

interface Props {
  projects: Project[];
  project: Project;
  websiteUrl: string;
  // range: DateRange;
  onProjectChange?: (id: string) => void;
  // onRangeChange: (range: DateRange) => void;
}

export default function Header({
  projects,
  project,
  websiteUrl,
  // range,
  onProjectChange,
  // onRangeChange,
}: Props) {
  return (
    <header className="topbar project-header">
      <div className="project-header-context">
        <nav className="project-header-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Projects</Link>
          <ChevronRight size={13} aria-hidden="true" />
          <span aria-current="page">Website setup</span>
        </nav>
        <ProjectSwitcher projects={projects} project={project} onProjectChange={onProjectChange} />
      </div>
      <div className="project-header-actions">
        <a className="project-website-link" href={websiteUrl} target="_blank" rel="noopener noreferrer" aria-label="Open website (opens in a new tab)">
          Open website <ArrowUpRight size={16} aria-hidden="true" />
        </a>
        {/* MVP: date filters return with analytics reporting.
        <div className="date-picker">
          <CalendarDays size={15} aria-hidden="true" />
          <SelectField
            label="Date range"
            value={range}
            options={dateRanges}
            onChange={(value) => onRangeChange(value as DateRange)}
          />
        </div>
        */}
      </div>
    </header>
  );
}
