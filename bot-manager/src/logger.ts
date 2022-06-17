const { createLogger, transports, format } = require('winston');
const LokiTransport = require('winston-loki');

const { MODE, LOKI_HOST } = process.env;

const APP_LABEL = 'app';

export enum LOG_LABELS {
  MESSAGE_FROM_BOT = 'message-from-bot',
  MESSAGE_FROM_USER = 'message-from-user',
  BOT_ERROR = 'bot-error',
  BOT_ACTION = 'bot-action',
  USER_ACTION = 'user-action',
  GET_USER = 'get-user',
  PING_SERVICE = 'ping-service',
  CREATE_TICKET = 'create-ticket',
  SEND_TICKET = 'send-ticket',
  VALIDATE_TICKET = 'validate-ticket',
  CHECKED_TICKET = 'success-ticket',
  EARLY_TICKET = 'early-ticket',
  USER_REGISTRATION = 'user-registration',
  CHOOSE_LEVEL = 'choose-level',
  VOTING = 'voting',
  VOTING_COMMAND = 'voting-command',
  VOTING_EARLY = 'voting-early',
}

function initLogger(tag: LOGGER_JOBS) {
  return createLogger({
    format: format.combine(format.splat()),
    transports: [
      new LokiTransport({
        host: LOKI_HOST ?? "http://host.docker.internal:5100",
        labels: {
          service: tag,
          app: APP_LABEL,
        },
      }),
    ],
  });
}

export enum LOGGER_JOBS {
  RECEIVER = 'receiver',
  FORMS = 'forms',
  FEEDBACK = 'feedback',
  USER_MESSAGES = 'user-messages',
  ERRORS = 'errors',
}

const receiverLogger = initLogger(LOGGER_JOBS.RECEIVER);
const formLogger = initLogger(LOGGER_JOBS.FORMS);
const feedbackLogger = initLogger(LOGGER_JOBS.FEEDBACK);
const userMessagesLogger = initLogger(LOGGER_JOBS.USER_MESSAGES);
const errorLogger = initLogger(LOGGER_JOBS.ERRORS);

module.exports = {
  receiverLogger,
  formLogger,
  feedbackLogger,
  userMessagesLogger,
  errorLogger,
};
