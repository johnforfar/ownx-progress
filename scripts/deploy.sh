#!/usr/bin/env bash
# Build, check, layout-test on localhost, push main, deploy to Vercel, then check the live site from outside.
set -euo pipefail
cd "$(dirname "$0")/.."
[ "$(git branch --show-current)" = main ] || { echo "deploy from main"; exit 1; }
npm run build
python3 -m http.server 4174 --bind 127.0.0.1 >/dev/null 2>&1 & SRV=$!; trap 'kill $SRV' EXIT; sleep 1
URL=http://127.0.0.1:4174/ env -u ELECTRON_RUN_AS_NODE npm test
E=$(git config --global user.email); git add -A && git diff --cached --quiet || GIT_AUTHOR_EMAIL=$E GIT_COMMITTER_EMAIL=$E git commit -qm "Progress update $(node -p "require('./data/progress.json').updated")"
git push -q origin main  # repo-local email is a gmail override; commits above use the global noreply
vercel --prod --yes --scope openmesh | tail -1
for i in 1 2 3; do curl -s -o /dev/null -w "live %{http_code} %{time_total}s\n" https://progress.ownx.co/; done
curl -s https://progress.ownx.co/ | grep -q "$(node -p "require('./data/progress.json').shipped[0].title")" && echo "live content ok"
