#!/usr/bin/env bash
# Node-RED flow backup to GitHub.
# Runs inside the Node-RED addon container: reads its own flows.json,
# splits into per-tab files, then commits + pushes to littlestotty-labs/node-red-flows.
# Auth token is read from Home Assistant secrets.yaml at runtime and never stored.
set -u

REPO=/homeassistant/node_red_flows
SECRETS=/homeassistant/secrets.yaml
REMOTE=origin
BRANCH=main

cd "$REPO" || exit 1

node "$REPO/splitter.js" || { echo "export.sh: splitter failed"; exit 1; }

TOKEN=$(sed -n 's/^[[:space:]]*github_nodered_token:[[:space:]]*//p' "$SECRETS" | tr -d '\r' | tail -n 1)
TOKEN="${TOKEN#\"}"; TOKEN="${TOKEN%\"}"
TOKEN="${TOKEN#\'}"; TOKEN="${TOKEN%\'}"
if [ -z "$TOKEN" ]; then
  echo "export.sh: github_nodered_token not found in secrets.yaml"
  exit 1
fi

AUTH="$(printf 'x-access-token:%s' "$TOKEN" | base64 | tr -d '\n')"

git pull --rebase -q "$REMOTE" "$BRANCH" 2>/dev/null || true

git add -A
if git diff --cached --quiet; then
  echo "export.sh: no changes to push"
  exit 0
fi

git commit -q -m "Node-RED flow backup $(date -u +%Y-%m-%dT%H:%M:%SZ)"
git -c http.extraHeader="Authorization: Basic $AUTH" push -q "$REMOTE" "$BRANCH"
echo "export.sh: pushed backup $(date -u +%Y-%m-%dT%H:%M:%SZ)"