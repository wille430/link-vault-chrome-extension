import { getLinkVault } from './services/LinkVault'

const program = getLinkVault()
window.LinkVault = program
window.context = program.context

program.loadData()
