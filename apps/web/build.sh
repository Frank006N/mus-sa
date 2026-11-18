#!/bin/bash
set -e

echo "🔧 Installing monorepo dependencies from root..."
cd ../..
pnpm install --frozen-lockfile || npm install --legacy-peer-deps

echo "🏗️ Building web app..."
cd apps/web
npm run build

echo "✅ Build complete!"
