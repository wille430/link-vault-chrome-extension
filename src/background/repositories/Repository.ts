import _ from 'lodash'
import { IEntity } from '../../shared/entities/IEntity'
import { getStorage } from '../../utils/getStorage'
import { DATA_KEY } from '../constants'
import { getLinkVault } from '../services/LinkVault'

export class Repository<T extends IEntity> {
    collectionName: string
    data: T[]

    private _nextId?: number | undefined
    private get nextId(): number {
        if (!this._nextId) {
            this._nextId = Math.max(...this.data.map((o) => o.id))
        } else {
            this._nextId = 0
        }
        const ret = this._nextId
        this._nextId += 1

        return ret
    }

    constructor(collectionName: string) {
        this.collectionName = collectionName
        this.data = []
    }

    async loadData() {
        this.data = await getStorage(DATA_KEY).then(
            (res) => (res[DATA_KEY] ?? {})[this.collectionName] ?? []
        )
        console.log(
            `[${Repository.name}(${this.collectionName})] Loaded data (${
                JSON.stringify(this.data).length
            }B)`
        )
    }

    getById(id: number) {
        return this.data.find((o) => o.id === id)
    }

    getAll(filter?: Parameters<Array<T>['filter']>[0]) {
        if (filter) {
            return this.data.filter(filter)
        } else {
            return this.data
        }
    }

    create(entity: Omit<T, 'createdAt' | 'updatedAt' | 'id'>) {
        this.data.push({
            id: this.nextId,
            createdAt: new Date(),
            updatedAt: new Date(),
            ...entity,
        } as T)
        return entity
    }

    update(id: number, update: Partial<T>) {
        const index = this.data.findIndex((o) => o.id === id)
        if (index < 0) {
            throw new Error(`Entity with id ${id} could not be found`)
        }

        const entity = { ...this.data[index], ...update }
        this.data[index] = entity

        return entity
    }

    delete(id: number) {
        const index = this.data.findIndex((o) => o.id === id)
        this.data.splice(index + 1)
    }

    async saveAllChanges() {
        const linkVault = getLinkVault()

        const data = linkVault.getData()
        linkVault.data = {
            ...data,
            [this.collectionName]: this.data,
        }

        await chrome.storage.local.set({ [DATA_KEY]: linkVault.data })
    }
}
