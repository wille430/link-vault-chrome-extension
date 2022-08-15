import { IEntity } from './IEntity'

export interface ILink extends IEntity {
    url: string
    userId: string
}
