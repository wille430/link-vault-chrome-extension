import { DropboxClient, generateAuthorisationURL } from '@buttercup/dropbox-client'
import {
    ACCESS_TOKEN,
    ACCESS_TOKEN_EXPIRES,
    CLIENT_ID,
    DEFAULT_DATA_PATH,
    REDIRECT_URL,
} from '../constants'
import axios from 'axios'
import _ from 'lodash'
import { getStorage } from '../../utils/getStorage'
import { ApplicationData } from './LinkVault'

export const initialAppData: ApplicationData = {
    links: [],
    collections: [],
}

export class DropboxService {
    client?: DropboxClient | undefined
    token?: string | undefined
    expires?: Date | undefined

    async authenticate() {
        return new Promise<void>(async (resolve) => {
            await this.loadCredentials()

            if (this.token && this.expires && Date.now() > this.expires.getTime()) {
                try {
                    await this.refreshToken()
                    return resolve()
                } catch (e) {}
            }

            if (this.token) {
                return resolve()
            }

            const url = generateAuthorisationURL(CLIENT_ID, REDIRECT_URL)
            chrome.tabs.create({ url })

            const fetchAccessToken = async (
                id: any,
                changeInfo: chrome.tabs.TabChangeInfo,
                tab: chrome.tabs.Tab
            ) => {
                if (!tab || !tab.url) return

                if (new RegExp(`^${REDIRECT_URL}`).test(tab.url)) {
                    await this.saveCredentials(getAccessTokenMeta(tab.url))

                    if (this.token) this.client = new DropboxClient(this.token, { compat: true })
                    cleanup()
                }
            }

            const cleanup = () => {
                chrome.tabs.onUpdated.removeListener(fetchAccessToken)
                resolve()
            }
            chrome.tabs.onUpdated.addListener(fetchAccessToken)
        })
    }

    async loadFile(): Promise<string> {
        if (!this.client) {
            throw new Error('Acccess token not set')
        }

        const info = await this.client?.getInfo(DEFAULT_DATA_PATH).catch((e) => undefined)
        if (!info) {
            await this.client.putFileContents(DEFAULT_DATA_PATH, JSON.stringify(initialAppData))
        }

        return await this.client.getFileContents(DEFAULT_DATA_PATH)
    }

    async refreshToken() {
        console.log('Refreshing token...')
        const { data } = await axios.post(
            'https://api.dropbox.com/oauth2/token',
            {
                grant_type: 'refresh_token',
            },
            {
                headers: {
                    Authorization: `Bearer ${this.token}`,
                },
            }
        )

        this.token = data.access_token
        this.expires = data.expires_in
            ? new Date(Date.now() + parseInt(data.expires_in) * 1000)
            : undefined
    }

    async saveCredentials(res?: AccessTokenMeta) {
        this.token = res?.access_token
        this.expires = res?.expires_in
            ? new Date(Date.now() + parseInt(res.expires_in) * 1000)
            : undefined

        await chrome.storage.local.set({
            ACCESS_TOKEN: this.token,
            ACCESS_TOKEN_EXPIRES: this.expires,
        })
    }

    async loadCredentials() {
        const data = await getStorage([ACCESS_TOKEN, ACCESS_TOKEN_EXPIRES])

        this.token = data[ACCESS_TOKEN]
        this.expires = data[ACCESS_TOKEN_EXPIRES]
            ? new Date(Date.now() + parseInt(data[ACCESS_TOKEN_EXPIRES]) * 1000)
            : undefined

        if (this.token) this.client = new DropboxClient(this.token)

        console.log(`Loaded credentials ${JSON.stringify(data)}`)
    }
}

interface AccessTokenMeta {
    access_token: string
    token_type: string
    expires_in: string
    scope: string
    uid: string
    account_id: string
}

const getAccessTokenMeta = (url: string): AccessTokenMeta | undefined => {
    try {
        const urlObj = new URL(url)
        const params: [string, string][] = urlObj.hash
            .slice(1)
            .split('&')
            .map((x) => x.split('=') as [string, string])

        return params.reduce((prev, [key, value]) => {
            prev[key as keyof AccessTokenMeta] = value
            return prev
        }, {} as Partial<AccessTokenMeta>) as AccessTokenMeta
    } catch (e) {
        return undefined
    }
}
