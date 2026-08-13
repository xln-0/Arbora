#!/usr/bin/env bash

set -Eeuo pipefail

smoke_id="${GITHUB_RUN_ID:-local}-${RANDOM}"
network_name="arbora-smoke-${smoke_id}"
postgres_name="arbora-postgres-${smoke_id}"
api_name="arbora-api-${smoke_id}"
web_name="arbora-web-${smoke_id}"
api_image="arbora-api:smoke"
web_image="arbora-web:smoke"

cleanup() {
  docker rm --force "$web_name" "$api_name" "$postgres_name" >/dev/null 2>&1 || true
  docker network rm "$network_name" >/dev/null 2>&1 || true
}

show_logs() {
  docker inspect "$api_name" \
    --format 'API container: status={{.State.Status}} exit={{.State.ExitCode}} error={{.State.Error}}' \
    2>/dev/null || true
  docker logs "$api_name" 2>/dev/null || true
  docker inspect "$web_name" \
    --format 'Web container: status={{.State.Status}} exit={{.State.ExitCode}} error={{.State.Error}}' \
    2>/dev/null || true
  docker logs "$web_name" 2>/dev/null || true
}

trap cleanup EXIT
trap show_logs ERR

docker build --file apps/api/Dockerfile --tag "$api_image" .
docker build --file apps/web/Dockerfile --tag "$web_image" .

docker network create "$network_name" >/dev/null

docker run --detach \
  --name "$postgres_name" \
  --network "$network_name" \
  --env POSTGRES_USER=arbora \
  --env POSTGRES_PASSWORD=smoke-password \
  --env POSTGRES_DB=arbora_smoke \
  postgres:17-alpine >/dev/null

for _ in {1..30}; do
  if docker exec "$postgres_name" pg_isready --username arbora --dbname arbora_smoke >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

docker exec "$postgres_name" pg_isready --username arbora --dbname arbora_smoke >/dev/null

docker run --detach \
  --name "$api_name" \
  --network "$network_name" \
  --env PORT=3001 \
  --env CORS_ORIGINS=http://localhost \
  --env POSTGRES_USER=arbora \
  --env POSTGRES_PASSWORD=smoke-password \
  --env POSTGRES_HOST="$postgres_name" \
  --env POSTGRES_PORT=5432 \
  --env POSTGRES_DB=arbora_smoke \
  "$api_image" >/dev/null

for _ in {1..45}; do
  if docker exec "$api_name" node -e \
    'fetch("http://127.0.0.1:3001/health").then((response) => { if (!response.ok) process.exit(1); return response.json(); }).then((body) => { if (body.status !== "ok") process.exit(1); })' \
    >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

docker exec "$api_name" node -e \
  'fetch("http://127.0.0.1:3001/health").then((response) => { if (!response.ok) process.exit(1); return response.json(); }).then((body) => { if (body.status !== "ok") process.exit(1); })'

docker exec "$api_name" node -e \
  'fetch("http://127.0.0.1:3001/health/database").then((response) => { if (!response.ok) process.exit(1); return response.json(); }).then((body) => { if (body.database !== "connected") process.exit(1); })'

docker run --detach \
  --name "$web_name" \
  --network "$network_name" \
  "$web_image" >/dev/null

for _ in {1..20}; do
  if docker exec "$web_name" wget --quiet --output-document=- http://127.0.0.1/ \
    | grep --quiet '<div id="root"></div>'; then
    break
  fi
  sleep 1
done

docker exec "$web_name" wget --quiet --output-document=- http://127.0.0.1/ \
  | grep --quiet '<div id="root"></div>'

echo "Docker smoke test passed for API and Web images."
