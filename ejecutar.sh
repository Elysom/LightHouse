#!/bin/bash
cd "$(dirname "$0")" || exit 1

(cd src/back && node Servidor.js) &
SRV=$!
trap 'kill "$SRV" 2>/dev/null' EXIT INT TERM

npm run dev