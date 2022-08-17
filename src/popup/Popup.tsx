import './popup.scss'
import { Route, Routes } from 'react-router'
import { LinksView } from './views/LinksView'
import { CollectionsView } from './views/CollectionsView'
import { CreateLinkView } from './views/CreateLinkView'
import { CreateCollectionView } from './views/CreateCollectionView'
import { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import { store } from './store'

export const Popup = () => {
    const [_store, setStore] = useState(store)

    useEffect(() => {
        // Save before exit (not working)
        window.onbeforeunload = async () => {
            console.log(`[Popup] Exiting... Saving changes...`)
            await window.context.saveAllChanges()
        }
    }, [])

    useEffect(() => {
        chrome.runtime.getBackgroundPage((page) => {
            if (page) {
                setStore(page.window.store)
            }
        })
    }, [])

    return (
        <Provider store={_store}>
            <main className='bg-dark text-white p-2'>
                {_store.getState().cloud.isConnected ? (
                    <Routes>
                        <Route path='/' element={<CollectionsView />} />
                        <Route path='/new' element={<CreateCollectionView />} />
                        <Route path='/:colId' element={<LinksView />} />
                        <Route path='/:colId/new' element={<CreateLinkView />} />
                        <Route path='/:colId/edit' element={<CreateCollectionView editing />} />
                    </Routes>
                ) : (
                    <span className='my-auto text-center'>Connecting to dropbox...</span>
                )}
            </main>
        </Provider>
    )
}
