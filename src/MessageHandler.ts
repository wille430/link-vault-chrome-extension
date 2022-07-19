import { CrudAction } from "./types/CrudAction";

export type Message<T extends Resource, K = any> = {
  action: ResourceAction<T>;
  payload: K;
};

export type OnMessageCallback<T extends Resource> = (
  message: Message<T, any>,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => void;

export type Resource = "Link" | "User" | "AuthUser";
export type ResourceAction<T extends Resource> = `${T}${CrudAction}`;

export class MessageHandler<T extends Resource> {
  actionCallbackMap: Partial<Record<ResourceAction<T>, OnMessageCallback<T>>> =
    {};

  constructor() {
    this.addListener();
  }

  log(...args: Parameters<typeof console.log>) {
    process.env.NODE_ENV === "development" && console.log(...args);
  }

  addCase(action: ResourceAction<T>, callback: OnMessageCallback<T>) {
    this.log(`[MessageHandler]: Adding case ${action}`);
    this.actionCallbackMap[action] = callback;
  }

  addListener() {
    chrome.runtime.onMessage.addListener(this.handleMessage);
  }

  handleMessage: OnMessageCallback<T> = (...args) => {
    const [msg] = args;
    console.log(`[${__filename}] Responding to action: ${msg.action}`);

    const func = this.actionCallbackMap[msg.action];

    if (!func) {
      return true;
    }

    func(...args);
    return true;
  };
}
