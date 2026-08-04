import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { fmt } from "@/lib/mathFormat";
import { ExerciseQuiz } from "@/lib/quiz";
import { PageHeader } from "@/lib/PageHeader";

export const Route = createFileRoute("/fiches/equations")({
  head: () => ({
    meta: [
      {
        title: "Équations et inéquations — Fiche de révision",
      },
      {
        name: "description",
        content:
          "Trouver un signe ou résoudre une inéquation, résoudre une équation ou trouver l'inconnue : 7 niveaux progressifs, du cas évident à l'étude de fonction.",
      },
      {
        property: "og:title",
        content: "Équations et inéquations — Fiche de révision",
      },
      {
        property: "og:description",
        content:
          "7 niveaux en vis-à-vis : signe / inéquation à gauche, équation / inconnue à droite.",
      },
    ],
  }),
  component: EquationsPage,
});

// ---------- small building blocks ----------

function Level({
  n,
  title,
  left,
  right,
}: {
  n: number;
  title: string;
  left: ReactNode;
  right: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-primary">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs text-primary">
          {n}
        </span>
        {title}
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
        <div className="min-w-0">{left}</div>
        <div className="min-w-0 border-t border-border pt-4 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
          {right}
        </div>
      </div>
    </section>
  );
}

function Line({ children }: { children: ReactNode }) {
  return (
    <p className="break-words rounded-md border border-border bg-muted px-3 py-2 font-mono text-sm text-foreground">
      {children}
    </p>
  );
}

function Note({ children }: { children: ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}

function Chain({ steps }: { steps: string[] }) {
  return (
    <p className="break-words rounded-md border border-border bg-muted px-3 py-2 font-mono text-sm text-foreground">
      {steps.map((s, i) => (
        <span key={i}>
          {i > 0 && <span className="mx-1.5 text-primary">⟺</span>}
          {fmt(s)}
        </span>
      ))}
    </p>
  );
}

function SignTable({
  bounds,
  rowsData,
}: {
  bounds: string[];
  rowsData: { label: string; signs: string[] }[];
}) {
  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="w-full min-w-[420px] border-collapse text-center text-xs sm:text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="px-2 py-2 text-left font-medium text-muted-foreground">x</th>
            {bounds.map((b, i) => (
              <th key={i} className="px-2 py-2 font-mono text-foreground">
                {fmt(b)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowsData.map((r, ri) => (
            <tr key={ri} className={ri > 0 ? "border-t border-border" : ""}>
              <td className="px-2 py-2 text-left font-mono text-muted-foreground">
                {fmt(r.label)}
              </td>
              {r.signs.map((s, i) => (
                <td key={i} className="px-2 py-2 font-mono">
                  <span
                    className={
                      s === "+"
                        ? "text-blue-400"
                        : s === "−"
                          ? "text-red-400"
                          : "text-muted-foreground"
                    }
                  >
                    {s}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const INEQUALITY_RULES: { op: string; eq: string; ineq: string }[] = [
  { op: "+ C", eq: "A + C = B + C", ineq: "A + C < B + C" },
  { op: "− C", eq: "A − C = B − C", ineq: "A − C < B − C" },
  { op: "× C", eq: "A × C = B × C (C≠0)", ineq: "A×C < B×C si C>0 ; A×C > B×C si C<0" },
  { op: "÷ C", eq: "A/C = B/C (C≠0)", ineq: "A/C < B/C si C>0 ; A/C > B/C si C<0" },
  {
    op: "f( )",
    eq: "f(A) = f(B)",
    ineq: "f(A) < f(B) si f croissante ; f(A) > f(B) si f décroissante",
  },
];

function InequalityRules() {
  return (
    <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">
        Manipuler une (in)égalité
      </h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="py-2 pr-3 font-medium">Opération</th>
              <th className="py-2 pr-3 font-medium">A = B</th>
              <th className="py-2 font-medium">A &lt; B</th>
            </tr>
          </thead>
          <tbody>
            {INEQUALITY_RULES.map((r) => (
              <tr key={r.op} className="border-b border-border last:border-0">
                <td className="py-2 pr-3 font-mono text-foreground">{r.op}</td>
                <td className="py-2 pr-3 font-mono text-xs text-muted-foreground sm:text-sm">
                  {r.eq}
                </td>
                <td className="py-2 font-mono text-xs text-muted-foreground sm:text-sm">
                  {r.ineq}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
        ⚠ Si on ne connaît pas le signe de C (ou les variations de f), on ne peut pas conclure.
      </p>
    </section>
  );
}

function EquationsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHeader
        eyebrow="Analyse"
        title="Équations et inéquations"
        description="Trouver un signe, trouver l'inconnue — 7 niveaux progressifs, du cas évident à l'étude de fonction."
        maxWidth="5xl"
      />

      <main className="mx-auto max-w-5xl space-y-6 px-6 py-10">
        <InequalityRules />

        <div className="grid grid-cols-1 gap-6 text-center text-xs font-semibold uppercase tracking-[0.15em] sm:grid-cols-2">
          <div className="text-blue-400">Trouver un signe ou résoudre une inéquation</div>
          <div className="text-pink-400">Résoudre une équation, trouver l'inconnue</div>
        </div>

        <Level
          n={1}
          title="C'est évident !"
          left={
            <div className="space-y-2">
              <Note>Le signe se lit directement, sans aucun calcul.</Note>
              <Line>
                {fmt("x^2+1")} : toujours {">"} 0
              </Line>
              <Line>
                {fmt("e^(-x)")} : toujours {">"} 0
              </Line>
              <Line>
                {fmt("(1-x)^(1/2)")} : toujours {"≥"} 0 (racine carrée)
              </Line>
            </div>
          }
          right={
            <div className="space-y-2">
              <Note>Il n'y a rien à résoudre : la réponse saute aux yeux.</Note>
              <Line>
                {fmt("x^(1/2)")}+1=0 : aucune solution (une racine carrée est {"≥"} 0)
              </Line>
              <Line>x+1=2+x : aucune solution (x s'annule, reste 1=2)</Line>
            </div>
          }
        />

        <Level
          n={2}
          title="C'est facile !"
          left={
            <div className="space-y-2">
              <Note>L'inconnue n'apparaît qu'une seule fois.</Note>
              <Chain steps={["1-2x>0", "-2x>-1", "x<1/2"]} />
              <Chain
                steps={["-e^(3x)+2>0", "-e^(3x)>-2", "e^(3x)<2", "3x<ln(2)", "x<(1/3)ln(2)"]}
              />
            </div>
          }
          right={
            <div className="space-y-2">
              <Note>L'inconnue n'apparaît qu'une seule fois.</Note>
              <Chain steps={["1+2x=0", "x=-1/2"]} />
              <Chain steps={["-e^(3x)+2=0", "e^(3x)=2", "3x=ln(2)", "x=ln(2)/3"]} />
            </div>
          }
        />

        <Level
          n={3}
          title="Ce n'est pas si facile !"
          left={
            <div className="space-y-2">
              <Note>
                x n'apparaît qu'une fois : on résout l'équation associée, puis on teste le signe
                avec des valeurs particulières de part et d'autre de la solution.
              </Note>
              <Line>
                Ex : signe de 2x−4 → on résout 2x−4=0 ⟺ x=2, puis on teste une valeur avant (x=0) et
                une après (x=3).
              </Line>
            </div>
          }
          right={
            <div className="space-y-2">
              <Note>L'inconnue apparaît plusieurs fois, mais elle se regroupe.</Note>
              <Chain steps={["3x+2=x+5", "3x-x=5-2", "x(3-1)=3", "2x=3"]} />
            </div>
          }
        />

        <Level
          n={4}
          title="Trinôme du second degré !"
          left={
            <div className="space-y-2">
              <Note>
                Forme générale ax²+bx+c. Règle : le signe de « a » est vrai à l'extérieur des
                racines, l'opposé à l'intérieur.
              </Note>
              <Line>
                {fmt("x^2-x-2")} : Δ=9{">"}0, x₁=−1, x₂=2
              </Line>
              <Line>
                {fmt("-e^(2x)+3e^x-2")} (poser X=e^x) : Δ=1{">"}0, e^x=1 et e^x=2
              </Line>
            </div>
          }
          right={
            <div className="space-y-2">
              <Note>Résoudre le trinôme avec le discriminant.</Note>
              <Chain steps={["x^2-x-2=0", "Δ=9>0", "x1=-1", "x2=2"]} />
            </div>
          }
        />

        <Level
          n={5}
          title="On factorise !"
          left={
            <div className="space-y-2">
              <Note>
                Après avoir mis un membre à 0 et factorisé en A×B, on étudie le signe de chaque
                facteur puis on croise dans un tableau de signes.
              </Note>
              <SignTable
                bounds={["-∞", "-3", "5", "+∞"]}
                rowsData={[
                  { label: "A", signs: ["−", "0", "+", "+"] },
                  { label: "B", signs: ["−", "−", "0", "+"] },
                  { label: "A×B", signs: ["+", "0", "0", "+"] },
                ]}
              />
            </div>
          }
          right={
            <div className="space-y-2">
              <Note>Règle du produit nul.</Note>
              <Chain steps={["A×B=0", "A=0 ou B=0"]} />
            </div>
          }
        />

        <Level
          n={6}
          title="On met au même dénominateur !"
          left={
            <div className="space-y-2">
              <Note>
                Après réduction au même dénominateur N/D, on étudie le signe du numérateur et du
                dénominateur séparément, dans un tableau de signes.
              </Note>
              <SignTable
                bounds={["-∞", "2", "6", "+∞"]}
                rowsData={[
                  { label: "N", signs: ["−", "0", "+", "+"] },
                  { label: "D", signs: ["−", "−", "0", "+"] },
                  { label: "N/D", signs: ["+", "0", "∥", "+"] },
                ]}
              />
            </div>
          }
          right={
            <div className="space-y-2">
              <Note>
                Règle du quotient nul : le numérateur doit s'annuler, mais pas le dénominateur.
              </Note>
              <Chain steps={["N/D=0", "N=0 et D≠0"]} />
            </div>
          }
        />

        <Level
          n={7}
          title="On étudie la fonction !"
          left={
            <div className="space-y-3">
              <Note>
                Quand rien ne se factorise : on dérive, on dresse le tableau de variation avec les
                limites aux bornes, puis on lit le signe sur ce tableau.
              </Note>
              <div className="overflow-x-auto rounded-md border border-border">
                <table className="w-full min-w-[320px] border-collapse text-center text-xs sm:text-sm">
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="px-2 py-2 text-left text-muted-foreground">x</td>
                      <td className="px-2 py-2 font-mono">−∞</td>
                      <td className="px-2 py-2 font-mono">−1</td>
                      <td className="px-2 py-2 font-mono">+∞</td>
                    </tr>
                    <tr>
                      <td className="px-2 py-2 text-left text-muted-foreground">f</td>
                      <td className="px-2 py-2">↘</td>
                      <td className="px-2 py-2 font-mono text-primary">min</td>
                      <td className="px-2 py-2">↗</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <Note>Schéma type : un minimum unique en x=−1.</Note>
            </div>
          }
          right={
            <div className="space-y-2">
              <Note>
                Pas de forme explicite pour isoler x : on étudie la fonction puis on utilise le
                théorème des valeurs intermédiaires (TVI), par balayage ou dichotomie.
              </Note>
              <Line>{fmt("e^x")}−x=0</Line>
              <Line>
                {fmt("x^3")}+2{fmt("x^2")}−x+1=0
              </Line>
            </div>
          }
        />

        <ExerciseQuiz slug="equations" />

        <nav className="border-t border-border pt-6">
          <Link to="/" className="text-sm text-muted-foreground transition hover:text-primary">
            ← Toutes les fiches
          </Link>
        </nav>
      </main>
    </div>
  );
}
