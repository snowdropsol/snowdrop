import { NextResponse } from "next/server";
import { getSnapshot } from "@/lib/holders";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const mint = url.searchParams.get("mint") || undefined;
  const refresh = url.searchParams.get("refresh") === "1";

  const snap = await getSnapshot(mint, refresh);

  const lines = snap.holdersSorted.map((h) => `${h.owner} ${h.balanceRaw}`);
  const body = lines.join("\n");

  const filename = `holders_${snap.key}_${snap.updatedAtIso.replace(/[:.]/g, "-")}.txt`;

  return new NextResponse(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "content-disposition": `attachment; filename="${filename}"`,
      "cache-control": "no-store",
    },
  });
}
