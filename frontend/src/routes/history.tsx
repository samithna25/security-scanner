import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { HistoryTable } from "@/components/HistoryTable";
import { clearHistory, getHistory, type ScanResult } from "@/lib/scan";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Scan History — CloudSec Scanner" },
      { name: "description", content: "Audit log of all your past website security scans." },
      { property: "og:title", content: "Scan History — CloudSec Scanner" },
      { property: "og:description", content: "Audit log of past security scans." },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const [items, setItems] = useState<ScanResult[]>([]);
  useEffect(() => { setItems(getHistory()); }, []);

  function handleClear() {
    clearHistory();
    setItems([]);
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 mb-8">
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-[0.25em] text-cyber-cyan mb-2">Audit Log</div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold">Scan History</h1>
          <p className="text-muted-foreground mt-2 text-sm">{items.length} scan{items.length === 1 ? "" : "s"} recorded</p>
        </div>
        {items.length > 0 && (
          <button onClick={handleClear} className="shrink-0 inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-cyber-danger/10 hover:border-cyber-danger/30 hover:text-cyber-danger transition-colors">
            <Trash2 className="h-4 w-4" /> Clear
          </button>
        )}
      </div>
      <HistoryTable items={items} />
    </main>
  );
}
