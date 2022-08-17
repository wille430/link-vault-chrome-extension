import { createStore } from '../popup/store'
import { getLinkVault } from './services/LinkVault'

const program = getLinkVault()
window.LinkVault = program
window.context = program.context
window.store = createStore()

program.loadData().then(async () => {
    await program.syncCloud()
})
