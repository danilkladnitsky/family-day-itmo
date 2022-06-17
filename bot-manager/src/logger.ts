const { createLogger, transports, format } = require('winston');
const LokiTransport = require('winston-loki');

const { MODE, LOKI_HOST } = process.env;

export enum LOG_LABELS {
  MESSAGE_FROM_BOT = 'message-from-bot',
  MESSAGE_FROM_USER = 'message-from-user',
  BOT_ERROR = 'bot-error',
  BOT_ACTION = 'bot-action',
  USER_ACTION = 'user-action',
  STICKERS = 'stickers',
}

export enum LOGGER_JOBS {
  RECEIVER = 'receiver',
  FORMS = 'forms',
  FEEDBACK = 'feedback',
  USER_MESSAGES = 'user-messages',
  ERRORS = 'errors',
  BUTTON = 'button',
  START = 'start',
  BOT = 'bot',
}

const APP_LABEL = 'app';

function initLogger(tag: LOGGER_JOBS) {
  return createLogger({
    format: format.combine(format.splat()),
    transports: [
      new LokiTransport({
        host: LOKI_HOST ?? 'http://host.docker.internal:5100',
        labels: {
          service: tag,
          app: APP_LABEL,
        },
      }),
    ],
  });
}

export function getLabel(label) {
  return { label };
}
export const receiverLogger = initLogger(LOGGER_JOBS.RECEIVER);
export const botLogger = initLogger(LOGGER_JOBS.BOT);
module.exports = {
  receiverLogger,
  botLogger,
  getLabel,
  LOG_LABELS,
  LOGGER_JOBS,
};
