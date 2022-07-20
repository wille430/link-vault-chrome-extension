import { CrudAction } from "./types/CrudAction";

export type ActionType = string;

export type Message<K = any> = {
  action: ActionType;
  payload: K;
};

export type OnMessageCallback<T> = (
  message: Message<T>,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => void;

export class MessageHandler {
  actionCallbackMap: Partial<Record<ActionType, OnMessageCallback<any>>> = {};

  constructor() {
    this.addListener();
  }

  log(...args: Parameters<typeof console.log>) {
    process.env.NODE_ENV === "development" && console.log(...args);
  }

  addCase<T extends string>(action: T, callback: OnMessageCallback<any>) {
    this.log(`[MessageHandler]: Adding case ${action}`);
    this.actionCallbackMap[action] = callback;
    return this;
  }

  addListener() {
    chrome.runtime.onMessage.addListener(this.handleMessage);
  }

  handleMessage: OnMessageCallback<any> = (...args) => {
    const [msg] = args;
    console.log(`[${__filename}] Responding to action: ${msg.action}`);

    const func = this.actionCallbackMap[msg.action];

    if (!func) {
      return true;
    }

    try {
      func(...args);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };
}

export type MessageHandlerBuilder = (builder: MessageHandler) => void;

export type CreateMessageOptions = {
  builder: MessageHandlerBuilder;
};

export const createMessageHandler = (options: CreateMessageOptions) => {
  const messageHandler = new MessageHandler();
  options.builder(messageHandler);
};
