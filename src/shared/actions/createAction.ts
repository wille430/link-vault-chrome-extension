import { Action } from '../types/Action'

export const createAction = <T extends any[], R>(
    type: string,
    payloadFunc?: (...args: T) => R | R
): ((...args: T) => Action) => {
    return (...args: T) => ({
        type,
        payload: typeof payloadFunc === 'function' ? payloadFunc(...args) : payloadFunc,
    })
}
