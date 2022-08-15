import _ from 'lodash'
import { CollectionsActionTypes, LinksActionTypes } from '../../shared/actions/actionTypes'
import { CreateCollectionDto } from '../../shared/dtos/CreateCollectionDto'
import { UpdateCollectionDto } from '../../shared/dtos/UpdateCollectionDto'
import { Action } from '../../shared/types/Action'
import { AppContext } from '../AppContext'

const handleMessage = async (
    request: Action,
    sender: any,
    sendResponse: (...args: any[]) => any
) => {
    const context = new AppContext()

    const map: Record<string, () => Promise<any> | any> = {
        [CollectionsActionTypes.GET_COLLECTIONS]: () => {
            return context.collections.getAll()
        },
        [CollectionsActionTypes.GET_COLLECTION]: () => {
            return context.collections.getById(request.payload)
        },
        [CollectionsActionTypes.CREATE_COLLECTION]: async () => {
            const dto = request.payload as CreateCollectionDto
            const collection = context.collections.create(dto)
            await context.collections.saveAllChanges()
            return collection
        },
        [CollectionsActionTypes.UPDATE_COLLECTION]: async () => {
            const { id, ...dto } = request.payload as UpdateCollectionDto
            const collection = context.collections.update(id, dto)
            await context.collections.saveAllChanges()
            return collection
        },
        [CollectionsActionTypes.DELETE_COLLECTION]: async () => {
            context.collections.delete(request.payload)
            await context.collections.saveAllChanges()
        },
    }

    if (map[request.type]) {
        const res = await map[request.type as string]()
        sendResponse(res)
        return res
    }

    return undefined
}

export const startMessageListener = () => {
    chrome.runtime.onMessage.addListener(handleMessage)
}
