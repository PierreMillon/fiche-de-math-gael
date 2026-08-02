// Single source of truth for the version badge shown in the site header
// (see __root.tsx). Computed at build time from the repo's commit count —
// see vite.appVersion.ts — so it reflects every change shipped since the
// very first commit, not a hand-maintained counter someone has to remember
// to bump. `typeof` guard covers contexts (tests, non-Vite tooling) where
// the `define` replacement never runs.
export const APP_VERSION = typeof __APP_VERSION__ === "string" ? __APP_VERSION__ : "dev";
