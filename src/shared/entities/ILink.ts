import { IEntity } from './IEntity'

export interface ILink extends IEntity {
    title: string
    description: string
    url: string
    collectionId: number
}
