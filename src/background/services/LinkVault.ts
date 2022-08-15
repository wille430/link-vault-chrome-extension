import _ from 'lodash'
import { ICollection } from '../../shared/entities/ICollection'
import { ILink } from '../../shared/entities/ILink'
import { getStorage } from '../../utils/getStorage'
import { AppContext } from '../AppContext'
import { DATA_KEY } from '../constants'
import { registerEvents } from '../lib/messaging'
import { DropboxService } from './DropboxService'
import { MessageBusService } from './MessageBusService'

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
    messageBuService: MessageBusService
    context: AppContext

    constructor() {
        this.dropboxService = new DropboxService()
        this.messageBuService = new MessageBusService()
        this.context = new AppContext()
    }

    _overwrite = false
    async loadData() {
        let data: ApplicationData
        const objString = await this.dropboxService.loadFile()
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

    registerEvents() {
        return registerEvents(this.messageBuService, this.context)
    }
}
