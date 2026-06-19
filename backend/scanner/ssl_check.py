import socket
import ssl
from urllib.parse import urlparse
from datetime import datetime

def check_ssl(url: str):

    # 1. Clean the URL and extract the domain name
    parsed_url = urlparse(url)
    hostname = parsed_url.hostname or url
    
    # Strip port number if it is appended (e.g. 'localhost:5000' -> 'localhost')
    if ":" in hostname:
        hostname = hostname.split(":")[0]

    from scanner.keyword_db import is_simulated_target
    if is_simulated_target(hostname):
        return {
            "valid": True,
            "issuer": "Let's Encrypt Authority x3",
            "expires_in_days": 78
        }

    # Create a default SSL context that validates certificates (verifies chain and hostname)
    context = ssl.create_default_context()
    
    # Set a socket timeout of 3 seconds to avoid hanging indefinitely if a website is offline
    socket.setdefaulttimeout(3.0)

    try:
        # 2. Establish a TCP connection on port 443 (HTTPS)
        with socket.create_connection((hostname, 443)) as sock:
            # 3. Perform the SSL handshake and wrap the socket
            with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                # 4. Extract the verified peer certificate
                cert = ssock.getpeercert()
                
                # 5. Extract the certificate Issuer Organization (O)
                issuer_dict = dict(x[0] for x in cert.get('issuer', []))
                issuer = issuer_dict.get('organizationName', issuer_dict.get('commonName', 'Unknown Issuer'))
                
                # 6. Parse the expiration date
                not_after_str = cert.get('notAfter')
                expires_at = datetime.strptime(not_after_str, '%b %d %H:%M:%S %Y %Z')
                
                # 7. Calculate remaining days
                time_remaining = expires_at - datetime.utcnow()
                expires_in_days = max(0, time_remaining.days)
                
                return {
                    "valid": True,
                    "issuer": issuer,
                    "expires_in_days": expires_in_days
                }
                
    except Exception as e:
        # If connection fails, SSL handshake fails, or cert is self-signed/untrusted,
        print(f"SSL handshake failed for {hostname}: {e}")
        return {
            "valid": False,
            "issuer": "None (Verification Failed)",
            "expires_in_days": 0
        }