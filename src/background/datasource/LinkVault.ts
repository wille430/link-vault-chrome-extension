import _ from 'lodash'
import { ICollection } from '../../types/ICollection'
import { ILink } from '../../types/ILink'
import { getStorage } from '../../utils/getStorage'
import { DATA_KEY } from '../constants'
import { DropboxService } from './DropboxService'

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

    constructor() {
        this.dropboxService = new DropboxService()
        this.loadToStorage().then(() => {
            console.log('Loaded data', this.data)
        })
    }

    _overwrite = false
    async loadToStorage() {
        let data: ApplicationData
        const objString = await this.dropboxService.getData()
        data = JSON.parse(objString)

        const obj = await getStorage(DATA_KEY)
        const existingData = obj ? obj[DATA_KEY] : {}

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
    }

    async getData() {
        if (!this.data) await this.loadToStorage()

        return this.data as ApplicationData
    }
}
