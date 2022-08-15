import { setCloudLoading } from '../popup/store/cloud'
import { getLinkVault } from './services/LinkVault'

const program = getLinkVault()
window.LinkVault = program
window.context = program.context

program.loadData().then(async () => {
    window.store.dispatch(setCloudLoading(true))
    await program.syncCloud()
    window.store.dispatch(setCloudLoading(false))
})
