import { AppContext } from '../../background/AppContext'
import { LinkVault } from '../../background/services/LinkVault'

declare global {
    interface Window {
        LinkVault: LinkVault
        context: AppContext
    }
}
