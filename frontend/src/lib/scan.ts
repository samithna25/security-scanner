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
  tags?: string[];
  scannedAt: string;
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

  const response = await fetch("http://localhost:5000/api/scan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: normalized }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to scan website");
  }

  return response.json();
}
