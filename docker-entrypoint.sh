#!/bin/sh
set -e

echo "Starting Studio Fragrance application..."

# Wait for database to be ready
echo "Waiting for database to be ready..."
npx wait-on tcp:postgres:5432 -t 60000

# Run migrations
echo "Running database migrations..."
npx tsx scripts/migration.ts run

# Start the application
echo "Starting the server..."
exec node dist/index.js