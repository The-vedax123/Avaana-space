#!/usr/bin/env bash
# Start the AvaanaSpace API and web app together for local development.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "▶ Starting AvaanaSpace (API :4000, Web :5173)…"
npm run dev
