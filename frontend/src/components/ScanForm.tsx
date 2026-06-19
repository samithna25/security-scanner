import { Globe, Loader2, Search } from "lucide-react";
import { useState } from "react";
import { scanWebsite, validateUrl, type ScanResult } from "@/lib/scan";

interface Props {
  onResult: (result: ScanResult) => void;
}

export function ScanForm({ onResult }: Props) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!validateUrl(url)) {
      setError("Please enter a valid website URL");
      return;
    }
    setLoading(true);
    try {
      const result = await scanWebsite(url);
      onResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scan failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={`relative glass rounded-2xl p-2 sm:p-2.5 overflow-hidden ${loading ? "scan-line" : ""}`}>
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
          <div className="flex min-w-0 items-center gap-3 pl-3 sm:pl-4">
            <Globe className="h-5 w-5 shrink-0 text-cyber-cyan" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              disabled={loading}
              className="min-w-0 flex-1 bg-transparent py-3 sm:py-4 text-base sm:text-lg font-mono outline-none placeholder:text-muted-foreground/60 disabled:opacity-50"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-cyber shrink-0 rounded-xl px-4 sm:px-6 py-3 sm:py-3.5 text-sm sm:text-base flex items-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /><span className="hidden sm:inline">Scanning…</span></>
            ) : (
              <><Search className="h-4 w-4" /><span>Scan Website</span></>
            )}
          </button>
        </div>
      </div>
      {error && <p className="mt-3 text-sm text-cyber-danger pl-2">{error}</p>}
      <p className="mt-3 text-xs text-muted-foreground pl-2">
        Try: <button type="button" onClick={() => setUrl("https://github.com")} className="text-cyber-cyan hover:underline font-mono">github.com</button>
        {" · "}
        <button type="button" onClick={() => setUrl("http://login-verify-bank.example")} className="text-cyber-cyan hover:underline font-mono">login-verify-bank.example</button>
      </p>
    </form>
  );
}
