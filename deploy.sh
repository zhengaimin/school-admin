#!/bin/bash
set -euo pipefail

HOST="192.168.188.18"
REMOTE="app@${HOST}"
KNOWN_HOSTS="${CI_PROJECT_DIR:-$(pwd)}/.known_hosts"

ssh-keyscan -H "$HOST" > "$KNOWN_HOSTS"
chmod 600 "$KNOWN_HOSTS"

SSH_OPTS=(
  -o StrictHostKeyChecking=yes
  -o UserKnownHostsFile="$KNOWN_HOSTS"
)

ssh "${SSH_OPTS[@]}" "$REMOTE" \
  "rm -rf /home/app/services/app/dist"

rsync -avzP \
  -e "ssh -o StrictHostKeyChecking=yes -o UserKnownHostsFile=$KNOWN_HOSTS" \
  dist "$REMOTE:/home/app/services/app/"

ssh "${SSH_OPTS[@]}" "$REMOTE" \
  docker service update \
  --container-label-add "last_deployed=$(date -u +%Y-%m-%dT%H:%M:%S)" \
  app_app

#ssh xk "rm -fr /home/app/services/app/dist"
#rsync -avzP dist xk:/home/app/services/app/

#ssh xk docker service update --container-label-add last_deployed=$(date -u +%Y-%m-%dT%H:%M:%S) app_app
