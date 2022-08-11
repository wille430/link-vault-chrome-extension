import './popup.scss'
import { Route, Routes } from 'react-router'
import { LinksView } from './views/LinksView'
import { CollectionsView } from './views/CollectionsView'
import { CreateLinkView } from './views/CreateLinkView'
import { CreateCollectionView } from './views/CreateCollectionView'

export const Popup = () => {
    return (
        <main className='bg-dark text-white p-2'>
            <Routes>
                <Route path='/' element={<CollectionsView />} />
                <Route path='/new' element={<CreateCollectionView />} />
                <Route path='/:colId' element={<LinksView />} />
                <Route path='/:colId/new' element={<CreateLinkView />} />
                <Route path='/:colId/edit' element={<CreateCollectionView editing />} />
            </Routes>
        </main>
    )
}
