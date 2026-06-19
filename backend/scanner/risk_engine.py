from urllib.parse import urlparse
from scanner.keyword_db import check_domain_keywords
from scanner.phishtank import check_phishtank

def calculate_risk_score(url, url_info, ssl_info):
    # Start with a perfect score
    score = 100
    findings = []
    recommendations = []
    tags = []
    
    # Extract the hostname (e.g. 'https://github.com/abc' -> 'github.com')
    parsed_url = urlparse(url)
    hostname = parsed_url.hostname or url
    is_https = parsed_url.scheme == "https"

    # --- 0. Domain Blacklist Check ---
    from scanner.keyword_db import BLACKLISTED_DOMAINS
    if hostname.lower() in [d.lower() for d in BLACKLISTED_DOMAINS]:
        score -= 90
        findings.append({
            "title": "Blacklisted Domain (Phishing / Scam)",
            "severity": "High",
            "description": f"The domain '{hostname}' is flagged on our blacklist of simulated phishing and malicious websites."
        })
        recommendations.append("Immediately leave this website. It is simulating a hazardous site and has been blacklisted.")
        tags.append("Blacklisted")

    # --- 1. Protocol Check (HTTP vs HTTPS) ---
    if not is_https:
        score -= 30
        findings.append({
            "title": "Insecure Connection (No HTTPS)",
            "severity": "High",
            "description": "The site is served over plain HTTP. Login credentials and personal data can be intercepted by third parties."
        })
        recommendations.append("Install an SSL certificate and redirect all HTTP traffic to HTTPS.")
    else:
        findings.append({
            "title": "Secure Connection (HTTPS Enabled)",
            "severity": "Low",
            "description": "The connection to this server is encrypted."
        })

    # --- 2. SSL Certificate Checks ---
    if is_https:
        ssl_valid = ssl_info.get("valid", False)
        expires_days = ssl_info.get("expires_in_days", 0)
        
        if not ssl_valid:
            score -= 25
            findings.append({
                "title": "Invalid or Untrusted SSL Certificate",
                "severity": "High",
                "description": "The SSL certificate could not be verified. It may be expired, self-signed, or matching a different hostname."
            })
            recommendations.append("Replace or renew the invalid SSL certificate with a trusted Certificate Authority (CA).")
        else:
            # Check certificate expiration
            if expires_days < 30:
                score -= 10
                findings.append({
                    "title": f"SSL Certificate expiring soon",
                    "severity": "Medium",
                    "description": f"The SSL certificate expires in {expires_days} days. If not renewed, browsers will block users."
                })
                recommendations.append(f"Renew your SSL certificate immediately (expires in {expires_days} days).")
            else:
                findings.append({
                    "title": "Valid SSL Certificate",
                    "severity": "Low",
                    "description": f"Issued by {ssl_info.get('issuer', 'Trusted CA')} · expires in {expires_days} days."
                })

    # --- 3. Suspicious Keyword Checking ---
    threat_keywords = check_domain_keywords(hostname)
    for threat in threat_keywords:
        score -= 25
        findings.append({
            "title": "Suspicious Keyword in Hostname",
            "severity": threat["severity"],
            "description": threat["description"]
        })
        recommendations.append("Ensure the domain is not mimicking known brands or using credential-harvesting terms.")
        
        # Add the keyword to tags
        kw_tag = threat["keyword"].capitalize()
        if kw_tag not in tags:
            tags.append(kw_tag)

    # --- 3.5 PhishTank Threat Database Check ---
    phishtank_result = check_phishtank(url)
    if phishtank_result.get("in_database", False) and phishtank_result.get("valid", False):
        score -= 80
        findings.append({
            "title": "Known Phishing Host (PhishTank Database)",
            "severity": "High",
            "description": f"This URL is explicitly flagged as a verified active phishing page in the PhishTank threat database (Phish ID: {phishtank_result.get('phish_id', 'Unknown')})."
        })
        if phishtank_result.get("phish_detail_page"):
            recommendations.append(f"Do NOT visit this page. Review the threat details on PhishTank: {phishtank_result.get('phish_detail_page')}")
        else:
            recommendations.append("Do NOT visit or input any credentials on this page; it is a verified phishing threat.")

    # --- 4. Security Headers (from url_fetch) ---
    headers = url_info.get("headers", {})
    # Convert header keys to lowercase for case-insensitivity
    headers_lower = {k.lower(): v for k, v in headers.items()}
    
    missing_headers = []
    if "content-security-policy" not in headers_lower:
        missing_headers.append("Content-Security-Policy (CSP)")
    if "x-frame-options" not in headers_lower:
        missing_headers.append("X-Frame-Options")
        
    if missing_headers:
        score -= 10
        findings.append({
            "title": "Missing Security Headers",
            "severity": "Medium",
            "description": f"The website is missing critical HTTP response headers: {', '.join(missing_headers)}."
        })
        recommendations.append("Configure your web server to send Content-Security-Policy and X-Frame-Options headers.")

    # Ensure score stays within bounds (5 to 100)
    score = max(5, min(100, score))

    # --- 5. Determine General Risk Level ---
    if score >= 80:
        risk_level = "Low"
    elif score >= 50:
        risk_level = "Medium"
    else:
        risk_level = "High"

    # Default general best practices recommendations
    recommendations.append("Implement a robust Content-Security-Policy (CSP) to mitigate Cross-Site Scripting (XSS) attacks.")
    # Remove duplicates from recommendations
    unique_recommendations = list(dict.fromkeys(recommendations))

    return score, risk_level, findings, unique_recommendations, tags