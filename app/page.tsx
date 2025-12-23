import Image from "next/image";
import { RoundTimer } from "@/components/Timer";
import { HoldersTable } from "@/components/HoldersTable";

export default function Page() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "28px 18px 60px",
        background: "linear-gradient(180deg, #6fb0e5 0%, #8fc0ea 45%, #d8efff 100%)",
        color: "#0b1f33",
      }}
    >
      <header style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Image src="/snowdrop.png" alt="Snowdrop" width={36} height={36} />
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: 0.2 }}>Snowdrop</div>
            <div style={{ fontSize: 12, opacity: 0.75 }}>Rewards System</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <a href="https://x.com/snowdropsol" target="_blank" rel="noreferrer" style={linkBtn}>
            X: @snowdropsol
          </a>
          <a href="#" style={primaryBtn}>buy $SNOWDROP</a>
          <a href="#" style={linkBtn}>connect wallet</a>
        </div>
      </header>

      <section style={{ maxWidth: 1100, margin: "40px auto 0", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          <Image src="/snowdrop.png" alt="Snowdrop Logo" width={140} height={140} />
        </div>

        <h1 style={{ margin: "18px 0 8px", fontSize: 64, lineHeight: 1.0, fontWeight: 900, color: "rgba(255,255,255,0.95)", textShadow: "0 10px 30px rgba(0,0,0,0.20)" }}>
          Snowdrop Rewards
        </h1>

        <p style={{ margin: 0, fontSize: 22, color: "rgba(255,255,255,0.85)", textShadow: "0 10px 28px rgba(0,0,0,0.18)" }}>
          pump.fun dev rewards → $SNOWDROP holders
        </p>
      </section>

      <section style={{ maxWidth: 1100, margin: "34px auto 0", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
        <RoundTimer />
        <div style={{ padding: 18, borderRadius: 16, background: "rgba(255,255,255,0.45)", backdropFilter: "blur(8px)" }}>
          <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 6 }}>How it works</div>
          <div style={{ fontSize: 14, lineHeight: 1.55 }}>
            <div>1) claim pump.fun dev fees</div>
            <div>2) snapshot $SNOWDROP holders</div>
            <div>3) pick 10 wallets</div>
            <div>4) split pool 10 ways</div>
            <div>5) send SOL direct</div>
          </div>
          <div style={{ marginTop: 12, fontSize: 12, opacity: 0.75 }}>
            No staking. No lock. No manual claims.
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1100, margin: "16px auto 0" }}>
        <HoldersTable pageSize={10} />
      </section>

      <footer style={{ maxWidth: 1100, margin: "22px auto 0", fontSize: 12, opacity: 0.7 }}>
        Mint shown is controlled by <code>SNOWDROP_MINT</code> (currently a placeholder). Replace after deploy.
      </footer>
    </main>
  );
}

const linkBtn: React.CSSProperties = {
  border: "1px solid rgba(0,0,0,0.12)",
  background: "rgba(255,255,255,0.55)",
  borderRadius: 14,
  padding: "10px 14px",
  textDecoration: "none",
  color: "#0b1f33",
  fontSize: 13,
  fontWeight: 700,
};

const primaryBtn: React.CSSProperties = {
  border: "1px solid rgba(0,0,0,0.12)",
  background: "rgba(10, 70, 130, 0.85)",
  color: "white",
  borderRadius: 14,
  padding: "10px 14px",
  textDecoration: "none",
  fontSize: 13,
  fontWeight: 800,
};
