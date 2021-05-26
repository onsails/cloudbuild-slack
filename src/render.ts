import { IncomingWebhookSendArguments } from '@slack/webhook';
import { SectionBlock } from '@slack/types';
import * as ejs from 'ejs';
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

const DEFAULT_TITLE_TEMPLATE =
  '<%= emoji %> `<%= build.id %>` <%= build.status %>';

export function createMessage(
  build: pubsub.Build
): IncomingWebhookSendArguments {
  let emoji = statusEmoji(build.status);

  let templateToRender =
    build.substitutions['_SLACK_MESSAGE_TEMPLATE'] || DEFAULT_TITLE_TEMPLATE;

  const text = ejs.render(templateToRender, {
    build: build,
    emoji: emoji,
  });

  let titleBlock: SectionBlock = {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: text,
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
        text: `*Repo*: ${repoSource.repoName}, *branch*: ${build.substitutions['BRANCH_NAME']}, *commit*: ${repoSource.commitSha}\n<${build.logUrl}|*Details*>`,
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
