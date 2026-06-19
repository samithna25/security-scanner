import requests
from urllib.parse import urlparse
from scanner.keyword_db import is_simulated_target

def fetch_url_info(url: str):

    # 1. Ensure the URL starts with http:// or https://
    if not url.startswith("http://") and not url.startswith("https://"):
        url = "https://" + url

    # Extract hostname to check if it's a simulated domain
    parsed = urlparse(url)
    hostname = parsed.hostname or url
    if ":" in hostname:
        hostname = hostname.split(":")[0]

    if is_simulated_target(hostname):
        return {
            "status_code": 200,
            "headers": {
                "Server": "nginx/1.18.0",
                "Content-Type": "text/html; charset=UTF-8"
            },
            "server": "nginx/1.18.0",
            "final_url": url,
            "online": True
        }

    # 2. Add a standard User-Agent header
    # Some web servers block default Python library requests to prevent scraping.
    # Mimicking a browser User-Agent ensures the request goes through.
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    try:
        # 3. Perform HTTP GET request (timeout after 5 seconds to prevent hanging)
        # allow_redirects=True is enabled to follow short-links or redirects to secure paths
        response = requests.get(url, headers=headers, timeout=5.0, allow_redirects=True)
        
        # 4. Extract and store response headers
        response_headers = dict(response.headers)
        
        return {
            "status_code": response.status_code,
            "headers": response_headers,
            "server": response_headers.get("Server", response_headers.get("server", "Unknown")),
            "final_url": response.url,
            "online": True
        }
        
    except requests.exceptions.Timeout:
        print(f"Request timeout for {url}")
        return {
            "status_code": 408,
            "headers": {},
            "server": "Unknown",
            "final_url": url,
            "online": False,
            "error": "Request timed out after 5 seconds."
        }
        
    except requests.exceptions.RequestException as e:
        # Catches all other request failures (e.g. invalid domains, DNS lookup failures, connection refused)
        print(f"Failed to fetch {url}: {e}")
        return {
            "status_code": 0,
            "headers": {},
            "server": "Unknown",
            "final_url": url,
            "online": False,
            "error": "Website is unreachable or domain name does not exist."
        }