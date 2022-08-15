import _ from 'lodash'
import { CollectionsActionTypes, LinksActionTypes } from '../../shared/actions/actionTypes'
import { CreateCollectionDto } from '../../shared/dtos/CreateCollectionDto'
import { UpdateCollectionDto } from '../../shared/dtos/UpdateCollectionDto'
import { AppContext } from '../AppContext'
import { MessageBusService } from '../services/MessageBusService'

export const registerEvents = (messageBuService: MessageBusService, context: AppContext) => {
    messageBuService
        .register(CollectionsActionTypes.GET_COLLECTIONS, () => {
            return context.collections.getAll()
        })
        .register(CollectionsActionTypes.GET_COLLECTION, (id: number) => {
            return context.collections.getById(id)
        })
        .register(CollectionsActionTypes.CREATE_COLLECTION, async (dto: CreateCollectionDto) => {
            const collection = context.collections.create(dto)
            await context.collections.saveAllChanges()
            return collection
        })
        .register(
            CollectionsActionTypes.UPDATE_COLLECTION,
            async ({ id, ...dto }: UpdateCollectionDto) => {
                const collection = context.collections.update(id, dto)
                await context.collections.saveAllChanges()
                return collection
            }
        )
        .register(CollectionsActionTypes.DELETE_COLLECTION, async (id: number) => {
            context.collections.delete(id)
            await context.collections.saveAllChanges()
        })

    messageBuService
        .register(LinksActionTypes.GET_LINKS, (colId: number) => {
            return context.links.getAll((link) => link.collectionId === colId)
        })
        .register(LinksActionTypes.GET_LINK, (id: number) => {
            return context.links.getById(id)
        })
}
