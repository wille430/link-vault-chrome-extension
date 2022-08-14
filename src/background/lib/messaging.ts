import { Action } from '../../shared/types/Action'
import { getLinkVault } from '../datasource/LinkVault'

const linkVault = getLinkVault()

const handleMessage = async (
    request: Action,
    sender: any,
    sendResponse: (...args: any[]) => any
) => {
    const map: Record<string, (args?: Record<any, any>) => Promise<any> | any> = {
        GET_COLLECTIONS: () => linkVault.getData().then((o) => o.collections),
    }

    if (map[request.type]) {
        const res = await map[request.type as string](request.payload)
        console.log({ res })
        sendResponse(res)
        return res
    }

    return undefined
}

export const startMessageListener = () => {
    chrome.runtime.onMessage.addListener(handleMessage)
}
