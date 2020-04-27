import { IncomingWebhook, IncomingWebhookSendArguments } from '@slack/webhook';
import { SectionBlock } from '@slack/types';

const url = process.env.SLACK_WEBHOOK_URL!;

const webhook = new IncomingWebhook(url);

interface Event {
  data: string;
}

export async function gcbSubscribeSlack(pubSubEvent: Event, _context: Object) {
  console.log('Event: ', pubSubEvent);

  const build = eventToBuild(pubSubEvent['data']);
  console.log('Build: ', build);

  if (!isLoudStatus(build.status)) {
    return;
  }

  const message = createSlackMessage(build);
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

function statusEmoji(status: string): string {
  switch (status) {
    case 'SUCCESS':
      return ':white_check_mark:';
    case 'FAILURE':
      return ':heavy_exclamation_mark:';
    case 'INTERNAL_ERROR':
      return ':bangbang:';
    case 'TIMEOUT':
      return ':alarm_clock:';
    default:
      return ':question:';
  }
}

interface Source {
  repoSource?: RepoSource;
}

interface RepoSource {
  repoName: string;
  branchName: string;
  tagName: string;
  commitSha: string;
  dir: string;
  projectId: string;
  substitutions: Map<string, string>;
}

interface Build {
  id: number;
  status: string;
  logUrl: string;
  source: Source;
}

function eventToBuild(data: string): Build {
  return JSON.parse(Buffer.from(data, 'base64').toString());
}

function createSlackMessage(build: Build): IncomingWebhookSendArguments {
  let emoji = statusEmoji(build.status);
  let status = build.status;

  let titleBlock: SectionBlock = {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `${emoji} \`${build.id}\` ${status}`,
    },
  };

  let message: IncomingWebhookSendArguments = {
    blocks: [titleBlock],
  };

  let descBlock: SectionBlock = {
    type: 'section',
  };

  let repoSource = build.source.repoSource;
  if (repoSource) {
    descBlock.fields = [
      {
        type: 'mrkdwn',
        text: `*Repo*: ${repoSource.repoName}, *branch*: ${repoSource.branchName}, *commit*: ${repoSource.commitSha}\n<${build.logUrl}|*Details*>`,
      },
    ];
  } else {
    descBlock.fields = [
      {
        type: 'mrkdwn',
        text: `<${build.logUrl}|*Details*>`,
      },
    ];
  }

  message.blocks?.push(descBlock);

  return message;
}
