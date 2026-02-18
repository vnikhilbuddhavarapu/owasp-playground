# OWASP Playground

An intentionally vulnerable web application demonstrating all 10 OWASP Top 10 (2021) security risks. Built to showcase Cloudflare WAF protection capabilities.

## Overview

This React Router application contains working exploits for every OWASP Top 10 vulnerability. Use it to:

- **Learn** about common web security flaws
- **Exploit** vulnerabilities hands-on via UI and cURL
- **Protect** with Cloudflare WAF OWASP Core Ruleset

## Vulnerabilities Demonstrated

| Risk | Page | API Endpoint | Exploit Method |
|------|------|--------------|----------------|
| A01: Broken Access Control | `/access-control` | `/api/access-control` | IDOR - change user IDs |
| A02: Cryptographic Failures | `/crypto` | `/api/crypto` | View plaintext passwords |
| A03: Injection (SQLi) | `/login` | `/api/login` | `' OR '1'='1` bypass |
| A03: Injection (Command) | `/ping` | `/api/ping` | `; whoami` injection |
| A04: Insecure Design | `/insecure-design` | `/api/insecure-design` | Skip payment workflow |
| A05: Security Misconfiguration | `/misconfig` | `/api/misconfig` | Exposed env/config |
| A06: Vulnerable Components | `/vulnerable-components` | `/api/vulnerable-components` | Prototype pollution |
| A07: Authentication Failures | `/auth-failures` | `/api/auth-failures` | Brute force login |
| A08: Software Integrity (CSRF) | `/admin` | `/api/delete-user` | No token validation |
| A09: Security Logging | N/A | N/A | Missing audit trail |
| A10: Server-Side Request Forgery | `/ping` | `/api/ping` | Internal network access |

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run cURL tests against all 10 risks
./test-vulnerabilities.sh http://localhost:5173
```

## Cloudflare WAF Demo

### Before WAF (Exploits Work)

All vulnerabilities are exploitable. Test with cURL:

```bash
# SQL Injection
curl -X POST http://localhost:5173/api/login \
  -d '{"username":"admin'\''--","password":"x"}'

# Stored XSS
curl -X POST http://localhost:5173/api/comment \
  -d '{"content":"<script>alert(1)</script>"}'

# Command Injection
curl "http://localhost:5173/api/ping?host=;whoami"
```

### After WAF (Exploits Blocked)

1. Deploy to Cloudflare Pages/Workers
2. Enable **OWASP Core Ruleset** in Security > WAF
3. Re-run exploits - receive 403 Forbidden responses

## Resources

- [OWASP Top 10 (2021)](https://owasp.org/Top10/)
- [Cloudflare WAF OWASP Core Ruleset](https://developers.cloudflare.com/waf/managed-rules/reference/owasp-core-ruleset/)
- [Cloudflare Managed Rules](https://developers.cloudflare.com/waf/managed-rules/)

## Tech Stack

- React Router v7 (Remix)
- TypeScript
- Tailwind CSS v4
- Cloudflare Workers
- D1 Database

## Security Notice

This application is **intentionally vulnerable** for educational purposes. Do not deploy to production or expose sensitive data. The database contains fake user data only.
