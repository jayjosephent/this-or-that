"use client";

import { useCallback, useState, useEffect } from "react";
import Link from "next/link";

import {
  getAllCategoryOptions,
  getAllCategoryOptionsAsync,
  CategoryKey,
  getFlowForMode,
  MatchId,
  Matches,
  Mode,
  orderForMode,
  findAutoAdvanceMatch,
  getCurrentMatchId,
  roundName,
  seedBracket,
} from "@/lib/bracket";

const pushWinner = (state: Matches, matchId: MatchId, winner: string, mode: Mode) => {
  const next: Matches = { ...state };
  let champion: string | null = null;
  const flowMap = getFlowForMode(mode);
  const finalMatchId: MatchId = mode === 8 ? 7 : 9;

  if (matchId === finalMatchId) {
    next[finalMatchId] = [winner];
    champion = winner;
  }

  const route = flowMap[matchId];
  if (route) {
    const destination = state[route.winnerTo];
    const updatedDestination = [...destination];
    updatedDestination[route.position] = winner;
    next[route.winnerTo] = updatedDestination;
  }

  return { matches: next, champion };
};

const resolveByes = (state: Matches, mode: Mode) => {
  let snapshot = state;
  const autoWinners: string[] = [];

  while (true) {
    const autoMatch = findAutoAdvanceMatch(snapshot, mode);
    if (!autoMatch) break;
    const result = pushWinner(snapshot, autoMatch.matchId, autoMatch.winner, mode);
    autoWinners.push(autoMatch.winner);
    snapshot = result.matches;
    if (result.champion) break;
  }

  return { matches: snapshot, autoWinners };
};

const getChampionName = (matches: Matches, mode: Mode): string | null => {
  const finalMatchId: MatchId = mode === 8 ? 7 : 9;
  const final = matches[finalMatchId];
  if (Array.isArray(final) && final.length === 1 && final[0]) {
    return final[0];
  }
  return null;
};

const formatPlaceholder = (value: string | null) => value ?? "—";

export default function Home() {
  const [category, setCategory] = useState<CategoryKey>("fizzy");
  const [categoryOptions, setCategoryOptions] = useState(() => getAllCategoryOptions());
  const seeded = seedBracket(category);
  const [matches, setMatches] = useState<Matches>(() => {
    const resolved = resolveByes(seeded.matches, seeded.mode);
    return resolved.matches;
  });
  const [mode, setMode] = useState<Mode>(seeded.mode);
  const [title, setTitle] = useState(seeded.title);
  const [poolInfo, setPoolInfo] = useState(seeded.poolInfo);
  const [status, setStatus] = useState("Ready.");

  // Load categories asynchronously to include custom brackets
  useEffect(() => {
    getAllCategoryOptionsAsync().then(setCategoryOptions).catch(() => {
      // Fallback to sync version on error
    });
  }, []);

  const matchOrder = orderForMode(mode);
  const totalMatches = matchOrder.length;
  const champion = getChampionName(matches, mode);
  const tentativeMatchId = champion ? null : getCurrentMatchId(matches, mode);
  const currentMatchId = champion ? null : tentativeMatchId;
  const activePair = currentMatchId ? matches[currentMatchId] : null;

  const reseed = useCallback((cat: CategoryKey) => {
    const seeded = seedBracket(cat);
    const resolved = resolveByes(seeded.matches, seeded.mode);
    setMatches(resolved.matches);
    setMode(seeded.mode);
    setTitle(seeded.title);
    setPoolInfo(seeded.poolInfo);
    const seededChampion = getChampionName(resolved.matches, seeded.mode);
    setStatus(seededChampion ? `🏆 ${seededChampion} wins it all!` : "Ready.");
  }, []);

  const handlePick = useCallback(
    (matchId: MatchId, winner: string | null) => {
      if (!winner) return;

      let championCandidate: string | null = null;
      const autoMessages: string[] = [];

      setMatches((prev) => {
        const result = pushWinner(prev, matchId, winner, mode);
        championCandidate = result.champion;
        let updatedMatches = result.matches;

        if (!championCandidate) {
          const resolved = resolveByes(updatedMatches, mode);
          updatedMatches = resolved.matches;
          const resolvedChampion = getChampionName(updatedMatches, mode);
          championCandidate = resolvedChampion;
          if (resolved.autoWinners.length) {
            autoMessages.push(
              ...resolved.autoWinners.map((name) => `Auto-advanced ${name}`),
            );
          }
        } else {
          championCandidate = getChampionName(updatedMatches, mode) ?? championCandidate;
        }

        return updatedMatches;
      });

      if (championCandidate) {
        setStatus(`🏆 ${championCandidate} wins it all!`);
        return;
      }

      if (autoMessages.length) {
        setStatus([`Picked ${winner}`, ...autoMessages].join(" → "));
        return;
      }

      setStatus(`Picked ${winner}`);
    },
    [mode],
  );

  const onCategoryChange = (value: CategoryKey) => {
    setCategory(value);
    reseed(value);
  };

  const onReset = () => {
    reseed(category);
  };

  const roundLabel = champion
    ? "Champion"
    : currentMatchId
      ? roundName(currentMatchId)
      : "Waiting…";
  const progressLabel = champion
    ? "Done"
    : currentMatchId
      ? `Match ${matchOrder.indexOf(currentMatchId) + 1} of ${totalMatches}`
      : "All set";

  return (
    <div className="wrap">
      <header className="header">
        <div className="title">{title}</div>
        <select
          className="category-select"
          value={category}
          onChange={(event) => onCategoryChange(event.target.value as CategoryKey)}
        >
          {categoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="chip">{poolInfo}</span>
        <div className="spacer" />
        <Link href="/admin" className="btn small" style={{ textDecoration: "none" }}>
          Admin
        </Link>
        <button type="button" className="btn small" onClick={onReset}>
          Reset
        </button>
      </header>

      <div className="stage">
        <div>{roundLabel}</div>
        <div>{progressLabel}</div>
      </div>

      <div className="arena">
        {champion ? (
          <div className="card champ">🏆 {champion}</div>
        ) : currentMatchId && activePair ? (
          <>
            <button
              type="button"
              className="card"
              onClick={() => handlePick(currentMatchId, activePair[0])}
              disabled={!activePair[0]}
            >
              {formatPlaceholder(activePair[0])}
            </button>
            <div className="vs">tap a winner</div>
            <button
              type="button"
              className="card"
              onClick={() => handlePick(currentMatchId, activePair[1])}
              disabled={!activePair[1]}
            >
              {formatPlaceholder(activePair[1])}
            </button>
          </>
        ) : (
          <>
            <div className="card">—</div>
            <div className="vs">tap a winner</div>
            <div className="card">—</div>
          </>
        )}
      </div>

      <footer className="footer">
        <div>{status}</div>
        <div className="spacer" />
      </footer>
    </div>
  );
}
