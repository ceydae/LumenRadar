import Link from "next/link";

export default function ProjectLoadError({ error, onRetry, title }: { error: string; onRetry?: () => void; title?: string }) {
  return (
    <main className="project-load-error">
      <h1>{title ?? (onRetry ? "We couldn’t load your projects." : "Project not found.")}</h1>
      <p role="alert">{error}</p>
      {onRetry && <button className="primary-button" type="button" onClick={onRetry}>Try again</button>}
      <Link href="/" className="back-button">Back to projects</Link>
    </main>
  );
}
