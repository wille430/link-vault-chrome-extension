import { getLinkVault } from './services/LinkVault'

const program = getLinkVault()

program.loadData().then(() => {
    program.registerEvents()
})
