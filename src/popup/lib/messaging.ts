import { Action } from '../../shared/types/Action'
import { ICollection } from '../../types/ICollection'

export const getCollections = async (): Promise<ICollection[]> =>
    sendMessage({
        type: 'GET_COLLECTIONS',
        payload: {},
    }) as any

export const sendMessage = async (action: Action) =>
    await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(action, (res) => {
            if (chrome.runtime.lastError) {
                reject(res)
            }

            resolve(res)
        })
    })
