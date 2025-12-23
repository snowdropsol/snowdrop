"use client";

import { useEffect, useMemo, useState } from "react";

type Holder = { rank: number; owner: string; ownerShort: string; balanceRaw: string };
type HoldersResp = {
  mint: string;
  updatedAt: string;
  snapshotHash: string;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  holders: Holder[];
};

export function HoldersTable({ pageSize = 10 }: { pageSize?: number }) {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<HoldersResp | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load(opts?: { refresh?: boolean; newPage?: number }) {
    const p = opts?.newPage ?? page;
    const refresh = opts?.refresh ? "&refresh=1" : "";
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(`/api/holders?page=${p}&pageSize=${pageSize}${refresh}`, { cache: "no-store" });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j = (await r.json()) as HoldersResp;
      setData(j);
      setPage(j.page);
    } catch (e: any) {
      setError(e?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load({ newPage: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize]);

  const canPrev = (data?.page ?? 1) > 1;
  const canNext = (data?.page ?? 1) < (data?.totalPages ?? 1);

  const downloadUrl = useMemo(() => `/api/holders/export`, []);

  return (
    <div style={{ padding: 18, borderRadius: 16, background: "rgba(255,255,255,0.45)", backdropFilter: "blur(8px)" }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 13, opacity: 0.8 }}>Top holders</div>
          <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>
            Updated: <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>{data?.updatedAt ?? "—"}</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            onClick={() => load({ refresh: true, newPage: 1 })}
            style={btnStyle}
            disabled={loading}
            title="Force refresh snapshot"
          >
            Refresh
          </button>

          <a href={downloadUrl} style={{ ...btnStyle, textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
            Download TXT
          </a>
        </div>
      </div>

      <div style={{ marginTop: 14, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
              <th style={th}>#</th>
              <th style={th}>Wallet</th>
              <th style={th}>Balance (raw)</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} style={{ padding: 14, opacity: 0.75 }}>Loading…</td></tr>
            ) : error ? (
              <tr><td colSpan={3} style={{ padding: 14, color: "#8b1d1d" }}>{error}</td></tr>
            ) : data?.holders?.length ? (
              data.holders.map((h) => (
                <tr key={h.owner} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                  <td style={tdMono}>{h.rank}</td>
                  <td style={tdMono} title={h.owner}>{h.ownerShort}</td>
                  <td style={tdMono}>{h.balanceRaw}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={3} style={{ padding: 14, opacity: 0.75 }}>No holders found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12, flexWrap: "wrap" }}>
        <button style={btnStyle} onClick={() => load({ newPage: 1 })} disabled={loading || (data?.page === 1)}>
          First
        </button>
        <button style={btnStyle} onClick={() => load({ newPage: (data?.page ?? 1) - 1 })} disabled={loading || !canPrev}>
          Prev
        </button>
        <div style={{ padding: "8px 10px", fontSize: 12, opacity: 0.8 }}>
          Page <b>{data?.page ?? 1}</b> / {data?.totalPages ?? 1}
        </div>
        <button style={btnStyle} onClick={() => load({ newPage: (data?.page ?? 1) + 1 })} disabled={loading || !canNext}>
          Next
        </button>
        <button style={btnStyle} onClick={() => load({ newPage: data?.totalPages ?? 1 })} disabled={loading || (data?.page === (data?.totalPages ?? 1))}>
          Last
        </button>
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  border: "1px solid rgba(0,0,0,0.12)",
  background: "rgba(255,255,255,0.7)",
  borderRadius: 12,
  padding: "8px 12px",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 600,
};

const th: React.CSSProperties = { padding: "10px 8px", fontSize: 12, opacity: 0.75 };
const tdMono: React.CSSProperties = { padding: "10px 8px", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" };
