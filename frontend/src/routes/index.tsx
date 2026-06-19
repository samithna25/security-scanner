import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { ScanForm } from "@/components/ScanForm";
import { ResultCard } from "@/components/ResultCard";
import { type ScanResult } from "@/lib/scan";

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

  return (
    <main>
      {/* Hero + Scan */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg pointer-events-none" />
        <div className="relative mx-auto max-w-3xl px-6 pt-6 pb-12 sm:pt-8 sm:pb-16 text-center">
          <div className="mx-auto mb-8 grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-cyber-blue to-cyber-purple shadow-[0_0_60px_rgba(124,58,237,0.45)] float-slow">
            <ShieldCheck className="h-10 w-10 text-[#0B1120]" strokeWidth={2.5} />
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-bold leading-[1.05] tracking-tight">
            Scan any website for
            <span className="block text-gradient-cyber">security risks in seconds.</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
          SkySecure lets you check how safe a website is by scanning it for common security issues and risks. Simply enter a website URL to get an easy-to-understand security score and recommendations to help you stay safe online.          </p>

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



      <footer className="border-t border-white/5 py-8 text-center text-xs text-muted-foreground">
        CloudSec Scanner · Built for cloud security research
      </footer>
    </main>
  );
}
