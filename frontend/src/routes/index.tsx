import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { ScanForm } from "@/components/ScanForm";
import { ResultCard } from "@/components/ResultCard";
import { HistoryTable } from "@/components/HistoryTable";
import { getHistory, type ScanResult } from "@/lib/scan";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CloudSec Scanner — Scan any website for security risks" },
      { name: "description", content: "Get an instant security risk score for any URL: SSL validation, suspicious pattern detection, and recommendations." },
      { property: "og:title", content: "CloudSec Scanner" },
      { property: "og:description", content: "Instant website security risk assessment." },
    ],
  }),
  component: Home,
});

function Home() {
  const [result, setResult] = useState<ScanResult | null>(null);
  const [history, setHistory] = useState<ScanResult[]>([]);

  useEffect(() => { setHistory(getHistory()); }, [result]);

  return (
    <main>
      {/* Hero + Scan */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg pointer-events-none" />
        <div className="relative mx-auto max-w-3xl px-6 pt-20 pb-16 sm:pt-28 sm:pb-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-cyber-success animate-ping opacity-75" />
              <span className="relative h-2 w-2 rounded-full bg-cyber-success" />
            </span>
            Live Threat Intelligence Engine
          </div>

          <div className="mx-auto mb-8 grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-cyber-blue to-cyber-purple shadow-[0_0_60px_rgba(124,58,237,0.45)] float-slow">
            <ShieldCheck className="h-10 w-10 text-[#0B1120]" strokeWidth={2.5} />
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-bold leading-[1.05] tracking-tight">
            Scan any website for
            <span className="block text-gradient-cyber">security risks in seconds.</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
            Inspect SSL configuration, suspicious patterns, and infrastructure signals — get an actionable risk score instantly.
          </p>

          <div className="mt-10 text-left">
            <ScanForm onResult={setResult} />
          </div>
        </div>
      </section>

      {/* Result */}
      {result && (
        <section className="mx-auto max-w-5xl px-6 -mt-4 mb-20">
          <ResultCard result={result} />
        </section>
      )}

      {/* History */}
      <section className="mx-auto max-w-7xl px-6 py-16 border-t border-white/5">
        <div className="mb-6">
          <div className="text-xs uppercase tracking-[0.25em] text-cyber-cyan mb-2">Activity</div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold">Scan History</h2>
          <p className="text-muted-foreground mt-1 text-sm">{history.length} scan{history.length === 1 ? "" : "s"} recorded</p>
        </div>
        <HistoryTable items={history} />
      </section>

      <footer className="border-t border-white/5 py-8 text-center text-xs text-muted-foreground">
        CloudSec Scanner · Built for cloud security research
      </footer>
    </main>
  );
}
