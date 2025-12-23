import crypto from "crypto";

export type HolderRow = { owner: string; balanceRaw: string };

type TokenAccount = { owner?: string; amount?: string };
type RpcResp = { result?: { token_accounts?: TokenAccount[]; cursor?: string | null }; error?: any };

const HELIUS_RPC_URL = process.env.HELIUS_RPC_URL;
const DEFAULT_MINT = process.env.SNOWDROP_MINT;

const CACHE_TTL_MS = Number(process.env.HOLDERS_CACHE_TTL_MS || "90000");

let snapshotCache: {
  key: string;
  expiresAt: number;
  updatedAtIso: string;
  snapshotHash: string;
  holdersSorted: HolderRow[];
} | null = null;

async function rpc(method: string, params: any) {
  if (!HELIUS_RPC_URL) throw new Error("Missing HELIUS_RPC_URL in .env");

  const r = await fetch(HELIUS_RPC_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: "1", method, params }),
    cache: "no-store",
  });

  if (!r.ok) throw new Error(`Helius HTTP ${r.status}`);
  const j = (await r.json()) as RpcResp;
  if (j.error) throw new Error(`Helius error: ${JSON.stringify(j.error)}`);
  return j.result!;
}

export async function buildSnapshot(mint: string): Promise<{ holdersSorted: HolderRow[]; snapshotHash: string }> {
  const balances = new Map<string, bigint>();
  let cursor: string | null | undefined = null;

  while (true) {
    const params: any = { mint, limit: 1000 };
    if (cursor) params.cursor = cursor;

    const result = await rpc("getTokenAccounts", params);
    const accounts = result.token_accounts ?? [];
    cursor = result.cursor;

    for (const acc of accounts) {
      if (!acc.owner) continue;
      let amt = 0n;
      try {
        amt = BigInt(acc.amount ?? "0");
      } catch {
        amt = 0n;
      }
      if (amt <= 0n) continue;

      balances.set(acc.owner, (balances.get(acc.owner) ?? 0n) + amt);
    }

    if (!cursor || accounts.length === 0) break;
  }

  const holdersSorted: HolderRow[] = Array.from(balances.entries())
    .sort((a, b) => (a[1] > b[1] ? -1 : a[1] < b[1] ? 1 : 0))
    .map(([owner, bal]) => ({ owner, balanceRaw: bal.toString() }));

  // Deterministic snapshot hash (sha256 of normalized lines)
  const normalized = holdersSorted.map((h) => `${h.owner} ${h.balanceRaw}`).join("\n");
  const snapshotHash = crypto.createHash("sha256").update(normalized).digest("hex");

  return { holdersSorted, snapshotHash };
}

export async function getSnapshot(mint?: string, forceRefresh: boolean = false) {
  const m = mint || DEFAULT_MINT;
  if (!m) throw new Error("Missing SNOWDROP_MINT in .env (or provide ?mint=...)");

  const now = Date.now();
  const key = m;

  if (!forceRefresh && snapshotCache && snapshotCache.key === key && snapshotCache.expiresAt > now) {
    return snapshotCache;
  }

  const { holdersSorted, snapshotHash } = await buildSnapshot(m);

  snapshotCache = {
    key,
    expiresAt: now + CACHE_TTL_MS,
    updatedAtIso: new Date().toISOString(),
    snapshotHash,
    holdersSorted,
  };

  return snapshotCache;
}
