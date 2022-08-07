import { Message } from "../MessageHandler";
import { LinkAction } from "../types/Actions";

export const sendMessage = <T>(action: any, payload: any = null) => {
  return new Promise<T>((resolve, reject) => {
    chrome.runtime.sendMessage<Message>(
      {
        action,
        payload,
      },
      (res) => {
        const lastError = chrome.runtime.lastError;

        if (lastError) {
          reject(lastError);
        } else {
          resolve(res);
        }
      }
    );
  });
};
