#!/bin/bash

set -euxo pipefail

NODE_ENV=production

npm run-script lint
npm run-script build
rm -rf build

gcloud functions deploy gcbSubscribeSlack --trigger-topic cloud-builds --runtime nodejs10 --set-env-vars "SLACK_WEBHOOK_URL=${SLACK_WEBHOOK_URL}"