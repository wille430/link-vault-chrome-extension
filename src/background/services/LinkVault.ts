import _ from 'lodash'
import { ICollection } from '../../shared/entities/ICollection'
import { ILink } from '../../shared/entities/ILink'
import { getStorage } from '../../shared/utils/storage'
import { AppContext } from '../AppContext'
import { DATA_KEY } from '../constants'
import { DropboxService, initialAppData } from './DropboxService'

export interface ApplicationData {
    collections: ICollection[]
    links: ILink[]
}

let _linkVault: LinkVault | undefined

export const getLinkVault = (): LinkVault => {
    if (!_linkVault) {
        _linkVault = new LinkVault()
    }

    return _linkVault
}

export class LinkVault {
    dropboxService: DropboxService
    data?: ApplicationData
    context: AppContext

    constructor() {
        this.dropboxService = new DropboxService()
        this.context = new AppContext()
    }

    _overwrite = false
    async loadData() {
        await this.dropboxService.authenticate()
        let data: ApplicationData

        const objString = await this.dropboxService.loadFile()
        data = JSON.parse(objString)
        console.log(`[${LinkVault.name}] Fetched ${objString.length}B of data from Dropbox`)

        const obj = await getStorage(DATA_KEY)
        const existingData = obj[DATA_KEY] ?? initialAppData
        console.log(
            `[${LinkVault.name}] Loaded ${
                JSON.stringify(existingData).length
            }B of existing data from localStorage`
        )

        if (this._overwrite) {
            await chrome.storage.sync.set({
                [DATA_KEY]: data,
            })
            this.data = data
        } else {
            // merge
            await chrome.storage.sync.set({
                [DATA_KEY]: _.merge(data, existingData) as ApplicationData,
            })
            this.data = _.merge(data, existingData)
        }
        console.log(
            `[${LinkVault.name}] Loaded ${
                JSON.stringify(this.data).length
            }B to memory after merge/overwrite with cloud`
        )

        await this.context.initialize()
    }

    private _syncCloudTimer = setTimeout(() => this._syncCloud.apply(this), 1000)
    private async _syncCloud() {
        console.log(`[LinkVault] Syncing changes with cloud...`)
        await this.dropboxService.syncChanges(this.data)
    }
    async syncCloud() {
        clearTimeout(this._syncCloudTimer)
        this._syncCloudTimer = setTimeout(() => this._syncCloud.apply(this), 1000)
    }

    /**
     *
     * @param path - Path to a nested object key. E.g. /users
     * @returns
     */
    getData(path?: string) {
        if (!this.data) {
            throw new Error('Data has not been loaded yet!')
        }

        if (!path) {
            return this.data as ApplicationData
        }

        let data: any = { ...this.data }

        for (const key of path.split('/')) {
            if (!data[key]) {
                throw new Error('Invalid argument. Path does not exist.')
            }

            data = data[key]
        }

        return data
    }
}
