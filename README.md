# Snowdrop Rewards

Pump.fun dev rewards → **$SNOWDROP** holders.

This repo is a minimal Next.js (App Router) site that includes:
- **Real 15-minute round timer** (server-synced): `/api/round/current`
- **Top holders (owner-aggregated)** via Helius DAS `getTokenAccounts`
- Pagination (10 per page), refresh, and **Download TXT** export

## Setup

1. Install deps:
```bash
npm install
```

2. Add env:
```bash
cp .env.example .env
```

Set:
- `HELIUS_RPC_URL`
- `SNOWDROP_MINT` (placeholder by default)

3. Run:
```bash
npm run dev
```

Open http://localhost:3000

## Notes

- Caching is in-memory for simplicity. For production, swap to Redis/KV.
- `balanceRaw` is raw token amount (base units). Add decimals formatting later if desired.

## Social

X: https://x.com/snowdropsol

---

![Snowdrop](public/snowdrop.png)
