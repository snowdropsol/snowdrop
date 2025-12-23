"use client";

import { useEffect, useMemo, useState } from "react";

type RoundResp = {
  serverNowSec: number;
  roundId: number;
  roundStartAt: string;
  roundEndAt: string;
  secondsLeft: number;
};

function fmt(n: number) {
  return String(n).padStart(2, "0");
}

export function RoundTimer() {
  const [loading, setLoading] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [roundEndAt, setRoundEndAt] = useState<string>("-");
  const [error, setError] = useState<string | null>(null);

  const mmss = useMemo(() => {
    const s = Math.max(0, secondsLeft);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${fmt(h)}:${fmt(m)}:${fmt(sec)}`;
  }, [secondsLeft]);

  async function sync() {
    try {
      setError(null);
      const r = await fetch("/api/round/current", { cache: "no-store" });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j = (await r.json()) as RoundResp;
      setSecondsLeft(j.secondsLeft);
      setRoundEndAt(j.roundEndAt);
      setLoading(false);
    } catch (e: any) {
      setError(e?.message || "Failed to load");
      setLoading(false);
    }
  }

  useEffect(() => {
    let alive = true;

    sync();

    const tick = setInterval(() => {
      if (!alive) return;
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);

    const resync = setInterval(() => {
      if (!alive) return;
      sync();
    }, 20000);

    return () => {
      alive = false;
      clearInterval(tick);
      clearInterval(resync);
    };
  }, []);

  return (
    <div style={{ padding: 18, borderRadius: 16, background: "rgba(255,255,255,0.45)", backdropFilter: "blur(8px)" }}>
      <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 6 }}>Next drop in</div>
      <div style={{ fontSize: 38, fontWeight: 800, letterSpacing: 1 }}>{loading ? "—" : mmss}</div>
      <div style={{ marginTop: 8, fontSize: 12, opacity: 0.75 }}>
        Ends at: <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>{roundEndAt}</span>
      </div>
      {error ? <div style={{ marginTop: 8, fontSize: 12, color: "#8b1d1d" }}>{error}</div> : null}
    </div>
  );
}
