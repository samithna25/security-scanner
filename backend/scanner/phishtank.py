import requests

def check_phishtank(url: str) -> dict:
    """
    Checks if the URL is flagged as a phishing site in the PhishTank database.
    Sends a POST request to https://checkurl.phishtank.com/checkurl/
    
    Returns a dict with:
        - "in_database": bool
        - "phish_id": str (optional)
        - "phish_detail_page": str (optional)
        - "verified": bool (optional)
        - "error": str (optional)
    """
    endpoint = "https://checkurl.phishtank.com/checkurl/"
    
    headers = {
        "User-Agent": "phishtank/SkySecure_Scanner_v1.0"
    }
    
    data = {
        "url": url,
        "format": "json"
    }
    
    try:
        # Timeout after 3 seconds so the external API does not block the scanner
        response = requests.post(endpoint, data=data, headers=headers, timeout=3.0)
        
        # Handle rate limits (HTTP 509 Bandwidth Limit Exceeded or HTTP 429)
        if response.status_code in [429, 509]:
            print("PhishTank API: Rate limit exceeded.")
            return {
                "in_database": False,
                "error": "PhishTank API rate limit exceeded"
            }
            
        if response.status_code != 200:
            print(f"PhishTank API returned status code {response.status_code}")
            return {
                "in_database": False,
                "error": f"API error status: {response.status_code}"
            }
            
        json_data = response.json()
        results = json_data.get("results", {})
        
        return {
            "in_database": results.get("in_database", False),
            "phish_id": results.get("phish_id"),
            "phish_detail_page": results.get("phish_detail_page"),
            "verified": results.get("verified", False),
            "valid": results.get("valid", False)
        }
        
    except requests.exceptions.RequestException as e:
        print(f"PhishTank API connection error: {e}")
        return {
            "in_database": False,
            "error": str(e)
        }
