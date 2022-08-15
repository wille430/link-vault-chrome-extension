import { ICollection } from '../shared/entities/ICollection'
import { ILink } from '../shared/entities/ILink'
import { COLLECTION_COLLECTION_NAME, LINK_COLLECTION_NAME } from './constants'
import { Repository } from './repositories/Repository'

export class AppContext {
    links: Repository<ILink>
    collections: Repository<ICollection>

    constructor() {
        this.links = new Repository<ILink>(LINK_COLLECTION_NAME)
        this.collections = new Repository<ICollection>(COLLECTION_COLLECTION_NAME)
    }

    async initialize() {
        await Promise.allSettled([this.links.loadData(), this.collections.loadData()])
    }

    async saveAllChanges() {
        await Promise.allSettled([this.links.saveAllChanges(), this.collections.saveAllChanges()])
    }
}
