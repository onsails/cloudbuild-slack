import { IncomingWebhook } from '@slack/webhook';
import * as pubsub from './pubsub';
import * as render from './render';
import sourceMapSupport from 'source-map-support';
sourceMapSupport.install();

const url = process.env.SLACK_WEBHOOK_URL!;

const webhook = new IncomingWebhook(url);

export async function gcbSubscribeSlack(
  pubSubEvent: pubsub.Event,
  _context: Object
) {
  console.log('Event: ', pubSubEvent);

  const build = pubsub.deserBuild(pubSubEvent);
  console.log('Build: ', build);

  if (!isLoudStatus(build.status)) {
    return;
  }

  const message = render.createMessage(build);
  await webhook.send(message);
}

const STATUSES = ['SUCCESS', 'FAILURE', 'INTERNAL_ERROR', 'TIMEOUT'];

function isLoudStatus(status: string): boolean {
  if (STATUSES.indexOf(status) === -1) {
    return false;
  } else {
    return true;
  }
}
