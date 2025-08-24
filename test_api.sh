#!/bin/bash
# Test API endpoints locally

echo "Testing API endpoints..."
echo ""

# Test the test endpoint
echo "Testing /api/test:"
curl -s http://localhost:3001/api/test | python3 -m json.tool

echo ""
echo "Testing history API:"
curl -s -X POST http://localhost:3001/api/generate-content \
  -H "Content-Type: application/json" \
  -d '{"query":"Tell me about the Roman Empire"}' | python3 -m json.tool

echo ""
echo "To test more endpoints, the server must be running:"
echo "npx vercel dev --listen 3001"