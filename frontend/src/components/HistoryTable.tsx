import { ArrowUpDown, ShieldOff } from "lucide-react";
import { useMemo, useState } from "react";
import type { RiskLevel, ScanResult } from "@/lib/scan";

const riskBadge: Record<RiskLevel, string> = {
  Low: "bg-cyber-success/10 text-cyber-success ring-cyber-success/30",
  Medium: "bg-cyber-warn/10 text-cyber-warn ring-cyber-warn/30",
  High: "bg-cyber-danger/10 text-cyber-danger ring-cyber-danger/30",
};

type SortKey = "scannedAt" | "score" | "url";

export function HistoryTable({ items }: { items: ScanResult[] }) {
  const [query, setQuery] = useState("");
  const [risk, setRisk] = useState<"All" | RiskLevel>("All");
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "scannedAt", dir: "desc" });

  const filtered = useMemo(() => {
    let out = items.filter((i) => i.url.toLowerCase().includes(query.toLowerCase()));
    if (risk !== "All") out = out.filter((i) => i.risk === risk);
    out = [...out].sort((a, b) => {
      const dir = sort.dir === "asc" ? 1 : -1;
      if (sort.key === "score") return (a.score - b.score) * dir;
      if (sort.key === "url") return a.url.localeCompare(b.url) * dir;
      return (new Date(a.scannedAt).getTime() - new Date(b.scannedAt).getTime()) * dir;
    });
    return out;
  }, [items, query, risk, sort]);

  function toggleSort(key: SortKey) {
    setSort((s) => ({ key, dir: s.key === key && s.dir === "desc" ? "asc" : "desc" }));
  }

  if (items.length === 0) {
    return (
      <div className="glass rounded-3xl p-12 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-2xl bg-white/5 mb-4 float-slow">
          <ShieldOff className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="font-display text-xl font-semibold">No scans yet</h3>
        <p className="text-muted-foreground mt-2 text-sm">Run your first security scan to see results here.</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-3xl overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-white/5 grid sm:grid-cols-[1fr_auto] gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search URL…"
          className="bg-white/5 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-cyber-cyan/40 placeholder:text-muted-foreground/60"
        />
        <div className="flex gap-1 bg-white/5 rounded-xl p-1">
          {(["All", "Low", "Medium", "High"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRisk(r)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${risk === r ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-white/5">
              <th className="px-5 py-3"><button onClick={() => toggleSort("url")} className="flex items-center gap-1 hover:text-foreground">URL <ArrowUpDown className="h-3 w-3" /></button></th>
              <th className="px-5 py-3"><button onClick={() => toggleSort("score")} className="flex items-center gap-1 hover:text-foreground">Score <ArrowUpDown className="h-3 w-3" /></button></th>
              <th className="px-5 py-3">Risk</th>
              <th className="px-5 py-3"><button onClick={() => toggleSort("scannedAt")} className="flex items-center gap-1 hover:text-foreground">Date <ArrowUpDown className="h-3 w-3" /></button></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((i) => (
              <tr key={i.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors">
                <td className="px-5 py-4 font-mono max-w-xs truncate">{i.url}</td>
                <td className="px-5 py-4 tabular-nums font-semibold">{i.score}</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ${riskBadge[i.risk]}`}>{i.risk}</span>
                </td>
                <td className="px-5 py-4 text-muted-foreground whitespace-nowrap">{new Date(i.scannedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
