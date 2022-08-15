import { Action } from '../../shared/types/Action'
export const sendMessage = async <R = any>(action: Action): Promise<R> => {
    return await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(action, (res) => {
            if (chrome.runtime.lastError) {
                reject(res)
            }

            resolve(res)
        })
    })
}
