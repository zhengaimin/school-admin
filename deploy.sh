#!/bin/bash
set -euo pipefail

: "${DEPLOY_PASSWORD:?DEPLOY_PASSWORD 未配置}"

HOST="192.168.188.18"
REMOTE="app@${HOST}"
WORK_DIR="${CI_PROJECT_DIR:-$(pwd)}"
KNOWN_HOSTS="$WORK_DIR/.known_hosts"
ASKPASS_SCRIPT="$WORK_DIR/.ssh-askpass"

ssh-keyscan -H "$HOST" > "$KNOWN_HOSTS"
chmod 600 "$KNOWN_HOSTS"

# 脚本中不保存密码，只读取 GitLab 注入的环境变量。
printf '%s\n' \
  '#!/bin/sh' \
  'printf "%s\n" "$DEPLOY_PASSWORD"' \
  > "$ASKPASS_SCRIPT"
chmod 700 "$ASKPASS_SCRIPT"

export SSH_ASKPASS="$ASKPASS_SCRIPT"
export SSH_ASKPASS_REQUIRE=force
export DISPLAY=:0

SSH_OPTS=(
  -o PreferredAuthentications=password
  -o PubkeyAuthentication=no
  -o NumberOfPasswordPrompts=1
  -o StrictHostKeyChecking=yes
  -o UserKnownHostsFile="$KNOWN_HOSTS"
)

ssh "${SSH_OPTS[@]}" "$REMOTE" \
  "rm -rf /home/app/services/app/dist"

rsync -avzP \
  -e "ssh -o PreferredAuthentications=password -o PubkeyAuthentication=no -o NumberOfPasswordPrompts=1 -o StrictHostKeyChecking=yes -o UserKnownHostsFile=$KNOWN_HOSTS" \
  dist "$REMOTE:/home/app/services/app/"

ssh "${SSH_OPTS[@]}" "$REMOTE" \
  docker service update \
  --container-label-add "last_deployed=$(date -u +%Y-%m-%dT%H:%M:%S)" \
  app_app

#ssh xk "rm -fr /home/app/services/app/dist"
#rsync -avzP dist xk:/home/app/services/app/

#ssh xk docker service update --container-label-add last_deployed=$(date -u +%Y-%m-%dT%H:%M:%S) app_app
