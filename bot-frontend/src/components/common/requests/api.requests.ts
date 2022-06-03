export const HOST = process.env.API_HOST ?? " http://itmo.partnadem.com:4000/";

export const GET_EDGES = "links";
export const GET_NODES = "messages";

export const CONNECT_NODES = `message/connect`;

export const DELETE_EDGE = (edgeId: number | string) => `links/${edgeId}`;
export const DELETE_NODE = (nodeId: number | string) => `message/${nodeId}`;

export const CREATE_BOT_MESSAGE = "message";
export const UPDATE_BOT_MESSAGE = (messageId: number) => `message/${messageId}`;
export const UPDATE_LINK = (linkId: number | string) => `link/${linkId}`;

export const USER_MESSAGES = "feedback";

export const REPLY_ON_MESSAGES = (id: number) => `feedback/${id}`;
