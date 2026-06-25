import { i as TSS_SERVER_FUNCTION, l as createServerFn } from "./esm-Dova13aH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/scan-CWYDt6h3.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function validateUrl(input) {
	try {
		const u = new URL(input.startsWith("http") ? input : `https://${input}`);
		if (!u.hostname.includes(".")) return null;
		return u.toString();
	} catch {
		return null;
	}
}
var BLACKLISTED_DOMAINS = [
	"secure-bank-verify.com",
	"paypal-login-secure.net",
	"free-money-rewards.xyz",
	"account-verification-center.com",
	"bank-security-update.net",
	"claim-your-prize-now.xyz",
	"urgent-account-alert.com",
	"crypto-giveaway-bonus.net",
	"login-confirmation-center.org",
	"verify-payment-method.com",
	"secure-wallet-update.net",
	"free-gift-card-rewards.xyz",
	"customer-security-check.com",
	"update-banking-details.net",
	"instant-cash-bonus.xyz"
];
var SUSPICIOUS_KEYWORDS = [
	"login",
	"verify",
	"secure",
	"update",
	"bank",
	"password",
	"account",
	"wallet",
	"bonus",
	"gift",
	"prize",
	"reward",
	"crypto",
	"urgent",
	"payment"
];
var CATEGORIZED_SUSPICIOUS_KEYWORDS = {
	phishing: [
		"login-verify",
		"secure-login",
		"account-update",
		"verify-identity",
		"update-account",
		"auth-check",
		"signin",
		"support-verify",
		"portal-login"
	],
	financial_scams: [
		"free-money",
		"win-prize",
		"crypto-airdrop",
		"claim-bonus",
		"double-crypto",
		"giftcard-free",
		"get-rewards",
		"lottery-win"
	],
	brand_impersonation: [
		"bank-update",
		"paypal-security",
		"netflix-verify",
		"amazon-support",
		"apple-recover",
		"microsoft-login",
		"google-security"
	]
};
function cleanUrl(url) {
	url = url.trim();
	if (!url.startsWith("http://") && !url.startsWith("https://")) url = "https://" + url;
	return url;
}
function extractHostname(url) {
	const cleaned = cleanUrl(url);
	try {
		let hostname = new URL(cleaned).hostname || cleaned;
		if (hostname.includes(":")) hostname = hostname.split(":")[0];
		return hostname.toLowerCase();
	} catch {
		return cleaned.toLowerCase();
	}
}
function checkDomainKeywords(domain) {
	const domainLower = domain.toLowerCase();
	const detectedThreats = [];
	for (const [category, keywords] of Object.entries(CATEGORIZED_SUSPICIOUS_KEYWORDS)) for (const keyword of keywords) if (domainLower.includes(keyword)) {
		const severity = category === "phishing" || category === "brand_impersonation" ? "High" : "Medium";
		const categoryDisplay = category.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
		detectedThreats.push({
			keyword,
			category: categoryDisplay,
			severity,
			description: `Domain contains the suspicious term '${keyword}' which is associated with ${category.replace(/_/g, " ")}.`
		});
	}
	for (const keyword of SUSPICIOUS_KEYWORDS) if (domainLower.includes(keyword)) {
		if (!detectedThreats.some((t) => t.keyword === keyword)) {
			let severity = "Medium";
			if ([
				"login",
				"password",
				"bank",
				"crypto",
				"payment",
				"urgent"
			].includes(keyword)) severity = "High";
			detectedThreats.push({
				keyword,
				category: "Suspicious Pattern",
				severity,
				description: `Domain contains the suspicious keyword '${keyword}'.`
			});
		}
	}
	return detectedThreats;
}
async function isSimulatedTarget(domain, dns) {
	const domainLower = domain.toLowerCase();
	if (BLACKLISTED_DOMAINS.some((d) => d.toLowerCase() === domainLower)) return true;
	if (SUSPICIOUS_KEYWORDS.some((kw) => domainLower.includes(kw))) try {
		await dns.lookup(domainLower);
		return false;
	} catch {
		return true;
	}
	return false;
}
async function checkSsl(url, isSimulated, tls) {
	const hostname = extractHostname(url);
	if (isSimulated) return {
		valid: true,
		issuer: "Let's Encrypt Authority x3",
		expires_in_days: 78
	};
	return new Promise((resolve) => {
		let resolved = false;
		const socket = tls.connect({
			host: hostname,
			port: 443,
			servername: hostname,
			rejectUnauthorized: false,
			timeout: 3e3
		}, () => {
			if (resolved) return;
			resolved = true;
			try {
				const cert = socket.getPeerCertificate(true);
				if (!cert || Object.keys(cert).length === 0) {
					socket.end();
					resolve({
						valid: false,
						issuer: "None (Verification Failed)",
						expires_in_days: 0
					});
					return;
				}
				const valid = !!socket.authorized;
				const issuer = cert.issuer ? cert.issuer.O || cert.issuer.CN || "Unknown Issuer" : "Unknown Issuer";
				let expires_in_days = 0;
				if (cert.valid_to) {
					const diffTime = new Date(cert.valid_to).getTime() - Date.now();
					expires_in_days = Math.max(0, Math.floor(diffTime / (1e3 * 60 * 60 * 24)));
				}
				socket.end();
				resolve({
					valid,
					issuer,
					expires_in_days
				});
			} catch {
				socket.end();
				resolve({
					valid: false,
					issuer: "None (Verification Failed)",
					expires_in_days: 0
				});
			}
		});
		socket.on("error", () => {
			if (resolved) return;
			resolved = true;
			resolve({
				valid: false,
				issuer: "None (Verification Failed)",
				expires_in_days: 0
			});
		});
		socket.on("timeout", () => {
			if (resolved) return;
			resolved = true;
			socket.destroy();
			resolve({
				valid: false,
				issuer: "None (Verification Failed)",
				expires_in_days: 0
			});
		});
	});
}
async function fetchUrlInfo(url, isSimulated) {
	if (isSimulated) return {
		status_code: 200,
		headers: {
			"Server": "nginx/1.18.0",
			"Content-Type": "text/html; charset=UTF-8"
		},
		server: "nginx/1.18.0",
		final_url: url,
		online: true
	};
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), 5e3);
	try {
		const response = await fetch(url, {
			method: "GET",
			headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" },
			signal: controller.signal
		});
		clearTimeout(timeoutId);
		const headers = {};
		response.headers.forEach((val, key) => {
			headers[key] = val;
		});
		return {
			status_code: response.status,
			headers,
			server: headers["server"] || headers["Server"] || "Unknown",
			final_url: response.url,
			online: true
		};
	} catch (err) {
		clearTimeout(timeoutId);
		if (err.name === "AbortError") return {
			status_code: 408,
			headers: {},
			server: "Unknown",
			final_url: url,
			online: false,
			error: "Request timed out after 5 seconds."
		};
		return {
			status_code: 0,
			headers: {},
			server: "Unknown",
			final_url: url,
			online: false,
			error: "Website is unreachable or domain name does not exist."
		};
	}
}
async function checkPhishTank(url) {
	const endpoint = "https://checkurl.phishtank.com/checkurl/";
	const params = new URLSearchParams();
	params.append("url", url);
	params.append("format", "json");
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), 3e3);
	try {
		const response = await fetch(endpoint, {
			method: "POST",
			headers: {
				"User-Agent": "phishtank/SkySecure_Scanner_v1.0",
				"Content-Type": "application/x-www-form-urlencoded"
			},
			body: params,
			signal: controller.signal
		});
		clearTimeout(timeoutId);
		if (response.status === 429 || response.status === 509) return {
			in_database: false,
			error: "PhishTank API rate limit exceeded"
		};
		if (response.status !== 200) return {
			in_database: false,
			error: `API error status: ${response.status}`
		};
		const results = (await response.json()).results || {};
		return {
			in_database: !!results.in_database,
			phish_id: results.phish_id,
			phish_detail_page: results.phish_detail_page,
			verified: !!results.verified,
			valid: !!results.valid
		};
	} catch (err) {
		clearTimeout(timeoutId);
		return {
			in_database: false,
			error: err.message
		};
	}
}
var SAFE_BROWSING_THREAT_LABELS = {
	MALWARE: "Malware",
	SOCIAL_ENGINEERING: "Phishing / Social Engineering",
	UNWANTED_SOFTWARE: "Unwanted Software",
	POTENTIALLY_HARMFUL_APPLICATION: "Potentially Harmful Application"
};
async function checkGoogleSafeBrowsing(url) {
	const apiKey = process.env.GOOGLE_SAFE_BROWSING_KEY;
	if (!apiKey) return {
		threats: [],
		error: "Google Safe Browsing API key not configured"
	};
	const endpoint = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;
	const requestBody = {
		client: {
			clientId: "skysecure-scanner",
			clientVersion: "1.0"
		},
		threatInfo: {
			threatTypes: [
				"MALWARE",
				"SOCIAL_ENGINEERING",
				"UNWANTED_SOFTWARE",
				"POTENTIALLY_HARMFUL_APPLICATION"
			],
			platformTypes: ["ANY_PLATFORM"],
			threatEntryTypes: ["URL"],
			threatEntries: [{ url }]
		}
	};
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), 4e3);
	try {
		const response = await fetch(endpoint, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(requestBody),
			signal: controller.signal
		});
		clearTimeout(timeoutId);
		if (response.status === 400) return {
			threats: [],
			error: "Invalid API request (check API key or quota)"
		};
		if (!response.ok) return {
			threats: [],
			error: `Safe Browsing API error: ${response.status}`
		};
		const jsonData = await response.json();
		if (!jsonData.matches || jsonData.matches.length === 0) return { threats: [] };
		const seen = /* @__PURE__ */ new Set();
		const threats = [];
		for (const match of jsonData.matches) {
			const type = match.threatType || "UNKNOWN";
			if (!seen.has(type)) {
				seen.add(type);
				threats.push({
					type,
					label: SAFE_BROWSING_THREAT_LABELS[type] ?? type
				});
			}
		}
		return { threats };
	} catch (err) {
		clearTimeout(timeoutId);
		return {
			threats: [],
			error: err.message
		};
	}
}
var scanWebsiteServer_createServerFn_handler = createServerRpc({
	id: "5cc5658d589994a318f596f14b1289fc3c8fc7829910e7681bc0f5e9a7be83e5",
	name: "scanWebsiteServer",
	filename: "src/lib/scan.ts"
}, (opts) => scanWebsiteServer.__executeServer(opts));
var scanWebsiteServer = createServerFn({ method: "POST" }).validator((url) => url).handler(scanWebsiteServer_createServerFn_handler, async ({ data: rawUrl }) => {
	const dns = await import("node:dns/promises");
	const tls = await import("node:tls");
	const crypto = await import("node:crypto");
	const normalized = validateUrl(rawUrl);
	if (!normalized) throw new Error("Invalid URL");
	const cleaned = cleanUrl(normalized);
	const hostname = extractHostname(cleaned);
	try {
		const ip = (await dns.lookup(hostname)).address;
		for (const pattern of [
			/^127\./,
			/^10\./,
			/^172\.(?:1[6-9]|2[0-9]|3[0-1])\./,
			/^192\.168\./,
			/^0\./,
			/^169\.254\./
		]) if (pattern.test(ip)) throw new Error("Invalid or restricted website URL");
	} catch (err) {
		if (err.message === "Invalid or restricted website URL") throw err;
	}
	const isSim = await isSimulatedTarget(hostname, dns);
	const urlInfo = await fetchUrlInfo(cleaned, isSim);
	const sslInfo = await checkSsl(cleaned, isSim, tls);
	let score = 100;
	const findings = [];
	const recommendations = [];
	const tags = [];
	const isHttps = new URL(cleaned).protocol === "https:";
	if (BLACKLISTED_DOMAINS.some((d) => d.toLowerCase() === hostname.toLowerCase())) {
		score -= 90;
		findings.push({
			title: "Blacklisted Domain (Phishing / Scam)",
			severity: "High",
			description: `The domain '${hostname}' is flagged on our blacklist of simulated phishing and malicious websites.`
		});
		recommendations.push("Immediately leave this website. It is simulating a hazardous site and has been blacklisted.");
		tags.push("Blacklisted");
	}
	if (!isHttps) {
		score -= 30;
		findings.push({
			title: "Insecure Connection (No HTTPS)",
			severity: "High",
			description: "The site is served over plain HTTP. Login credentials and personal data can be intercepted by third parties."
		});
		recommendations.push("Install an SSL certificate and redirect all HTTP traffic to HTTPS.");
	} else findings.push({
		title: "Secure Connection (HTTPS Enabled)",
		severity: "Low",
		description: "The connection to this server is encrypted."
	});
	if (isHttps) if (!sslInfo.valid) {
		score -= 25;
		findings.push({
			title: "Invalid or Untrusted SSL Certificate",
			severity: "High",
			description: "The SSL certificate could not be verified. It may be expired, self-signed, or matching a different hostname."
		});
		recommendations.push("Replace or renew the invalid SSL certificate with a trusted Certificate Authority (CA).");
	} else if (sslInfo.expires_in_days < 30) {
		score -= 10;
		findings.push({
			title: "SSL Certificate expiring soon",
			severity: "Medium",
			description: `The SSL certificate expires in ${sslInfo.expires_in_days} days. If not renewed, browsers will block users.`
		});
		recommendations.push(`Renew your SSL certificate immediately (expires in ${sslInfo.expires_in_days} days).`);
	} else findings.push({
		title: "Valid SSL Certificate",
		severity: "Low",
		description: `Issued by ${sslInfo.issuer || "Trusted CA"} · expires in ${sslInfo.expires_in_days} days.`
	});
	const threatKeywords = checkDomainKeywords(hostname);
	for (const threat of threatKeywords) {
		score -= 25;
		findings.push({
			title: "Suspicious Keyword in Hostname",
			severity: threat.severity,
			description: threat.description
		});
		recommendations.push("Ensure the domain is not mimicking known brands or using credential-harvesting terms.");
		const kwTag = threat.keyword.charAt(0).toUpperCase() + threat.keyword.slice(1);
		if (!tags.includes(kwTag)) tags.push(kwTag);
	}
	const phishtankResult = await checkPhishTank(cleaned);
	if (phishtankResult.in_database && phishtankResult.valid) {
		score -= 80;
		findings.push({
			title: "Known Phishing Host (PhishTank Database)",
			severity: "High",
			description: `This URL is explicitly flagged as a verified active phishing page in the PhishTank threat database (Phish ID: ${phishtankResult.phish_id || "Unknown"}).`
		});
		if (phishtankResult.phish_detail_page) recommendations.push(`Do NOT visit this page. Review the threat details on PhishTank: ${phishtankResult.phish_detail_page}`);
		else recommendations.push("Do NOT visit or input any credentials on this page; it is a verified phishing threat.");
	}
	const safeBrowsingResult = await checkGoogleSafeBrowsing(cleaned);
	if (safeBrowsingResult.threats.length > 0) {
		score -= 85 * safeBrowsingResult.threats.length;
		const threatLabels = safeBrowsingResult.threats.map((t) => t.label).join(", ");
		findings.push({
			title: "Flagged by Google Safe Browsing",
			severity: "High",
			description: `Google's threat database has flagged this URL for the following threat(s): ${threatLabels}. This URL is actively blocked by Chrome, Firefox, and Safari.`
		});
		recommendations.push("Do NOT visit this website. It has been flagged by Google Safe Browsing as a threat to users.");
		for (const threat of safeBrowsingResult.threats) {
			const tag = threat.label;
			if (!tags.includes(tag)) tags.push(tag);
		}
	}
	const headersLower = {};
	for (const [k, v] of Object.entries(urlInfo.headers)) headersLower[k.toLowerCase()] = v;
	const missingHeaders = [];
	if (!("content-security-policy" in headersLower)) missingHeaders.push("Content-Security-Policy (CSP)");
	if (!("x-frame-options" in headersLower)) missingHeaders.push("X-Frame-Options");
	if (missingHeaders.length > 0) {
		score -= 10;
		findings.push({
			title: "Missing Security Headers",
			severity: "Medium",
			description: `The website is missing critical HTTP response headers: ${missingHeaders.join(", ")}.`
		});
		recommendations.push("Configure your web server to send Content-Security-Policy and X-Frame-Options headers.");
	}
	score = Math.max(5, Math.min(100, score));
	let risk = "Low";
	if (score >= 80) risk = "Low";
	else if (score >= 50) risk = "Medium";
	else risk = "High";
	recommendations.push("Implement a robust Content-Security-Policy (CSP) to mitigate Cross-Site Scripting (XSS) attacks.");
	const uniqueRecommendations = Array.from(new Set(recommendations));
	return {
		id: crypto.randomUUID(),
		url: cleaned,
		score,
		risk,
		ssl: {
			valid: sslInfo.valid,
			issuer: sslInfo.issuer,
			expiresInDays: sslInfo.expires_in_days
		},
		findings,
		recommendations: uniqueRecommendations,
		tags,
		scannedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
});
//#endregion
export { scanWebsiteServer_createServerFn_handler };
