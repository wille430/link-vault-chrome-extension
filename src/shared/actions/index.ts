import { CreateCollectionDto } from '../dtos/CreateCollectionDto'
import { Action } from '../types/Action'
import { CollectionsActionTypes } from './actionTypes'

export const createAction = <T extends any[], R>(
    type: string,
    payloadFunc?: (...args: T) => R | R
): ((...args: T) => Action) => {
    return (...args: T) => ({
        type,
        payload: typeof payloadFunc === 'function' ? payloadFunc(...args) : payloadFunc,
    })
}

export const getCollections = createAction(CollectionsActionTypes.GET_COLLECTIONS)

export const createCollection = createAction(
    CollectionsActionTypes.CREATE_COLLECTION,
    (collection: CreateCollectionDto) => collection
)

export const updateCollection = createAction(
    CollectionsActionTypes.UPDATE_COLLECTION,
    (collection: CreateCollectionDto) => collection
)

export const getCollection = createAction(CollectionsActionTypes.GET_COLLECTION, (id: string) => id)

export default [getCollections, createCollection, updateCollection, getCollection]
