import { getLinkVault } from './services/LinkVault'
import { startMessageListener } from './lib/messaging'

getLinkVault()
    .loadData()
    .then(() => {
        startMessageListener()
    })
