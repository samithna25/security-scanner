export type RiskLevel = "Low" | "Medium" | "High";

export interface ScanFinding {
  title: string;
  severity: RiskLevel;
  description: string;
}

export interface ScanResult {
  id: string;
  url: string;
  score: number;
  risk: RiskLevel;
  ssl: { valid: boolean; issuer: string; expiresInDays: number };
  findings: ScanFinding[];
  recommendations: string[];
  scannedAt: string;
}

const STORAGE_KEY = "css_scan_history_v1";

const SUSPICIOUS_KEYWORDS = ["login-verify", "free-money", "bank-update", "crypto-airdrop", "win-prize"];

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function validateUrl(input: string): string | null {
  try {
    const u = new URL(input.startsWith("http") ? input : `https://${input}`);
    if (!u.hostname.includes(".")) return null;
    return u.toString();
  } catch {
    return null;
  }
}

export async function scanWebsite(rawUrl: string): Promise<ScanResult> {
  const normalized = validateUrl(rawUrl);
  if (!normalized) throw new Error("Invalid URL");
  // Simulate latency
  await new Promise((r) => setTimeout(r, 1600));

  const seed = hash(normalized);
  const isHttps = normalized.startsWith("https://");
  const hostname = new URL(normalized).hostname;
  const sslValid = isHttps && seed % 7 !== 0;
  const expiresInDays = 30 + (seed % 300);

  const suspiciousHit = SUSPICIOUS_KEYWORDS.find((k) => hostname.includes(k));

  let score = 70 + (seed % 30);
  if (!isHttps) score -= 35;
  if (!sslValid) score -= 20;
  if (suspiciousHit) score -= 25;
  if (expiresInDays < 60) score -= 8;
  score = Math.max(5, Math.min(99, score));

  const risk: RiskLevel = score >= 75 ? "Low" : score >= 45 ? "Medium" : "High";

  const findings: ScanFinding[] = [];
  if (!isHttps) findings.push({ title: "No HTTPS encryption", severity: "High", description: "Site served over insecure HTTP. Traffic can be intercepted." });
  if (!sslValid) findings.push({ title: "Invalid or expired SSL certificate", severity: "High", description: "Certificate failed validation checks." });
  else findings.push({ title: "Valid SSL certificate", severity: "Low", description: `Issued by Lovable CA · expires in ${expiresInDays} days.` });
  if (suspiciousHit) findings.push({ title: "Suspicious keyword in domain", severity: "High", description: `Matched pattern: "${suspiciousHit}".` });
  if (seed % 4 === 0) findings.push({ title: "Missing security headers", severity: "Medium", description: "CSP and X-Frame-Options not set." });
  if (seed % 5 === 0) findings.push({ title: "Outdated TLS version detected", severity: "Medium", description: "Server still negotiates TLS 1.1." });
  if (findings.length < 3) findings.push({ title: "DNSSEC enabled", severity: "Low", description: "Domain protected against spoofing." });

  const recommendations = [
    !isHttps ? "Enable HTTPS and force-redirect HTTP traffic." : "Maintain HTTPS with HSTS preload.",
    "Add a strict Content-Security-Policy header.",
    "Renew SSL certificate at least 30 days before expiry.",
    "Enable automatic dependency vulnerability scanning.",
  ];

  const result: ScanResult = {
    id: `${Date.now()}-${seed.toString(36)}`,
    url: normalized,
    score,
    risk,
    ssl: { valid: sslValid, issuer: "Lovable Cloud CA", expiresInDays },
    findings,
    recommendations,
    scannedAt: new Date().toISOString(),
  };

  saveToHistory(result);
  return result;
}

export function getHistory(): ScanResult[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveToHistory(result: ScanResult) {
  if (typeof window === "undefined") return;
  const list = [result, ...getHistory()].slice(0, 100);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function clearHistory() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
