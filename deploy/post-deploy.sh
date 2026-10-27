#!/usr/bin/env bash
# Static files are built in CI, then rsynced. This only fixes ownership.
set -euo pipefail
cd "$(dirname "$0")/.."
chown -R www-data:www-data . 2>/dev/null || true
echo "Post-deploy finished."
