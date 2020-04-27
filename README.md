# Google Cloud Function for Slack notifications about Cloud Builds written in TypeScript

Features:

* send slack notifications about successful and failed builds;
* link to build details in slack message;
* show trigger information in slack message;
* customize slack message using substitution in cloudbuild.yaml.


# Deploy

Prerequisites:

* Google Cloud Platform project with enabled Cloud Functions API;
* gcloud command-line util authorized to deploy cloud functions;
* Slack webhook url.

Deployment:

```bash
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR_TOKENS ./deploy.sh
```

This script will deploy cloud function `gcbSubscribeSlack` triggered by `cloud-build` PubSub topic.

Message can be customized by defining `_SLACK_MESSAGE_TEMPLATE` substitution in cloudbuild.yaml. Value should be a valid [ejs](https://ejs.co) template:

```yaml
steps:

# ... build steps ...

substitutions:
  _SLACK_MESSAGE_TEMPLATE: '<%= emoji %> frontend build & deploy `<%= build.id %>` <%= build.status %>'
```

`emoji` corresponds to a build status, `build` is object containing build information, it's structure is defined [here](https://github.com/onsails/cloudbuild-slack/blob/master/src/pubsub.ts).
