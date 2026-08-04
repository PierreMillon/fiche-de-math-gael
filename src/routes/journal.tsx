import { createFileRoute } from "@tanstack/react-router";
import { CHANGELOG } from "@/lib/changelog";
import { PageHeader } from "@/lib/PageHeader";

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
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHeader title="Historique des versions" />

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
