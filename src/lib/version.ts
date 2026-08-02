// Single source of truth for the version badge shown in the site header
// (see __root.tsx). MAJOR.MINOR: MINOR goes up by one on every change
// shipped to main; MAJOR goes up (and MINOR resets to 0) once MINOR would
// pass 99, or by hand for a milestone worth marking on its own. Bump this by
// hand alongside whatever change is being shipped — there's no build step
// generating it.
export const APP_VERSION = "1.0";
