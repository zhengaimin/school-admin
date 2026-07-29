#!/bin/bash
set -euo pipefail

REMOTE="app@192.168.188.18"

ssh "$REMOTE" "rm -rf /home/app/services/app/dist"
rsync -avzP dist "$REMOTE:/home/app/services/app/"
ssh "$REMOTE" docker service update \
  --container-label-add "last_deployed=$(date -u +%Y-%m-%dT%H:%M:%S)" \
  app_app

#ssh xk "rm -fr /home/app/services/app/dist"
#rsync -avzP dist xk:/home/app/services/app/

#ssh xk docker service update --container-label-add last_deployed=$(date -u +%Y-%m-%dT%H:%M:%S) app_app
