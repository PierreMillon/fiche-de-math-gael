import { execSync } from "node:child_process";

// Derives the version badge (see src/lib/version.ts) and the changelog page
// (see src/lib/changelog.ts / src/routes/journal.tsx) from the repo's actual
// commit history instead of a hand-maintained counter or list, so both
// reflect every change ever shipped without anyone needing to remember to
// update them. Requires full git history — the GitHub Pages deploy
// workflow's checkout step must use fetch-depth: 0, otherwise a shallow
// clone reports just 1 commit.

// MAJOR.MINOR: MINOR is the commit count mod 100, MAJOR is how many times
// that's wrapped around (plus one, so the very first commits read "1.xx"
// rather than "0.xx"). `count` is the number of commits reachable at that
// point — pass the running total for a given commit to get *its* version,
// or the grand total for the current badge.
function versionAt(count: number): string {
  const major = Math.floor(count / 100) + 1;
  const minor = count % 100;
  return `${major}.${String(minor).padStart(2, "0")}`;
}

export function computeAppVersion(): string {
  try {
    const raw = execSync("git rev-list --count HEAD", { stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
    const count = Number.parseInt(raw, 10);
    if (!Number.isFinite(count) || count <= 0) return "dev";
    return versionAt(count);
  } catch {
    return "dev";
  }
}

export type ChangelogEntry = { version: string; subject: string };

// One entry per commit, oldest first internally (so each one's position IS
// its commit count, matching versionAt/computeAppVersion exactly), reversed
// before returning so the changelog page can render newest-first without
// having to think about it.
export function computeChangelog(): ChangelogEntry[] {
  try {
    const raw = execSync("git log --reverse --pretty=format:%s", {
      stdio: ["ignore", "pipe", "ignore"],
    }).toString();
    const subjects = raw.split("\n").filter(Boolean);
    const entries = subjects.map((subject, i) => ({
      version: versionAt(i + 1),
      subject,
    }));
    return entries.reverse();
  } catch {
    return [];
  }
}
