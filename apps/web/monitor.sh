#!/bin/bash
echo "🔍 MUT SOCIAL MONITORING DASHBOARD"
echo "=================================="
echo ""

# 1. Server Health
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$STATUS" == "200" ]; then
  echo "✅ SERVER: ONLINE (Port 3000)"
else
  echo "❌ SERVER: OFFLINE (HTTP $STATUS)"
fi

# 2. Database Connectivity
DB_CHECK=$(sudo -u postgres psql -d mut_sa -t -A -c "SELECT count(*) FROM mut_sa_users;" 2>/dev/null)
if [ -n "$DB_CHECK" ]; then
  echo "✅ DATABASE: CONNECTED ($DB_CHECK users)"
else
  echo "❌ DATABASE: DISCONNECTED"
fi

# 3. Recent Errors (Last 5 minutes)
echo ""
echo "📋 RECENT ERRORS (Last 5 min):"
tail -n 100 /tmp/mut-sa.log | grep -i "error\|exception\|failed" | tail -5 || echo "   None detected"

# 4. Active Routes Status
echo ""
echo "🔗 ROUTE STATUS:"
for route in "/student/feed" "/student/communities" "/student/marketplace" "/student/report" "/student/messages"; do
  S=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000${route}")
  [ "$S" == "200" ] && echo "   ✅ $route" || echo "   ❌ $route ($S)"
done

echo ""
echo "Press Ctrl+C to exit. Auto-refreshes every 30s..."
sleep 30
exec "$0"
