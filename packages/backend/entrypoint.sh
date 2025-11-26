#!/bin/sh
set -e

echo "🚀 LogWard Backend Starting..."
echo "================================"

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
MAX_RETRIES=30
RETRY_COUNT=0

while ! pg_isready -h "${DATABASE_HOST:-postgres}" -U "${DB_USER:-logward}" > /dev/null 2>&1; do
  RETRY_COUNT=$((RETRY_COUNT + 1))
  if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
    echo "❌ PostgreSQL is not available after $MAX_RETRIES attempts"
    exit 1
  fi
  echo "   Waiting for PostgreSQL... (attempt $RETRY_COUNT/$MAX_RETRIES)"
  sleep 2
done

echo "✅ PostgreSQL is ready!"

# Run database migrations
echo ""
echo "🗄️  Running database migrations..."
node dist/scripts/migrate.js

if [ $? -ne 0 ]; then
  echo "❌ Migration failed"
  exit 1
fi

echo "✅ Migrations completed successfully"
echo ""

# Start the application (server or worker)
if [ "$1" = "worker" ]; then
  echo "👷 Starting LogWard Worker..."
  exec node dist/worker.js
else
  echo "🌐 Starting LogWard API Server..."
  exec node dist/server.js
fi
