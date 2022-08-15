import { Action } from '../../shared/types/Action'

type EventMethod = (...args: any) => Promise<any> | any

export class MessageBusService {
    private eventMap: Record<string, EventMethod> = {}

    register(eventName: string, callback: EventMethod): this {
        this.eventMap[eventName] = callback
        return this
    }

    remove(eventName: string) {
        delete this.eventMap[eventName]
    }

    async handleMessage(request: Action, sender: any, sendResponse: (...args: any[]) => any) {
        if (!this.eventMap[request.type]) return undefined

        const res = await this.eventMap[request.type](request.payload)
        sendResponse(res)
        return res
    }

    startListening() {
        chrome.runtime.onMessage.addListener(this.handleMessage)
    }
}
