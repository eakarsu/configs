#!/usr/bin/env bash
set -euo pipefail
echo "configs is a quarantined reference archive, not an executable application." >&2
echo "Run 'npm run check' for non-mutating integrity validation." >&2
exit 78
