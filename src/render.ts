import { IncomingWebhookSendArguments } from '@slack/webhook';
import { SectionBlock } from '@slack/types';
import * as pubsub from './pubsub';

export function statusEmoji(status: string): string {
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

export function createMessage(
  build: pubsub.Build
): IncomingWebhookSendArguments {
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
