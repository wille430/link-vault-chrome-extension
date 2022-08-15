import _ from 'lodash'
import { IEntity } from '../../shared/entities/IEntity'
import { getStorage, setStorage } from '../../shared/utils/storage'
import { DATA_KEY } from '../constants'
import { getLinkVault } from '../services/LinkVault'

export class Repository<T extends IEntity> {
    collectionName: string
    data: T[]

    private get nextId(): number {
        const maxId = Math.max(...this.data.map((o) => o.id ?? 0))
        if (isFinite(maxId)) {
            return maxId + 1
        } else {
            return 0
        }
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
        const newEntity = {
            ...entity,
            createdAt: new Date(),
            updatedAt: new Date(),
        } as T
        newEntity.id = this.nextId
        this.data.push(newEntity)
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
        this.data.splice(index, 1)
    }

    async saveAllChanges(sync: boolean = true) {
        console.log(`[${Repository.name}(${this.collectionName})] Saving changes`)
        await setStorage(`${DATA_KEY}.${this.collectionName}`, this.data)
        // @ts-ignore
        getLinkVault().data[this.collectionName] = this.data
        sync && (await getLinkVault().syncCloud())
    }
}
