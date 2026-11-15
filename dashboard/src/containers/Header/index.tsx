import { CalendarDays, ChevronRight } from "lucide-react";
import SelectField from "@/components/SelectField";
import { dateRanges } from "@/data/demo-analytics";
import type { DateRange, Project } from "@/types/analytics";

interface Props {
  projects: Project[];
  project: Project;
  range: DateRange;
  onProjectChange?: (id: string) => void;
  onRangeChange: (range: DateRange) => void;
}

export default function Header({
  projects,
  project,
  range,
  onProjectChange,
  onRangeChange,
}: Props) {
  return (
    <header className="topbar">
      <div className="project-picker">
        <span className="project-avatar">{project.initials}</span>
        {projects.length > 1 && onProjectChange ? (
          <SelectField
            label="Project"
            value={project.id}
            options={projects.map(({ id, name }) => ({
              value: id,
              label: name,
            }))}
            onChange={onProjectChange}
          />
        ) : (
          <strong className="selected-project">{project.name}</strong>
        )}
        <ChevronRight
          size={14}
          className="breadcrumb-chevron"
          aria-hidden="true"
        />
        <span className="breadcrumb-current">Overview</span>
      </div>
      <div className="header-actions">
        <div className="date-picker">
          <CalendarDays size={15} aria-hidden="true" />
          <SelectField
            label="Date range"
            value={range}
            options={dateRanges}
            onChange={(value) => onRangeChange(value as DateRange)}
          />
        </div>
      </div>
    </header>
  );
}
