import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Snowdrop Rewards",
  description: "Pump.fun dev rewards → $SNOWDROP holders",
  icons: [{ rel: "icon", url: "/snowdrop.png" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial" }}>
        {children}
      </body>
    </html>
  );
}
