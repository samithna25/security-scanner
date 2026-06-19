SUSPICIOUS_KEYWORDS = {
    "phishing": [
        "login-verify", "secure-login", "account-update", "verify-identity",
        "update-account", "auth-check", "signin", "support-verify", "portal-login"
    ],
    "financial_scams": [
        "free-money", "win-prize", "crypto-airdrop", "claim-bonus",
        "double-crypto", "giftcard-free", "get-rewards", "lottery-win"
    ],
    "brand_impersonation": [
        "bank-update", "paypal-security", "netflix-verify", "amazon-support",
        "apple-recover", "microsoft-login", "google-security"
    ]
}

def check_domain_keywords(domain: str):
    domain_lower = domain.lower()
    detected_threats = []

    for category, keywords in SUSPICIOUS_KEYWORDS.items():
        for keyword in keywords:
            if keyword in domain_lower:
                # Determine severity based on category impact
                severity = "High" if category in ["phishing", "brand_impersonation"] else "Medium"
                
                detected_threats.append({
                    "keyword": keyword,
                    "category": category.replace("_", " ").title(),
                    "severity": severity,
                    "description": f"Domain contains the suspicious term '{keyword}' which is associated with {category.replace('_', ' ')}."
                })
                
    return detected_threats