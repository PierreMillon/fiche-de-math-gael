import { ALL_COMPETENCIES, overallMasteryPercent } from "@/lib/competencies";
import { BOSS_TARGET, initialPyramid, readStoredPyramid, type Pyramid } from "@/lib/pyramid";

// 256 words, one per byte value (0-255) — a friendly stand-in for hex.
// All deliberately cute/gentle (baby animals, sweets, cozy objects — no
// predators, biting bugs, or scary creatures). No accents, no duplicates:
// both matter for reliable round-tripping when someone re-types the
// phrase by hand instead of pasting a link.
export const WORDLIST: string[] = [
  "chat",
  "chaton",
  "chien",
  "chiot",
  "lapin",
  "lapereau",
  "ourson",
  "panda",
  "koala",
  "renard",
  "renardeau",
  "ecureuil",
  "herisson",
  "loutre",
  "castor",
  "faon",
  "mouton",
  "agneau",
  "chevre",
  "chevreau",
  "vache",
  "veau",
  "cochon",
  "cochonnet",
  "poule",
  "poussin",
  "canard",
  "caneton",
  "oie",
  "oison",
  "cygne",
  "pingouin",
  "manchot",
  "dauphin",
  "baleine",
  "phoque",
  "tortue",
  "grenouille",
  "papillon",
  "coccinelle",
  "abeille",
  "luciole",
  "escargot",
  "girafe",
  "girafon",
  "elephant",
  "elephanteau",
  "zebre",
  "singe",
  "gorille",
  "lionceau",
  "tigron",
  "poisson",
  "poissonrouge",
  "etoiledemer",
  "hippocampe",
  "crabe",
  "pieuvre",
  "meduse",
  "corail",
  "pomme",
  "poire",
  "banane",
  "fraise",
  "cerise",
  "orange",
  "citron",
  "ananas",
  "mangue",
  "peche",
  "abricot",
  "raisin",
  "myrtille",
  "framboise",
  "pasteque",
  "kiwi",
  "gateau",
  "biscuit",
  "bonbon",
  "chocolat",
  "glace",
  "cupcake",
  "macaron",
  "sucre",
  "miel",
  "crepe",
  "gaufre",
  "tarte",
  "guimauve",
  "caramel",
  "praline",
  "nougat",
  "nuage",
  "etoile",
  "lune",
  "soleil",
  "arcenciel",
  "coeur",
  "ballon",
  "cerfvolant",
  "bulle",
  "doudou",
  "oreiller",
  "coussin",
  "couverture",
  "lanterne",
  "bougie",
  "cadeau",
  "ruban",
  "bouton",
  "perle",
  "coquillage",
  "plume",
  "fleur",
  "tulipe",
  "marguerite",
  "tournesol",
  "trefle",
  "feuille",
  "champignon",
  "gland",
  "flocon",
  "licorne",
  "fee",
  "lutin",
  "elfe",
  "sirene",
  "farfadet",
  "gnome",
  "etoilefilante",
  "baguette",
  "potion",
  "cabane",
  "maison",
  "moulin",
  "phare",
  "bateau",
  "train",
  "fusee",
  "planete",
  "robot",
  "montgolfiere",
  "carrosse",
  "chateau",
  "pont",
  "jardin",
  "balancoire",
  "toboggan",
  "manege",
  "parapluie",
  "botte",
  "chapeau",
  "echarpe",
  "gant",
  "chaussette",
  "pyjama",
  "poupee",
  "peluche",
  "toupie",
  "cerceau",
  "marionnette",
  "tambourin",
  "flute",
  "grelot",
  "clochette",
  "sifflet",
  "guitare",
  "piano",
  "violon",
  "harpe",
  "xylophone",
  "berceau",
  "biberon",
  "hochet",
  "tetine",
  "landau",
  "poussette",
  "veilleuse",
  "arrosoir",
  "pelle",
  "seau",
  "chateaudesable",
  "cerf",
  "ecrevisse",
  "canari",
  "perroquet",
  "colombe",
  "moineau",
  "hirondelle",
  "rougegorge",
  "mesange",
  "plumeau",
  "nid",
  "oeuf",
  "coquille",
  "framboisier",
  "cerisier",
  "pommier",
  "fraisier",
  "cascade",
  "ruisseau",
  "colline",
  "vallee",
  "printemps",
  "bourgeon",
  "rosee",
  "brume",
  "comete",
  "meteore",
  "galaxie",
  "astronaute",
  "diamant",
  "emeraude",
  "saphir",
  "rubis",
  "couronne",
  "bague",
  "bracelet",
  "collier",
  "medaillon",
  "coffret",
  "cle",
  "serrure",
  "horloge",
  "montre",
  "boussole",
  "longuevue",
  "carte",
  "souris",
  "souriceau",
  "taupe",
  "blaireau",
  "marmotte",
  "hibou",
  "chouette",
  "biche",
  "faisan",
  "paon",
  "flamant",
  "colibri",
  "libellule",
  "bourdon",
  "ver",
  "chenille",
  "chrysalide",
  "nenuphar",
  "iris",
  "jonquille",
  "jacinthe",
  "muguet",
  "lavande",
  "camomille",
  "bruyere",
  "fougere",
  "mousse",
  "rocher",
];

const WORD_INDEX: Map<string, number> = new Map(WORDLIST.map((w, i) => [w, i]));

// A pyramid's whole progress state (tier/filled/complete/bossRays/bossDone)
// collapses into one of 13 values, so it fits a nibble. wrongTotal and
// hesitations are deliberately not carried over — they're a nice-to-have on
// the device that earned them, not essential to transfer, and leaving them
// out keeps the phrase shorter.
export function pyramidToCode(p: Pyramid | null): number {
  if (!p) return 0;
  if (p.complete) return 6 + Math.min(BOSS_TARGET, p.bossRays);
  if (p.tier === 1) return Math.min(2, p.filled);
  if (p.tier === 2) return 3 + Math.min(1, p.filled);
  return 5;
}

export function codeToPyramid(
  code: number,
  existingWrongTotal: number,
  existingHesitations = 0,
): Pyramid {
  if (code >= 6) {
    const bossRays = code - 6;
    return {
      tier: 3,
      filled: 1,
      complete: true,
      bossRays,
      bossDone: bossRays >= BOSS_TARGET,
      wrongTotal: existingWrongTotal,
      hesitations: existingHesitations,
    };
  }
  if (code <= 2)
    return {
      ...initialPyramid,
      tier: 1,
      filled: code,
      wrongTotal: existingWrongTotal,
      hesitations: existingHesitations,
    };
  if (code <= 4)
    return {
      ...initialPyramid,
      tier: 2,
      filled: code - 3,
      wrongTotal: existingWrongTotal,
      hesitations: existingHesitations,
    };
  return {
    ...initialPyramid,
    tier: 3,
    filled: 0,
    wrongTotal: existingWrongTotal,
    hesitations: existingHesitations,
  };
}

// One byte per two competencies (a nibble each), prefixed with a header
// byte carrying the competency count at encode time — not a real
// checksum, just enough to warn on decode if the site's competency list
// has grown/changed shape since, instead of silently misattributing
// progress to the wrong fiche. Pure (no localStorage) so it's cheap to
// round-trip in tests.
//
// Trailing all-zero bytes (competencies never touched) are dropped: a
// missing position decodes as untouched anyway (see importProgressPhrase),
// so this shortens the common case — a handful of fiches started, the
// rest blank — instead of padding the phrase out with repeats of
// whichever word represents "untouched".
export function encodeCodes(codes: number[], competencyCount: number): string {
  const bytes: number[] = [competencyCount % 256];
  for (let i = 0; i < codes.length; i += 2) {
    const hi = codes[i] & 0x0f;
    const lo = (codes[i + 1] ?? 0) & 0x0f;
    bytes.push((hi << 4) | lo);
  }
  let end = bytes.length;
  while (end > 1 && bytes[end - 1] === 0) end--;
  return bytes
    .slice(0, end)
    .map((b) => WORDLIST[b])
    .join("-");
}

export function decodeCodes(
  phrase: string,
  skipWords = 0,
): { header: number; codes: number[] } | null {
  const words = phrase
    .trim()
    .toLowerCase()
    .split(/[\s,-]+/)
    .filter(Boolean)
    .slice(skipWords);
  if (words.length < 1) return null;

  const bytes: number[] = [];
  for (const w of words) {
    const idx = WORD_INDEX.get(w);
    if (idx === undefined) return null;
    bytes.push(idx);
  }

  const [header, ...rest] = bytes;
  const codes: number[] = [];
  for (const b of rest) {
    codes.push((b >> 4) & 0x0f);
    codes.push(b & 0x0f);
  }
  return { header, codes };
}

// A purely cosmetic first word, reflecting OVERALL progress (0-100%) —
// separate from the header/data words below, which encode per-competency
// state and whose first byte happens to always be the same value for a
// given site build (competencyCount % 256 never changes between exports),
// so it always picked the same WORDLIST entry ("baleine" for everyone,
// with zero relation to progress). This badge word is what actually moves
// as mastery climbs, so the phrase visibly "levels up" instead of always
// starting the same way. 5 tiers x 5 words = 25 possible badge words;
// within a tier the word still shifts as % climbs, so movement is visible
// even without crossing a tier boundary. Not decoded for data — always
// exactly one word, always skipped on import (see importProgressPhrase).
const BADGE_TIERS: string[][] = [
  ["chaton", "poussin", "lapereau", "faon", "souriceau"], // 0-19% : ça commence
  ["papillon", "coccinelle", "luciole", "arcenciel", "etoile"], // 20-39% : ça prend forme
  ["licorne", "fee", "lutin", "sirene", "farfadet"], // 40-59% : ça devient magique
  ["diamant", "emeraude", "saphir", "rubis", "perle"], // 60-79% : ça a de la valeur
  ["couronne", "galaxie", "comete", "astronaute", "etoilefilante"], // 80-100% : presque légendaire
];

export function badgeWord(overallPercent: number): string {
  const pct = Math.min(100, Math.max(0, overallPercent));
  const tierIdx = Math.min(BADGE_TIERS.length - 1, Math.floor(pct / 20));
  const tier = BADGE_TIERS[tierIdx];
  const pctInTier = pct - tierIdx * 20; // 0..20
  const wordIdx = Math.min(tier.length - 1, Math.floor((pctInTier / 20) * tier.length));
  return tier[wordIdx];
}

export function exportProgressPhrase(): string {
  const codes = ALL_COMPETENCIES.map((c) => {
    const pyramids = c.keys.map(readStoredPyramid);
    // Competencies only ever have one key in practice; average defensively.
    const avg = pyramids.reduce((sum, p) => sum + pyramidToCode(p), 0) / pyramids.length;
    return Math.round(avg);
  });
  const badge = badgeWord(overallMasteryPercent());
  return `${badge}-${encodeCodes(codes, ALL_COMPETENCIES.length)}`;
}

export type ImportResult = { applied: number; mismatch: boolean };

export function importProgressPhrase(phrase: string): ImportResult | null {
  // Skip the leading badge word — it's cosmetic, not data (see badgeWord).
  const decoded = decodeCodes(phrase, 1);
  if (!decoded) return null;

  const mismatch = decoded.header !== ALL_COMPETENCIES.length % 256;
  let applied = 0;
  ALL_COMPETENCIES.forEach((c, i) => {
    // A position beyond the (possibly trimmed) phrase means "untouched" —
    // still counts as applied, since that's the value that was encoded.
    const code = decoded.codes[i] ?? 0;
    const key = c.keys[0];
    const existing = readStoredPyramid(key);
    const next = codeToPyramid(code, existing?.wrongTotal ?? 0, existing?.hesitations ?? 0);
    localStorage.setItem("pyramid:" + key, JSON.stringify(next));
    applied++;
  });

  return { applied, mismatch };
}
