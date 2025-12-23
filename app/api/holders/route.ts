import { NextResponse } from "next/server";
import { getSnapshot } from "@/lib/holders";

export const runtime = "nodejs";

function mask(addr: string) {
  return addr.slice(0, 4) + "…" + addr.slice(-4);
}

export async function GET(req: Request) {
  const url = new URL(req.url);

  const mint = url.searchParams.get("mint") || undefined;
  const page = Math.max(1, Number(url.searchParams.get("page") || "1"));
  const pageSize = Math.min(100, Math.max(1, Number(url.searchParams.get("pageSize") || "10")));
  const refresh = url.searchParams.get("refresh") === "1";

  const snap = await getSnapshot(mint, refresh);

  const total = snap.holdersSorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);

  const start = (safePage - 1) * pageSize;
  const slice = snap.holdersSorted.slice(start, start + pageSize);

  const holders = slice.map((h, i) => ({
    rank: start + i + 1,
    owner: h.owner,
    ownerShort: mask(h.owner),
    balanceRaw: h.balanceRaw,
  }));

  return NextResponse.json({
    mint: snap.key,
    updatedAt: snap.updatedAtIso,
    snapshotHash: snap.snapshotHash,
    page: safePage,
    pageSize,
    total,
    totalPages,
    holders,
  });
}
