#!/bin/bash
ssh xk "rm -fr services/app/dist"
rsync -avzP dist services/app/dist

ssh xk docker service update --container-label-add last_deployed=$(date -u +%Y-%m-%dT%H:%M:%S) app_app
