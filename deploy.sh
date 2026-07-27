#!/bin/bash
ssh xk "rm -fr /home/app/services/app/dist"
rsync -avzP dist xk:/home/app/services/app/

ssh xk docker service update --container-label-add last_deployed=$(date -u +%Y-%m-%dT%H:%M:%S) app_app
