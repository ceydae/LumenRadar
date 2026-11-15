import { ArrowRight, LoaderCircle } from "lucide-react";

export default function FormSubmit({
  pending,
  children,
  pendingLabel = "Saving",
}: {
  pending: boolean;
  children: string;
  pendingLabel?: string;
}) {
  return (
    <button
      className="primary-button login-submit"
      type="submit"
      disabled={pending}
    >
      {pending ? (
        <>
          {pendingLabel}
          <LoaderCircle
            className="loading-spinner"
            size={17}
            aria-hidden="true"
          />
        </>
      ) : (
        <>
          {children}
          <ArrowRight size={17} aria-hidden="true" />
        </>
      )}
    </button>
  );
}
