import { CreateLinkDto } from '../dtos/CreateLinkDto'
import { UpdateLinkDto } from '../dtos/UpdateLinkDto'

export const getLinks = (colId: number) =>
    window.context.links.getAll((link) => link.collectionId === colId)

export const createLink = (createLinkDto: CreateLinkDto) =>
    window.context.links.create(createLinkDto)

export const updateLink = ({ id, ...updateLinkDto }: UpdateLinkDto) =>
    window.context.links.update(id, updateLinkDto)

export const deleteLink = (id: number) => window.context.links.delete(id)
