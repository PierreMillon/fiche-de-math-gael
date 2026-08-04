import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ALL_COMPETENCIES,
  CATEGORIES,
  categoryAverage,
  competencyMastery,
  competencyWrongTotal,
  competencyWeakness,
  resetAllProgress,
  type Competency,
} from "@/lib/competencies";
import { RadarChart } from "@/lib/radarChart";
import { exportProgressPhrase, importProgressPhrase } from "@/lib/wordCode";
import { PageHeader } from "@/lib/PageHeader";

export const Route = createFileRoute("/progression")({
  head: () => ({
    meta: [
      { title: "Ma progression — Fiches Maths" },
      {
        name: "description",
        content: "Radar de compétences, grille de progression et points faibles à retravailler.",
      },
    ],
  }),
  component: ProgressionPage,
});

function masteryColor(pct: number): string {
  if (pct >= 100) return "bg-yellow-400 border-yellow-200";
  if (pct >= 60) return "bg-white border-white/70";
  if (pct >= 25) return "bg-orange-500/70 border-orange-300";
  if (pct > 0) return "bg-muted border-border";
  return "bg-transparent border-white/20";
}

function CompetencyCell({ c, mastery }: { c: Competency; mastery: number }) {
  return (
    <Link
      to="/fiches/$slug"
      params={{ slug: c.fiche }}
      title={`${c.label} — ${Math.round(mastery)}%`}
      className={`flex aspect-square items-center justify-center rounded-md border text-[9px] leading-tight text-foreground/70 transition hover:border-primary hover:text-primary ${masteryColor(mastery)}`}
    >
      <span className="sr-only">{c.label}</span>
    </Link>
  );
}

function TransferSection({ onImported }: { onImported: () => void }) {
  const [phrase, setPhrase] = useState<string | null>(null);
  const [pasted, setPasted] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const reveal = () => setPhrase(exportProgressPhrase());

  const shareLink = phrase
    ? `${window.location.origin}${window.location.pathname}?import=${encodeURIComponent(phrase)}`
    : null;

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setMessage(`${label} copié.`);
    } catch {
      setMessage("Impossible de copier automatiquement — sélectionne le texte à la main.");
    }
  };

  const handleImport = () => {
    if (
      !window.confirm(
        "Importer cette progression va écraser la progression actuelle sur cet appareil, compétence par compétence. Continuer ?",
      )
    ) {
      return;
    }
    const result = importProgressPhrase(pasted);
    if (!result) {
      setMessage("Phrase invalide — vérifie qu'elle est copiée en entier, sans mot manquant.");
      return;
    }
    setMessage(
      result.mismatch
        ? `Import fait (${result.applied} compétences), mais le nombre de fiches a changé depuis l'export : certaines compétences ont pu être décalées.`
        : `Import réussi : ${result.applied} compétences mises à jour.`,
    );
    onImported();
  };

  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-lg font-semibold text-card-foreground">Transférer ma progression</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Pas de compte : pour passer d'un appareil à l'autre, une phrase (ou un lien) à
        copier-coller.
      </p>

      <details className="mt-3 rounded-md border border-border bg-muted px-3 py-2 text-sm">
        <summary className="cursor-pointer font-medium text-foreground">
          Comment ça marche exactement ?
        </summary>
        <div className="mt-2 space-y-2 text-muted-foreground">
          <p>
            « Générer ma phrase » prend une <strong className="text-foreground">photo</strong> de ta
            progression à cet instant précis et la transforme en quelques mots. Coller cette phrase
            (ou ouvrir le lien) sur un autre appareil recopie cette photo là-bas.
          </p>
          <p>
            Ce n'est <strong className="text-foreground">pas</strong> une synchronisation en direct
            : si tu progresses encore après avoir généré la phrase, ces nouveaux progrès n'y sont
            pas inclus. Il faut en générer une nouvelle à chaque fois que tu veux mettre l'autre
            appareil à jour.
          </p>
          <p className="text-foreground">Avantages :</p>
          <ul className="list-disc space-y-1 pl-4">
            <li>Aucun compte, aucun mot de passe à retenir.</li>
            <li>
              Rien n'est envoyé à un serveur : la phrase ne sort de tes appareils que si toi tu la
              copies.
            </li>
            <li>Fonctionne même hors connexion, juste du texte à transmettre.</li>
          </ul>
          <p className="text-foreground">Inconvénients :</p>
          <ul className="list-disc space-y-1 pl-4">
            <li>Pas automatique : il faut y penser et régénérer une phrase à chaque fois.</li>
            <li>
              Si tu avances sur deux appareils en parallèle sans jamais réimporter entre les deux,
              le dernier import écrase l'autre — pas de fusion intelligente des deux progressions.
            </li>
          </ul>
        </div>
      </details>

      <div className="mt-4">
        {!phrase ? (
          <button
            onClick={reveal}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Générer ma phrase
          </button>
        ) : (
          <div className="space-y-2">
            <p className="break-words rounded-md border border-border bg-muted px-3 py-2 font-mono text-sm text-foreground">
              {phrase}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => copy(phrase, "La phrase")}
                className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-primary"
              >
                Copier la phrase
              </button>
              {shareLink && (
                <button
                  onClick={() => copy(shareLink, "Le lien")}
                  className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-primary"
                >
                  Copier le lien (import en un clic sur l'autre appareil)
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 border-t border-border pt-4">
        <label htmlFor="import-phrase" className="text-sm font-medium text-foreground">
          Importer une phrase reçue
        </label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            id="import-phrase"
            type="text"
            value={pasted}
            onChange={(e) => setPasted(e.target.value)}
            placeholder="chat-tigre-lune-..."
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            className="flex-1 rounded-md border border-border bg-muted px-3 py-2 text-sm text-foreground"
          />
          <button
            onClick={handleImport}
            disabled={pasted.trim().length === 0}
            className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary disabled:opacity-40"
          >
            Importer
          </button>
        </div>
      </div>

      {message && <p className="mt-3 text-sm text-primary">{message}</p>}
    </section>
  );
}

function ProgressionPage() {
  const [ready, setReady] = useState(false);
  const [tick, setTick] = useState(0);

  // Reading localStorage must wait until mount (SSR has no localStorage);
  // `tick` forces a recompute after an import or "Réinitialiser toute la
  // progression". A `?import=<phrase>` link is applied automatically once,
  // after a confirm, then stripped from the URL.
  useEffect(() => {
    setReady(true);
    const params = new URLSearchParams(window.location.search);
    const fromLink = params.get("import");
    if (!fromLink) return;

    const clean = () => {
      params.delete("import");
      const rest = params.toString();
      window.history.replaceState({}, "", window.location.pathname + (rest ? `?${rest}` : ""));
    };

    if (
      window.confirm(
        "Importer la progression contenue dans ce lien va écraser la progression actuelle sur cet appareil. Continuer ?",
      )
    ) {
      importProgressPhrase(fromLink);
      setTick((t) => t + 1);
    }
    clean();
  }, []);

  if (!ready) {
    return <div className="min-h-screen bg-background" />;
  }

  const axes = CATEGORIES.map((cat) => ({ label: cat, value: categoryAverage(cat) }));

  // Ranked by weakness (mistakes + half-weighted hesitations), not just
  // mistakes — a correct-but-slow streak is still worth surfacing here even
  // with zero wrong answers.
  const weakest = ALL_COMPETENCIES.map((c) => ({
    c,
    wrong: competencyWrongTotal(c),
    weakness: competencyWeakness(c),
  }))
    .filter((x) => x.weakness > 0)
    .sort((a, b) => b.weakness - a.weakness)
    .slice(0, 8);

  const overall =
    ALL_COMPETENCIES.reduce((sum, c) => sum + competencyMastery(c), 0) / ALL_COMPETENCIES.length;

  const handleReset = () => {
    if (
      !window.confirm(
        "Réinitialiser toute la progression, sur toutes les fiches ? Impossible à annuler.",
      )
    ) {
      return;
    }
    resetAllProgress();
    setTick((t) => t + 1);
  };

  return (
    <div key={tick} className="min-h-screen bg-background text-foreground">
      <PageHeader
        eyebrow="Progression"
        title="Ma progression"
        description={
          <>
            {Math.round(overall)}% de maîtrise globale, sur {ALL_COMPETENCIES.length} compétences —
            stocké uniquement sur cet appareil, sauf si tu génères une phrase à coller ailleurs
            (voir plus bas).
          </>
        }
        maxWidth="4xl"
      />

      <main className="mx-auto max-w-4xl space-y-8 px-6 py-10">
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-card-foreground">
            Vue d'ensemble par catégorie
          </h2>
          <RadarChart axes={axes} />
        </section>

        <TransferSection onImported={() => setTick((t) => t + 1)} />

        <section className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-card-foreground">Points faibles</h2>
            {weakest.length > 0 && (
              <Link
                to="/revision"
                className="shrink-0 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
              >
                Réviser →
              </Link>
            )}
          </div>
          {weakest.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">
              Pas encore assez de mauvaises réponses pour dégager une tendance — bon signe.
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {weakest.map(({ c, wrong }) => (
                <li key={c.id}>
                  <Link
                    to="/fiches/$slug"
                    params={{ slug: c.fiche }}
                    className="flex items-center justify-between rounded-md border border-border bg-muted px-3 py-2 text-sm transition hover:border-primary"
                  >
                    <span className="text-foreground">{c.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {wrong} erreur{wrong > 1 ? "s" : ""}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-card-foreground">Grille de compétences</h2>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 shrink-0 rounded-sm border border-white/20 bg-transparent" />
                à faire
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 shrink-0 rounded-sm border border-orange-300 bg-orange-500/70" />
                en cours
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 shrink-0 rounded-sm border border-white/70 bg-white" />
                avancé
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 shrink-0 rounded-sm border border-yellow-200 bg-yellow-400" />
                validé
              </span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-6 gap-1.5 sm:grid-cols-9 md:grid-cols-10">
            {ALL_COMPETENCIES.map((c) => (
              <CompetencyCell key={c.id} c={c} mastery={competencyMastery(c)} />
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-red-500/30 bg-card p-6">
          <h2 className="text-sm font-semibold text-red-300">Zone de réinitialisation</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Pour repartir de zéro sur une seule fiche, utilise le bouton « Réinitialiser la pyramide
            » directement sur cette fiche. Ce bouton-ci efface tout, partout.
          </p>
          <button
            onClick={handleReset}
            className="mt-3 rounded-md border border-red-500/50 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/10"
          >
            Réinitialiser toute la progression
          </button>
        </section>
      </main>
    </div>
  );
}
