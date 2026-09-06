#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ -f "$ROOT_DIR/.env" ]; then
  set -a
  # shellcheck disable=SC1091
  source "$ROOT_DIR/.env"
  set +a
else
  echo "No se encontró .env. Se usarán los valores por defecto de Spring Boot."
fi

if ! command -v java >/dev/null || ! command -v npm >/dev/null; then
  echo "Se requieren Java 25 y Node.js/npm instalados." >&2
  exit 1
fi

cleanup() {
  kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

(cd "$ROOT_DIR/backend" && ./mvnw spring-boot:run) &
BACKEND_PID=$!
(cd "$ROOT_DIR/frontend" && npm install && npm run dev -- --host 0.0.0.0) &
FRONTEND_PID=$!

wait "$BACKEND_PID" "$FRONTEND_PID"