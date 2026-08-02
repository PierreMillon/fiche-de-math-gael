import { execSync } from "node:child_process";

// Derives the version badge (see src/lib/version.ts) from the repo's actual
// commit history instead of a hand-maintained counter, so it reflects every
// change ever shipped without anyone needing to remember to bump it.
// MAJOR.MINOR: MINOR is the commit count mod 100, MAJOR is how many times
// that's wrapped around (plus one, so the very first commits read "1.xx"
// rather than "0.xx"). Requires full git history — the GitHub Pages deploy
// workflow's checkout step must use fetch-depth: 0, otherwise a shallow
// clone reports just 1 commit.
export function computeAppVersion(): string {
  try {
    const raw = execSync("git rev-list --count HEAD", { stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
    const count = Number.parseInt(raw, 10);
    if (!Number.isFinite(count) || count <= 0) return "dev";
    const major = Math.floor(count / 100) + 1;
    const minor = count % 100;
    return `${major}.${String(minor).padStart(2, "0")}`;
  } catch {
    return "dev";
  }
}
