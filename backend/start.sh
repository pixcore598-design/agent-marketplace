#!/bin/bash
# AgentMarket Backend Start Script
# Usage: ./start.sh [dev|prod]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

MODE="${1:-prod}"

echo "🚀 AgentMarket Backend - Starting in $MODE mode..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm ci --production=false
fi

# Generate Prisma client if needed
if [ ! -d "node_modules/.prisma" ]; then
    echo "🔧 Generating Prisma client..."
    npx prisma generate
fi

# Check database connection
echo "🔍 Checking database connection..."
if ! npx prisma db pull --force &>/dev/null; then
    echo "⚠️  Database not reachable or not migrated."
    echo "   Make sure PostgreSQL is running and DATABASE_URL is correct."
    echo "   Run 'npx prisma migrate deploy' to apply migrations."
fi

if [ "$MODE" = "dev" ]; then
    echo "🌱 Starting development server..."
    npm run dev
else
    # Production mode
    if [ ! -d "dist" ]; then
        echo "🔨 Building production bundle..."
        npm run build
    fi
    
    echo "🏭 Starting production server..."
    NODE_ENV=production npm start
fi