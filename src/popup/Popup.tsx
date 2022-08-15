import './popup.scss'
import { Route, Routes } from 'react-router'
import { LinksView } from './views/LinksView'
import { CollectionsView } from './views/CollectionsView'
import { CreateLinkView } from './views/CreateLinkView'
import { CreateCollectionView } from './views/CreateCollectionView'
import { useEffect, useState } from 'react'

export const Popup = () => {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        window.LinkVault.loadData().then(() => {
            setLoading(false)
        })

        // Save before exit (not working)
        window.onbeforeunload = async () => {
            console.log(`[Popup] Exiting... Saving changes...`)
            await window.context.saveAllChanges()
        }
    }, [])

    return (
        <main className='bg-dark text-white p-2'>
            {loading ? (
                <span>Loading...</span>
            ) : (
                <Routes>
                    <Route path='/' element={<CollectionsView />} />
                    <Route path='/new' element={<CreateCollectionView />} />
                    <Route path='/:colId' element={<LinksView />} />
                    <Route path='/:colId/new' element={<CreateLinkView />} />
                    <Route path='/:colId/edit' element={<CreateCollectionView editing />} />
                </Routes>
            )}
        </main>
    )
}
