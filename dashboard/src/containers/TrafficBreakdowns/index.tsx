import Panel from "@/components/Panel";
import BreakdownList from "@/components/BreakdownList";
import EmptyState from "@/components/EmptyState";
import type { DateRange, Project } from "@/types/analytics";

export default function TrafficBreakdowns({
  project,
  range,
}: {
  project: Project;
  range: DateRange;
}) {
  const factor = range === "7d" ? 0.27 : 1;
  const sections = [
    {
      title: "Top pages",
      nameLabel: "Page",
      description: "The places people visit most.",
      valueLabel: "Page views",
      rows: project.pages.map((page) => ({
        label: page.path,
        value: Math.round(page.views * factor),
      })),
    },
    {
      title: "Top sources",
      nameLabel: "Source",
      description: "Where your visitors come from.",
      valueLabel: "Visitors",
      rows: project.sources.map((source) => ({
        label: source.name,
        value: Math.round(source.visitors * factor),
      })),
    },
  ];
  return (
    <div className="breakdowns-grid">
      {sections.map(({ title, description, ...list }) => (
        <Panel key={title} title={title} description={description}>
          {list.rows.length ? (
            <BreakdownList {...list} />
          ) : (
            <EmptyState
              title={
                title === "Top pages"
                  ? "No page views yet"
                  : "No traffic sources yet"
              }
              description="Activity will be listed here as your website receives visitors."
            />
          )}
        </Panel>
      ))}
    </div>
  );
}
