import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

const MAX_WIDTH: Record<"3xl" | "4xl" | "5xl", string> = {
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
};

// The "← back link / eyebrow / title / description" block every page opens
// with — factored out of the ~11 route files that used to repeat it
// byte-for-byte, so a shared-shell change (styling, back-link behavior)
// only needs to happen once.
export function PageHeader({
  backTo = "/",
  backLabel = "← Toutes les fiches",
  eyebrow,
  title,
  description,
  maxWidth = "3xl",
}: {
  backTo?: "/" | "/progression";
  backLabel?: string;
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  maxWidth?: "3xl" | "4xl" | "5xl";
}) {
  return (
    <header className="border-b border-border">
      <div className={`mx-auto ${MAX_WIDTH[maxWidth]} px-6 py-10`}>
        <Link to={backTo} className="text-sm text-muted-foreground transition hover:text-primary">
          {backLabel}
        </Link>
        {eyebrow && (
          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
        )}
        <h1
          className={`text-center text-4xl font-bold tracking-tight sm:text-5xl ${eyebrow ? "mt-2" : "mt-6"}`}
        >
          {title}
        </h1>
        {description && <p className="mt-3 text-muted-foreground">{description}</p>}
      </div>
    </header>
  );
}
