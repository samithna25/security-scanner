import re
import socket
from urllib.parse import urlparse

def clean_url(url: str) -> str:

    url = url.strip()
    if not url.startswith("http://") and not url.startswith("https://"):
        url = "https://" + url
    return url

def extract_hostname(url: str) -> str:

    cleaned = clean_url(url)
    parsed = urlparse(cleaned)
    hostname = parsed.hostname or cleaned
    # Strip port number if it is appended (e.g., 'localhost:5000' -> 'localhost')
    if ":" in hostname:
        hostname = hostname.split(":")[0]
    return hostname.lower()

def is_valid_url(url: str) -> bool:

    hostname = extract_hostname(url)
    
    # 1. Check syntax: ensure the hostname contains a valid Top-Level Domain (e.g., .com, .org)
    # Reject strings without dots (like 'localhost' or 'internal-server')
    domain_regex = re.compile(
        r'^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-6]{2,63}$',
        re.IGNORECASE
    )
    
    if not domain_regex.match(hostname):
        return False
        
    # 2. SSRF (Server-Side Request Forgery) protection:
    # Ensure the domain does not resolve to local or private IP address spaces.
    try:
        ip = socket.gethostbyname(hostname)
        private_ip_patterns = [
            r'^127\.',          # Loopback (localhost)
            r'^10\.',           # Class A private network
            r'^172\.(?:1[6-9]|2[0-9]|3[0-1])\.', # Class B private network
            r'^192\.168\.',     # Class C private network
            r'^0\.',            # Local network addresses
            r'^169\.254\.'      # Link-local / Cloud Metadata IP (e.g., AWS IMDS)
        ]
        for pattern in private_ip_patterns:
            if re.match(pattern, ip):
                return False
    except socket.gaierror:
        # If the domain name doesn't resolve (dns error), it is still considered syntactically 
        # valid, though the scan itself will fail to connect.
        pass
        
    return True