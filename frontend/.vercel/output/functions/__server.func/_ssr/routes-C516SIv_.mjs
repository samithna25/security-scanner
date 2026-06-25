import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { a as ShieldCheck, c as Lock, d as CircleCheck, i as ShieldX, l as LoaderCircle, n as Sparkles, o as ShieldAlert, s as Search, t as TriangleAlert, u as Globe } from "../_libs/lucide-react.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-DUVCjjv_.mjs";
import { i as TSS_SERVER_FUNCTION, l as createServerFn } from "./esm-Dova13aH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C516SIv_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
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
var scanWebsiteServer = createServerFn({ method: "POST" }).validator((url) => url).handler(createSsrRpc("5cc5658d589994a318f596f14b1289fc3c8fc7829910e7681bc0f5e9a7be83e5"));
async function scanWebsite(rawUrl) {
	return scanWebsiteServer({ data: rawUrl });
}
function ScanForm({ onResult }) {
	const [url, setUrl] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	async function handleSubmit(e) {
		e.preventDefault();
		setError(null);
		if (!validateUrl(url)) {
			setError("Please enter a valid website URL");
			return;
		}
		setLoading(true);
		try {
			onResult(await scanWebsite(url));
		} catch (err) {
			setError(err instanceof Error ? err.message : "Scan failed");
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: handleSubmit,
		className: "w-full",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `relative glass rounded-2xl p-2 sm:p-2.5 overflow-hidden ${loading ? "scan-line" : ""}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 items-center gap-3 pl-3 sm:pl-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-5 w-5 shrink-0 text-cyber-cyan" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						value: url,
						onChange: (e) => setUrl(e.target.value),
						placeholder: "https://example.com",
						disabled: loading,
						className: "min-w-0 flex-1 bg-transparent py-3 sm:py-4 text-base sm:text-lg font-mono outline-none placeholder:text-muted-foreground/60 disabled:opacity-50"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					disabled: loading,
					className: "btn-cyber shrink-0 rounded-xl px-4 sm:px-6 py-3 sm:py-3.5 text-sm sm:text-base flex items-center gap-2 disabled:opacity-70",
					children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden sm:inline",
						children: "Scanning…"
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Scan Website" })] })
				})]
			})
		}), error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm text-cyber-danger pl-2",
			children: error
		})]
	});
}
var riskStyles = {
	Low: {
		color: "text-cyber-success",
		bg: "bg-cyber-success/10",
		ring: "ring-cyber-success/40",
		icon: ShieldCheck
	},
	Medium: {
		color: "text-cyber-warn",
		bg: "bg-cyber-warn/10",
		ring: "ring-cyber-warn/40",
		icon: ShieldAlert
	},
	High: {
		color: "text-cyber-danger",
		bg: "bg-cyber-danger/10",
		ring: "ring-cyber-danger/40",
		icon: ShieldX
	}
};
function ScoreGauge({ score, risk }) {
	const r = 70;
	const c = 2 * Math.PI * r;
	const offset = c - score / 100 * c;
	const stroke = risk === "Low" ? "var(--cyber-success)" : risk === "Medium" ? "var(--cyber-warn)" : "var(--cyber-danger)";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative grid place-items-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			width: "180",
			height: "180",
			viewBox: "0 0 180 180",
			className: "-rotate-90",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "90",
				cy: "90",
				r,
				stroke: "oklch(1 0 0 / 0.08)",
				strokeWidth: "12",
				fill: "none"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "90",
				cy: "90",
				r,
				stroke,
				strokeWidth: "12",
				fill: "none",
				strokeLinecap: "round",
				strokeDasharray: c,
				strokeDashoffset: offset,
				style: {
					transition: "stroke-dashoffset 1.2s ease-out",
					filter: `drop-shadow(0 0 8px ${stroke})`
				}
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 grid place-items-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-display text-5xl font-bold tabular-nums",
					children: score
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[11px] uppercase tracking-[0.2em] text-muted-foreground mt-1",
					children: "Score / 100"
				})]
			})
		})]
	});
}
function ResultCard({ result }) {
	const r = riskStyles[result.risk];
	const RiskIcon = r.icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "glass rounded-3xl p-6 sm:p-8 animate-fade-in",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1.5",
							children: "Scanned Target"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "truncate font-mono text-lg sm:text-xl font-semibold",
							children: result.url
						}),
						result.tags && result.tags.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1.5 mt-2",
							children: result.tags.map((tag) => {
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `inline-flex items-center text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${tag === "Blacklisted" ? "bg-cyber-danger/10 text-cyber-danger border-cyber-danger/30" : "bg-cyber-warn/10 text-cyber-warn border-cyber-warn/30"}`,
									children: tag
								}, tag);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground mt-2",
							children: new Date(result.scannedAt).toLocaleString()
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `shrink-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-full ring-1 ${r.bg} ${r.ring} ${r.color} font-semibold text-sm`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskIcon, { className: "h-4 w-4" }),
						result.risk,
						" Risk"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid lg:grid-cols-[auto_1fr] gap-8 items-center lg:items-start",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreGauge, {
					score: result.score,
					risk: result.risk
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid sm:grid-cols-2 gap-3 w-full",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "glass rounded-xl p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3.5 w-3.5" }), " SSL Certificate"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `font-semibold ${result.ssl.valid ? "text-cyber-success" : "text-cyber-danger"}`,
								children: result.ssl.valid ? "Valid & Trusted" : "Invalid / Missing"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground mt-1",
								children: [
									result.ssl.issuer,
									" · ",
									result.ssl.expiresInDays,
									"d left"
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "glass rounded-xl p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), " Risk Level"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `font-semibold ${r.color}`,
								children: result.risk
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground mt-1",
								children: [
									"Based on ",
									result.findings.length,
									" checks"
								]
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm uppercase tracking-[0.2em] text-muted-foreground mb-3",
					children: "Security Findings"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: result.findings.map((f, i) => {
						const fs = riskStyles[f.severity];
						const Icon = f.severity === "Low" ? CircleCheck : TriangleAlert;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "glass rounded-xl p-4 flex gap-3 items-start",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `shrink-0 grid h-8 w-8 place-items-center rounded-lg ${fs.bg}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `h-4 w-4 ${fs.color}` })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 flex-wrap",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold",
										children: f.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${fs.bg} ${fs.color}`,
										children: f.severity
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground mt-0.5",
									children: f.description
								})]
							})]
						}, i);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm uppercase tracking-[0.2em] text-muted-foreground mb-3",
					children: "Recommendations"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid sm:grid-cols-2 gap-2",
					children: result.recommendations.map((rec, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "glass rounded-xl p-4 flex gap-3 items-start text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 shrink-0 text-cyber-cyan mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: rec })]
					}, i))
				})]
			})
		]
	});
}
function Home() {
	const [result, setResult] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 grid-bg pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-auto max-w-3xl px-6 pt-6 pb-12 sm:pt-8 sm:pb-16 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto mb-8 grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-cyber-blue to-cyber-purple shadow-[0_0_60px_rgba(124,58,237,0.45)] float-slow",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
							className: "h-10 w-10 text-[#0B1120]",
							strokeWidth: 2.5
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "font-display text-4xl sm:text-5xl font-bold leading-[1.05] tracking-tight",
						children: ["Scan any website for", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-gradient-cyber",
							children: "security risks in seconds."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto",
						children: "SkySecure lets you check how safe a website is by scanning it for common security issues and risks. Simply enter a website URL to get an easy-to-understand security score and recommendations to help you stay safe online.          "
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-10 text-left",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanForm, { onResult: setResult })
					})
				]
			})]
		}),
		result && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mx-auto max-w-5xl px-6 -mt-4 mb-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultCard, { result })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
			className: "border-t border-white/5 py-8 text-center text-xs text-muted-foreground",
			children: "SkySecure · Built for cloud security research"
		})
	] });
}
//#endregion
export { Home as component };
