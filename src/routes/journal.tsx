import { createFileRoute, Link } from "@tanstack/react-router";
import { CHANGELOG } from "@/lib/changelog";

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title: "Journal des versions — Fiches Maths" },
      {
        name: "description",
        content: "Historique de toutes les versions et modifications du site.",
      },
    ],
  }),
  component: JournalPage,
});

function JournalPage() {
  const oldest = CHANGELOG[CHANGELOG.length - 1]?.version;
  const newest = CHANGELOG[0]?.version;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto max-w-3xl px-6 py-10">
          <Link to="/" className="text-sm text-muted-foreground transition hover:text-primary">
            ← Toutes les fiches
          </Link>
          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-primary">Journal</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Historique des versions
          </h1>
          <p className="mt-3 text-muted-foreground">
            {CHANGELOG.length} modifications, de la v{oldest} à la v{newest}.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <ul className="divide-y divide-border">
          {CHANGELOG.map((entry) => (
            <li key={entry.version} className="flex items-baseline gap-3 py-1.5 text-sm">
              <span className="w-14 shrink-0 font-mono text-xs tabular-nums text-primary">
                v{entry.version}
              </span>
              <span className="text-foreground">{entry.subject}</span>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
