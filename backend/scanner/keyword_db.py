import socket

BLACKLISTED_DOMAINS = [
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
]

SUSPICIOUS_KEYWORDS = [
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
]

CATEGORIZED_SUSPICIOUS_KEYWORDS = {
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

def is_simulated_target(domain: str) -> bool:
    """
    Returns True if the domain is on the blacklist or is an unreachable 
    domain that contains suspicious keywords (indicating a simulated demo site).
    """
    domain_lower = domain.lower()
    
    # 1. Check if exactly matches any blacklisted domain
    if domain_lower in [d.lower() for d in BLACKLISTED_DOMAINS]:
        return True
        
    # 2. Check if it contains any suspicious keyword
    has_keyword = any(kw in domain_lower for kw in SUSPICIOUS_KEYWORDS)
    if has_keyword:
        # Check if the domain actually exists on the public DNS
        try:
            socket.gethostbyname(domain_lower)
            return False  # Real domain, don't simulate
        except socket.gaierror:
            return True   # Fictional domain, simulate it
            
    return False

def check_domain_keywords(domain: str):
    domain_lower = domain.lower()
    detected_threats = []

    # 1. Check original categorized keywords
    for category, keywords in CATEGORIZED_SUSPICIOUS_KEYWORDS.items():
        for keyword in keywords:
            if keyword in domain_lower:
                severity = "High" if category in ["phishing", "brand_impersonation"] else "Medium"
                detected_threats.append({
                    "keyword": keyword,
                    "category": category.replace("_", " ").title(),
                    "severity": severity,
                    "description": f"Domain contains the suspicious term '{keyword}' which is associated with {category.replace('_', ' ')}."
                })

    # 2. Check the user's specific SUSPICIOUS_KEYWORDS list if they weren't already found as part of multi-word matches
    for keyword in SUSPICIOUS_KEYWORDS:
        if keyword in domain_lower:
            # Avoid duplicate warnings for similar keyword matches if possible, but keep it clear
            # e.g., if "login-verify" was matched, we might still want to note "login" and "verify"
            already_detected = any(t["keyword"] == keyword for t in detected_threats)
            if not already_detected:
                # Default keyword severity
                severity = "Medium"
                if keyword in ["login", "password", "bank", "crypto", "payment", "urgent"]:
                    severity = "High"
                
                detected_threats.append({
                    "keyword": keyword,
                    "category": "Suspicious Pattern",
                    "severity": severity,
                    "description": f"Domain contains the suspicious keyword '{keyword}'."
                })
                
    return detected_threats