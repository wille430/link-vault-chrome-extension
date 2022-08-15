import { ICollection } from '../shared/entities/ICollection'
import { ILink } from '../shared/entities/ILink'
import { COLLECTION_COLLECTION_NAME, LINK_COLLECTION_NAME } from './constants'
import { Repository } from './repositories/Repository'
import { getLinkVault } from './services/LinkVault'

export const interceptSave = <TArgs extends any[], T extends Repository<any>, R>(
    instance: T,
    method: (...args: TArgs) => R
) => {
    return (...args: TArgs) => {
        const res = method.apply(instance, args)
        instance.saveAllChanges()
        return res
    }
}

export class AppContext {
    links: Repository<ILink>
    collections: Repository<ICollection>

    constructor() {
        this.links = new Repository<ILink>(LINK_COLLECTION_NAME)
        this.collections = new Repository<ICollection>(COLLECTION_COLLECTION_NAME)

        return new Proxy(this, {
            get(target, prop, receiver) {
                const propVal = target[prop as keyof typeof target]
                if (propVal instanceof Repository) {
                    propVal.create = interceptSave(propVal, propVal.create)
                    propVal.delete = interceptSave(propVal, propVal.delete)
                    propVal.update = interceptSave(propVal, propVal.update)
                    return propVal
                }

                return Reflect.get(target, prop, receiver)
            },
        })
    }

    async initialize() {
        await Promise.allSettled([this.links.loadData(), this.collections.loadData()])
    }

    async saveAllChanges() {
        for (const repo of this.getRepositories()) {
            await repo.saveAllChanges(false)
        }
        await getLinkVault().syncCloud()
    }

    getRepositories() {
        const repos = []
        for (const prop of Object.getOwnPropertyNames(this)) {
            const value = this[prop as keyof this]
            if (value instanceof Repository) {
                repos.push(value as Repository<any>)
            }
        }
        return repos
    }
}
