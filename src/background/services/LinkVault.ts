import _ from 'lodash'
import { ICollection } from '../../shared/entities/ICollection'
import { ILink } from '../../shared/entities/ILink'
import { setCloudLoaded, setCloudSyncState } from '../../shared/store/cloud'
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
    context: AppContext

    constructor() {
        this.dropboxService = new DropboxService()
        this.context = new AppContext()
    }

    _overwrite = false
    async loadData() {
        window.store.dispatch(setCloudLoaded(false))

        await this.dropboxService.authenticate()
        let data: ApplicationData

        window.store.dispatch(setCloudSyncState(true))
        const objString = await this.dropboxService.loadFile()
        try {
            data = JSON.parse(objString)
        } catch (e) {
            // TODO: handle parse error
            data = initialAppData
        }
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
        } else {
            // merge
            data = _.merge(data, existingData) as ApplicationData
            await chrome.storage.sync.set({
                [DATA_KEY]: data,
            })
        }
        console.log(
            `[${LinkVault.name}] Loaded ${
                JSON.stringify(data).length
            }B to memory after merge/overwrite with cloud`
        )

        await this.context.initialize()
        window.store.dispatch(setCloudSyncState(false))
    }

    private _syncCloudTimer = setTimeout(() => this._syncCloud.apply(this), 1000)
    private async _syncCloud() {
        console.log(`[LinkVault] Syncing changes with cloud...`)
        window.store.dispatch(setCloudSyncState(true))
        await this.dropboxService.syncChanges(
            await getStorage(DATA_KEY).then((res) => res[DATA_KEY])
        )
        window.store.dispatch(setCloudSyncState(false))
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
    async getData(path?: string) {
        let data = await getStorage(DATA_KEY).then((res) => res[DATA_KEY])

        if (!path) {
            return data
        }

        for (const key of path.split('/')) {
            if (!data[key]) {
                throw new Error('Invalid argument. Path does not exist.')
            }

            data = data[key]
        }

        return data
    }
}
