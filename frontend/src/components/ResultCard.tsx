import { AlertTriangle, CheckCircle2, Lock, ShieldAlert, ShieldCheck, ShieldX, Sparkles } from "lucide-react";
import type { RiskLevel, ScanResult } from "@/lib/scan";

const riskStyles: Record<RiskLevel, { color: string; bg: string; ring: string; icon: typeof ShieldCheck }> = {
  Low: { color: "text-cyber-success", bg: "bg-cyber-success/10", ring: "ring-cyber-success/40", icon: ShieldCheck },
  Medium: { color: "text-cyber-warn", bg: "bg-cyber-warn/10", ring: "ring-cyber-warn/40", icon: ShieldAlert },
  High: { color: "text-cyber-danger", bg: "bg-cyber-danger/10", ring: "ring-cyber-danger/40", icon: ShieldX },
};

function ScoreGauge({ score, risk }: { score: number; risk: RiskLevel }) {
  const r = 70;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const stroke = risk === "Low" ? "var(--cyber-success)" : risk === "Medium" ? "var(--cyber-warn)" : "var(--cyber-danger)";

  return (
    <div className="relative grid place-items-center">
      <svg width="180" height="180" viewBox="0 0 180 180" className="-rotate-90">
        <circle cx="90" cy="90" r={r} stroke="oklch(1 0 0 / 0.08)" strokeWidth="12" fill="none" />
        <circle
          cx="90" cy="90" r={r}
          stroke={stroke}
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.2s ease-out", filter: `drop-shadow(0 0 8px ${stroke})` }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="font-display text-5xl font-bold tabular-nums">{score}</div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mt-1">Score / 100</div>
        </div>
      </div>
    </div>
  );
}

export function ResultCard({ result }: { result: ScanResult }) {
  const r = riskStyles[result.risk];
  const RiskIcon = r.icon;

  return (
    <div className="glass rounded-3xl p-6 sm:p-8 animate-fade-in">
      {/* Header */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 mb-6">
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1.5">Scanned Target</div>
          <h2 className="truncate font-mono text-lg sm:text-xl font-semibold">{result.url}</h2>
          <div className="text-xs text-muted-foreground mt-1.5">{new Date(result.scannedAt).toLocaleString()}</div>
        </div>
        <div className={`shrink-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-full ring-1 ${r.bg} ${r.ring} ${r.color} font-semibold text-sm`}>
          <RiskIcon className="h-4 w-4" />
          {result.risk} Risk
        </div>
      </div>

      {/* Body */}
      <div className="grid lg:grid-cols-[auto_1fr] gap-8 items-center lg:items-start">
        <ScoreGauge score={result.score} risk={result.risk} />

        <div className="grid sm:grid-cols-2 gap-3 w-full">
          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-2">
              <Lock className="h-3.5 w-3.5" /> SSL Certificate
            </div>
            <div className={`font-semibold ${result.ssl.valid ? "text-cyber-success" : "text-cyber-danger"}`}>
              {result.ssl.valid ? "Valid & Trusted" : "Invalid / Missing"}
            </div>
            <div className="text-xs text-muted-foreground mt-1">{result.ssl.issuer} · {result.ssl.expiresInDays}d left</div>
          </div>
          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-2">
              <Sparkles className="h-3.5 w-3.5" /> Risk Level
            </div>
            <div className={`font-semibold ${r.color}`}>{result.risk}</div>
            <div className="text-xs text-muted-foreground mt-1">Based on {result.findings.length} checks</div>
          </div>
        </div>
      </div>

      {/* Findings */}
      <div className="mt-8">
        <h3 className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-3">Security Findings</h3>
        <div className="space-y-2">
          {result.findings.map((f, i) => {
            const fs = riskStyles[f.severity];
            const Icon = f.severity === "Low" ? CheckCircle2 : AlertTriangle;
            return (
              <div key={i} className="glass rounded-xl p-4 flex gap-3 items-start">
                <div className={`shrink-0 grid h-8 w-8 place-items-center rounded-lg ${fs.bg}`}>
                  <Icon className={`h-4 w-4 ${fs.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold">{f.title}</span>
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${fs.bg} ${fs.color}`}>{f.severity}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{f.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-8">
        <h3 className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-3">Recommendations</h3>
        <ul className="grid sm:grid-cols-2 gap-2">
          {result.recommendations.map((rec, i) => (
            <li key={i} className="glass rounded-xl p-4 flex gap-3 items-start text-sm">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-cyber-cyan mt-0.5" />
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
