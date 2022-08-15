import { AppContext } from '../../background/AppContext'
import { LinkVault } from '../../background/services/LinkVault'
import { store } from '../../popup/store'

declare global {
    interface Window {
        LinkVault: LinkVault
        context: AppContext
        store: typeof store
    }
}
