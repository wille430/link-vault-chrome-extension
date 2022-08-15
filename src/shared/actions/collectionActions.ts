import { CreateCollectionDto } from '../dtos/CreateCollectionDto'
import { UpdateCollectionDto } from '../dtos/UpdateCollectionDto'

export const getCollections = () => window.context.collections.getAll()

export const createCollection = (createCollectionDto: CreateCollectionDto) =>
    window.context.collections.create(createCollectionDto)

export const updateCollection = ({ id, ...updateCollectionDto }: UpdateCollectionDto) =>
    window.context.collections.update(id, updateCollectionDto)

export const getCollection = (id: number) => window.context.collections.getById(id)

export const deleteCollection = (id: number) => window.context.collections.delete(id)
