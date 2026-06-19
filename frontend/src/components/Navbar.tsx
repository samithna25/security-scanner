import { Link } from "@tanstack/react-router";
import { Shield, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/", label: "Home" },
    { to: "/history", label: "Scan History" },
  ] as const;

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0B1120]/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyber-blue to-cyber-purple shadow-[0_0_20px_rgba(99,179,237,0.4)] group-hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-shadow">
            <Shield className="h-5 w-5 text-[#0B1120]" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <div className="font-display font-bold text-base tracking-tight">CloudSec<span className="text-gradient-cyber">Scanner</span></div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Threat Intelligence</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-4 py-2 text-sm font-medium text-muted-foreground rounded-lg hover:text-foreground hover:bg-white/5 transition-colors"
              activeProps={{ className: "px-4 py-2 text-sm font-medium text-foreground rounded-lg bg-white/5" }}
            >
              {l.label}
            </Link>
          ))}
          <Link to="/" className="ml-3 btn-cyber rounded-lg px-4 py-2 text-sm">Start Scan</Link>
        </nav>

        <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg hover:bg-white/5">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/5 px-6 py-4 flex flex-col gap-1">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="px-3 py-2 rounded-lg hover:bg-white/5 text-sm">
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
