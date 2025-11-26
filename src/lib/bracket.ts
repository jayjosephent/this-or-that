import { getCustomBrackets, getCustomBracketsSync, type CustomBracket } from "./customBrackets";

export const BYE = "— BYE —" as const;

export const POOLS = {
  fizzy: [
    "Coca-Cola Original",
    "Pepsi Max",
    "Fanta Orange",
    "Irn-Bru",
    "Sprite",
    "Dr Pepper",
    "Diet Coke",
    "Red Bull",
    "Pepsi",
    "Coke Zero Sugar",
    "7UP",
    "Fanta Lemon",
    "Lucozade Energy Original",
    "Vimto Fizzy",
    "Tango Orange",
    "Sanpellegrino Lemon",
  ],
  choc: [
    "Cadbury Dairy Milk",
    "KitKat",
    "Mars",
    "Snickers",
    "Twix",
    "Galaxy",
    "Yorkie",
    "Bounty",
    "Crunchie",
    "Wispa",
    "Aero",
    "Milky Way",
    "Lion",
    "Double Decker",
    "Flake",
    "Maltesers Bar",
  ],
  sweets: [
    "Haribo Starmix",
    "Wine Gums",
    "Jelly Babies",
    "Fruit Pastilles",
    "Skittles",
    "Starburst",
    "Drumstick Squashies",
    "Love Hearts",
    "Refreshers",
    "Percy Pigs",
    "Maoam Stripes",
    "Dolly Mixture",
    "Parma Violets",
    "Millions",
    "Jelly Tots",
    "Sour Patch Kids",
  ],
  rnb: [
    "Beyoncé",
    "Rihanna",
    "Usher",
    "The Weeknd",
    "SZA",
    "Alicia Keys",
    "Mary J. Blige",
    "Brandy",
    "Monica",
    "Ne-Yo",
    "Miguel",
    "Frank Ocean",
    "Toni Braxton",
    "Mariah Carey",
    "Aaliyah",
    "Boyz II Men",
  ],
  pop: [
    "Ariana Grande",
    "Taylor Swift",
    "Olivia Rodrigo",
    "Dua Lipa",
    "Billie Eilish",
    "Camila Cabello",
    "Katy Perry",
    "Lady Gaga",
    "Rihanna",
    "Selena Gomez",
  ],
  guy: [
    "Rich Guy",
    "Tall Guy",
    "Funny Guy",
    "Well-Educated Guy",
    "Athletic Muscular Guy",
    "Romantic Guy",
    "Short King",
    "Confident Guy",
    "Protective Guy",
    "Ambitious Guy",
    "Stylish Guy",
  ],
  girl: [
    "Tall Girl",
    "Pretty Girl",
    "Curvy Girl",
    "Loud Girl",
    "Supportive Girl",
    "Rich Girl",
    "High-Maintenance Girl",
    "Materialistic Girl",
    "Petite Girl",
    "Well-Educated Girl",
    "Short Girl",
    "Athletic Girl",
  ],
  fwds: [
    "Lionel Messi",
    "Cristiano Ronaldo",
    "Kylian Mbappé",
    "Erling Haaland",
    "Neymar Jr",
    "Mohamed Salah",
    "Harry Kane",
    "Karim Benzema",
    "Vinícius Jr",
    "Robert Lewandowski",
    "Marcus Rashford",
    "Olivier Giroud",
  ],
  str: [
    "Erling Haaland",
    "Kylian Mbappé",
    "Harry Kane",
    "Karim Benzema",
    "Robert Lewandowski",
    "Victor Osimhen",
    "Lautaro Martínez",
    "Gabriel Jesus",
    "Darwin Núñez",
    "Romelu Lukaku",
    "Olivier Giroud",
    "Alexander Isak",
  ],
  mids: [
    "Kevin De Bruyne",
    "Jude Bellingham",
    "Luka Modrić",
    "Toni Kroos",
    "Bruno Fernandes",
    "Martin Ødegaard",
    "Rodri Hernández",
    "Pedri",
    "Gavi",
    "Bernardo Silva",
    "Declan Rice",
    "Federico Valverde",
  ],
  defs: [
    "Virgil van Dijk",
    "Sergio Ramos",
    "Trent Alexander-Arnold",
    "João Cancelo",
    "Achraf Hakimi",
    "Antonio Rüdiger",
    "Rúben Dias",
    "Kyle Walker",
    "Theo Hernández",
    "David Alaba",
    "Ronald Araújo",
    "Raphaël Varane",
  ],
  gks: [
    "Alisson Becker",
    "Ederson Moraes",
    "Thibaut Courtois",
    "Manuel Neuer",
    "Marc-André ter Stegen",
    "Emiliano “Dibu” Martínez",
    "Jan Oblak",
    "Aaron Ramsdale",
    "Mike Maignan",
    "Andre Onana",
    "Gianluigi Donnarumma",
    "David de Gea",
  ],
  matters: [
    "Money 💰",
    "Love ❤️",
    "Looks 👀",
    "Personality 💬",
    "Loyalty 🤝",
    "Respect 🙌",
    "Ambition 🚀",
    "Peace of Mind ☁️",
    "Trust 🔒",
    "Street Smart 🧢",
    "Book Smart 📚",
    "Communication 💭",
  ],
} as const;

export type CategoryKey = keyof typeof POOLS | string; // string for custom brackets
export type Mode = 8 | 10 | 11 | 12;
export type MatchId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
export type MatchPair = (string | null)[];
export type Matches = Record<MatchId, MatchPair>;

type FlowMap = Partial<Record<MatchId, { winnerTo: MatchId; position: 0 | 1 }>>;

export const FLOW: FlowMap = {
  1: { winnerTo: 3, position: 0 },
  2: { winnerTo: 4, position: 0 },
  3: { winnerTo: 7, position: 0 },
  4: { winnerTo: 7, position: 1 },
  5: { winnerTo: 8, position: 0 },
  6: { winnerTo: 8, position: 1 },
  7: { winnerTo: 9, position: 0 },
  8: { winnerTo: 9, position: 1 },
  10: { winnerTo: 5, position: 0 },
  11: { winnerTo: 6, position: 0 },
};

export const FLOW_8: FlowMap = {
  1: { winnerTo: 5, position: 0 },
  2: { winnerTo: 5, position: 1 },
  3: { winnerTo: 6, position: 0 },
  4: { winnerTo: 6, position: 1 },
  5: { winnerTo: 7, position: 0 },
  6: { winnerTo: 7, position: 1 },
};

export const ORDER: MatchId[] = [1, 2, 10, 11, 3, 4, 5, 6, 7, 8, 9];
export const ORDER_8: MatchId[] = [1, 2, 3, 4, 5, 6, 7];

export const CATEGORY_OPTIONS: Array<{ value: CategoryKey; label: string }> = [
  { value: "fizzy", label: "Top Fizzy Drinks" },
  { value: "choc", label: "Top Chocolate Bars" },
  { value: "sweets", label: "Top UK Sweets" },
  { value: "rnb", label: "Top 10 R&B Artists" },
  { value: "pop", label: "Top 10 Pop Artists" },
  { value: "guy", label: "Type of Guy You Like" },
  { value: "girl", label: "Type of Girl You Like" },
  { value: "matters", label: "💡 What Matters Most (Top 12)" },
  { value: "fwds", label: "⚽ Forwards (Top 12)" },
  { value: "str", label: "🎯 Strikers (Top 12)" },
  { value: "mids", label: "🎨 Midfielders (Top 12)" },
  { value: "defs", label: "🛡️ Defenders (Top 12)" },
  { value: "gks", label: "🧤 Goalkeepers (Top 12)" },
] as const;

export const getAllCategoryOptions = (): Array<{ value: CategoryKey; label: string }> => {
  const builtIn = [...CATEGORY_OPTIONS];
  if (typeof window === "undefined") return builtIn;
  // Use sync version for initial render (falls back to localStorage)
  const custom = getCustomBracketsSync();
  const customOptions = custom.map((b) => ({
    value: b.id as CategoryKey,
    label: b.name,
  }));
  return [...builtIn, ...customOptions];
};

export const getAllCategoryOptionsAsync = async (): Promise<Array<{ value: CategoryKey; label: string }>> => {
  const builtIn = [...CATEGORY_OPTIONS];
  if (typeof window === "undefined") return builtIn;
  const custom = await getCustomBrackets();
  const customOptions = custom.map((b) => ({
    value: b.id as CategoryKey,
    label: b.name,
  }));
  return [...builtIn, ...customOptions];
};

const ORDERED_MATCH_IDS: MatchId[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

const emptyMatches = (): Matches =>
  ORDERED_MATCH_IDS.reduce((acc, id) => {
    acc[id] = [null, null];
    return acc;
  }, {} as Matches);

const shuffle = <T,>(input: readonly T[]): T[] => {
  const arr = input.slice();
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const sampleTen = (pool: readonly string[]): string[] => {
  const picks = shuffle(pool);
  return picks.slice(0, Math.min(10, picks.length));
};

const getCustomBracketById = (id: string): CustomBracket | null => {
  if (typeof window === "undefined") return null;
  // Use sync version for server-side rendering compatibility
  const custom = getCustomBracketsSync();
  return custom.find((b) => b.id === id) ?? null;
};

export const modeFor = (cat: CategoryKey): Mode => {
  // Check for custom bracket first (including overrides of built-in brackets)
  const custom = getCustomBracketById(cat);
  if (custom) {
    return custom.mode;
  }
  
  // Built-in bracket modes
  if (cat === "guy") return 11;
  if (
    cat === "girl" ||
    cat === "fwds" ||
    cat === "str" ||
    cat === "mids" ||
    cat === "defs" ||
    cat === "gks" ||
    cat === "matters"
  ) {
    return 12;
  }
  return 10;
};

export const labelFor = (cat: CategoryKey): string => {
  // Check for custom bracket first (including overrides of built-in brackets)
  const custom = getCustomBracketById(cat);
  if (custom) {
    return custom.name;
  }
  return (
    {
      fizzy: "Top Fizzy Drinks",
      choc: "Top Chocolate Bars",
      sweets: "Top UK Sweets",
      rnb: "Top 10 R&B Artists",
      pop: "Top 10 Pop Artists",
      guy: "Type of Guy You Like",
      girl: "Type of Girl You Like",
      matters: "What Matters Most (Top 12)",
      fwds: "Forwards (Top 12)",
      str: "Strikers (Top 12)",
      mids: "Midfielders (Top 12)",
      defs: "Defenders (Top 12)",
      gks: "Goalkeepers (Top 12)",
    }[cat] ?? "Top 10"
  );
};

export const roundName = (id: MatchId): string => {
  if (id === 1 || id === 2 || id === 10 || id === 11) return "Play-In";
  if (id <= 6) return "Quarter Final";
  if (id <= 8) return "Semi Final";
  return "Final";
};

const ORDER_FOR_10: MatchId[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const orderForMode = (mode: Mode): MatchId[] => {
  if (mode === 8) return ORDER_8;
  if (mode === 10) return ORDER_FOR_10;
  return ORDER;
};

export const totalMatchesForMode = (mode: Mode): number => orderForMode(mode).length;

export const getFlowForMode = (mode: Mode): FlowMap => {
  if (mode === 8) return FLOW_8;
  return FLOW;
};

const buildMatchesForMode = (mode: Mode, picks: string[]): Matches => {
  const matches = emptyMatches();

  if (mode === 8) {
    matches[1] = [picks[0] ?? null, picks[1] ?? null];
    matches[2] = [picks[2] ?? null, picks[3] ?? null];
    matches[3] = [picks[4] ?? null, picks[5] ?? null];
    matches[4] = [picks[6] ?? null, picks[7] ?? null];
    matches[5] = [null, null];
    matches[6] = [null, null];
    matches[7] = [null, null];
    return matches;
  }

  if (mode === 10) {
    matches[1] = [picks[0] ?? null, picks[1] ?? null];
    matches[2] = [picks[2] ?? null, picks[3] ?? null];
    matches[3] = [null, picks[4] ?? null];
    matches[4] = [null, picks[5] ?? null];
    matches[5] = [picks[6] ?? null, picks[7] ?? null];
    matches[6] = [picks[8] ?? null, picks[9] ?? null];
    matches[7] = [null, null];
    matches[8] = [null, null];
    matches[9] = [null, null];
    matches[10] = [null, null];
    matches[11] = [null, null];
    return matches;
  }

  matches[1] = [picks[0] ?? null, picks[1] ?? null];
  matches[2] = [picks[2] ?? null, picks[3] ?? null];
  matches[10] = [picks[4] ?? null, picks[5] ?? null];
  matches[11] = [picks[6] ?? null, picks[7] ?? null];
  matches[3] = [null, picks[8] ?? null];
  matches[4] = [null, picks[9] ?? null];
  matches[5] = [null, picks[10] ?? null];
  matches[6] = [null, picks[11] ?? null];

  return matches;
};

export const seedBracket = (cat: CategoryKey) => {
  const mode = modeFor(cat);
  let pool: string[] = [];
  let mustStart: string[] = [];
  let title = "";
  let poolInfo = "";

  // Check for custom bracket first (including overrides of built-in brackets)
  const custom = getCustomBracketById(cat);
  if (custom) {
    // Custom bracket found (could be override of built-in)
    pool = [...custom.options];
    mustStart = [...custom.mustStart];
    title = custom.name;
  } else if (cat.startsWith("custom-")) {
    // Custom bracket ID but not found - fallback
    pool = [...POOLS.fizzy];
    title = "Top 10 Bracket";
  } else {
    // Built-in bracket (no custom override)
    pool = [...(POOLS[cat as keyof typeof POOLS] ?? POOLS.fizzy)];
    title =
      mode === 12
        ? "Top 12 Bracket"
        : mode === 11
          ? "Top 11 Bracket"
          : mode === 8
            ? "Top 8 Bracket"
            : "Top 10 Bracket";

    // Set mustStart for built-in brackets
    if (cat === "guy") {
      mustStart = ["Tall Guy"];
    } else if (cat === "matters") {
      mustStart = ["Looks 👀", "Personality 💬"];
    } else if (cat === "girl") {
      mustStart = ["Curvy Girl", "Pretty Girl"];
    }
  }

  let picks: string[] = [];

  if (mode === 8) {
    if (mustStart.length > 0) {
      const rest = shuffle(pool.filter((item) => !mustStart.includes(item)));
      picks = [...mustStart, ...rest].slice(0, 8);
    } else {
      picks = shuffle(pool).slice(0, 8);
    }
    poolInfo = `Using all 8`;
  } else if (mode === 10) {
    if (mustStart.length > 0) {
      const rest = shuffle(pool.filter((item) => !mustStart.includes(item)));
      picks = [...mustStart, ...rest].slice(0, 10);
    } else {
      picks = sampleTen(pool);
    }
    poolInfo = `Using ${picks.length} of ${pool.length}`;
  } else if (mode === 11) {
    if (mustStart.length > 0) {
      const rest = shuffle(pool.filter((item) => !mustStart.includes(item)));
      picks = [...mustStart, ...rest].slice(0, 11);
    } else {
      picks = shuffle(pool).slice(0, 11);
    }
    picks.push(BYE);
    poolInfo = "Using all 11";
  } else {
    // mode === 12
    if (mustStart.length > 0) {
      const rest = shuffle(pool.filter((item) => !mustStart.includes(item)));
      picks = [...mustStart, ...rest].slice(0, 12);
    } else {
      picks = shuffle(pool).slice(0, 12);
    }
    poolInfo = "Using all 12";
  }

  return {
    matches: buildMatchesForMode(mode, picks),
    mode,
    poolInfo,
    title,
  };
};

const hasAdvanced = (
  matchId: MatchId,
  contender: string,
  matches: Matches,
  flowMap: FlowMap,
): boolean => {
  const flow = flowMap[matchId];
  if (!flow) return false;
  const destination = matches[flow.winnerTo];
  if (!destination) return false;
  return destination[flow.position] === contender;
};

export const getCurrentMatchId = (matches: Matches, mode: Mode): MatchId | null => {
  const order = orderForMode(mode);
  const flowMap = getFlowForMode(mode);
  for (const id of order) {
    const pair = matches[id];
    if (!pair) continue;
    const a = pair[0];
    const b = pair[1];
    if (!a || !b) continue;
    const flow = flowMap[id];
    if (!flow) {
      return id;
    }
    if (
      !hasAdvanced(id, a, matches, flowMap) &&
      !hasAdvanced(id, b, matches, flowMap)
    ) {
      return id;
    }
  }
  return null;
};

export const findAutoAdvanceMatch = (
  matches: Matches,
  mode: Mode,
): { matchId: MatchId; winner: string } | null => {
  const order = orderForMode(mode);
  const flowMap = getFlowForMode(mode);
  for (const id of order) {
    const pair = matches[id];
    if (!pair) continue;
    const [a, b] = pair;
    if (a === BYE && b && !hasAdvanced(id, b, matches, flowMap)) {
      return { matchId: id, winner: b };
    }
    if (b === BYE && a && !hasAdvanced(id, a, matches, flowMap)) {
      return { matchId: id, winner: a };
    }
  }
  return null;
};

