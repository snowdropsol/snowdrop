import { NextResponse } from "next/server";

export const runtime = "nodejs";

const ROUND_SECONDS = 15 * 60;

function toIso(tsSec: number) {
  return new Date(tsSec * 1000).toISOString();
}

export async function GET() {
  const nowSec = Math.floor(Date.now() / 1000);

  // next 15-min boundary
  const roundEndSec = Math.ceil(nowSec / ROUND_SECONDS) * ROUND_SECONDS;
  const roundStartSec = roundEndSec - ROUND_SECONDS;
  const roundId = Math.floor(roundStartSec / ROUND_SECONDS);

  return NextResponse.json({
    serverNowSec: nowSec,
    roundId,
    roundStartAt: toIso(roundStartSec),
    roundEndAt: toIso(roundEndSec),
    secondsLeft: roundEndSec - nowSec,
    lastRound: null, // wire this later when you add real payout rounds + DB
  });
}
