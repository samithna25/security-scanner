from flask import Blueprint, request, jsonify
import uuid
from datetime import datetime

# Import security analysis modules
from scanner.ssl_check import check_ssl
from scanner.url_fetch import fetch_url_info
from scanner.risk_engine import calculate_risk_score
from utils.helpers import is_valid_url, clean_url

# Create a blueprint for grouping scanning routes
scan_bp = Blueprint('scan_bp', __name__)

@scan_bp.route('/api/scan', methods=['POST'])
def scan_endpoint():
    """
    Endpoint to receive a URL from the frontend, run security scans,
    and return the result.
    """
    # 1. Parse incoming JSON body
    data = request.get_json() or {}
    url = data.get('url')

    if not url:
        return jsonify({"error": "URL is required"}), 400

    # 1.5 Validate the URL syntax and protect against internal network scans (SSRF)
    if not is_valid_url(url):
        return jsonify({"error": "Invalid or restricted website URL"}), 400

    # Clean the URL (adds https:// if protocol is missing)
    url = clean_url(url)

    try:
        # 2. Gather website data (checks if online, reads headers, server details)
        url_info = fetch_url_info(url)
        
        # 3. Analyze SSL Certificate configuration
        ssl_info = check_ssl(url)
        
        # 4. Process all findings and calculate risk score / recommendations
        score, risk_level, findings, recommendations = calculate_risk_score(url, url_info, ssl_info)
        
        # 5. Format response to match the exact frontend interface (ScanResult)
        scan_result = {
            "id": str(uuid.uuid4()),
            "url": url,
            "score": score,
            "risk": risk_level,  # "Low" | "Medium" | "High"
            "ssl": {
                "valid": ssl_info.get("valid", False),
                "issuer": ssl_info.get("issuer", "Unknown"),
                "expiresInDays": ssl_info.get("expires_in_days", 0)
            },
            "findings": findings,  # List of {"title": str, "severity": str, "description": str}
            "recommendations": recommendations,  # List of strings
            "scannedAt": datetime.utcnow().isoformat() + "Z"
        }

        # 6. Return response to React
        return jsonify(scan_result), 200

    except Exception as e:
        print(f"Error during scan: {e}")
        return jsonify({"error": f"An error occurred while scanning: {str(e)}"}), 500