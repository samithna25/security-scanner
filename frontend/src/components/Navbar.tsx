import { Link } from "@tanstack/react-router";
import { Shield } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0B1120]/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyber-blue to-cyber-purple shadow-[0_0_20px_rgba(99,179,237,0.4)] group-hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-shadow">
            <Shield className="h-5 w-5 text-[#0B1120]" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <div className="font-display font-bold text-base tracking-tight">Sky<span className="text-gradient-cyber">Secure</span></div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Scan. Detect. Protect.</div>
          </div>
        </Link>
      </div>
    </header>
  );
}
