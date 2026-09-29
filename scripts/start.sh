#!/usr/bin/env bash
# Start the stack used for day-to-day work: frontend + api-service (+ database
# and the migration/seed runner they need). Safe to re-run at any time.
set -euo pipefail

cd "$(dirname "$0")/.."

if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env from .env.example"
fi

set -a
# shellcheck disable=SC1091
. ./.env
set +a

docker compose up -d --build database migration-runner api-service frontend

# The api-service starts before migrations/seeding finish, so wait until real
# data is served rather than just an open port.
url="http://localhost:${API_SERVICE_PORT}/orders"
printf 'Waiting for %s ' "$url"
for _ in $(seq 1 60); do
  if curl -fs -o /dev/null "$url"; then
    echo "ok"
    echo
    echo "Frontend:    http://localhost:${FRONTEND_PORT}"
    echo "API service: http://localhost:${API_SERVICE_PORT}"
    echo "Stop with:   docker compose down"
    exit 0
  fi
  printf '.'
  sleep 1
done

echo
echo "api-service did not become ready in 60s. Logs: docker compose logs api-service migration-runner" >&2
exit 1
