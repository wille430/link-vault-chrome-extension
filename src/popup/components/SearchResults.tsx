import { useQuery } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router'
import { getCollections } from '../../shared/actions'
import { ICollection } from '../../shared/entities/ICollection'
import { sendMessage } from '../lib/sendMessage'
import { CollectionsViewState } from '../views/CollectionsView'
import { CollectionList } from './CollectionList'

export const SearchResults = () => {
    const {
        data: results,
        error,
        isLoading,
    } = useQuery<ICollection[], any>(['collections'], () => sendMessage(getCollections()))

    const navigate = useNavigate()
    const location = useLocation()
    const state = (location.state as CollectionsViewState) ?? {}

    const handleItemClick = async (i: number) => {
        if (!results) return

        const col = results[i]
        if (state.mode === 'select') {
            let [tab] = await chrome.tabs.query({
                active: true,
                currentWindow: true,
            })

            if (!tab.id || !tab.url) return

            navigate(`/${col.id}/new`, {
                state: {
                    url: tab.url,
                    title: tab.title,
                },
            })
        } else {
            navigate(`/${col.id}`)
        }
    }

    if (error) {
        return (
            <span className='text-white center flex-grow-1 px-4 text-center'>
                {error.message === 'Failed to fetch'
                    ? 'Could not establish a connection to the server'
                    : 'An error occurred'}
            </span>
        )
    }

    if (isLoading || !results) {
        return <span className='text-white center flex-grow-1'>Loading...</span>
    }

    if (!results.length) {
        return <span className='text-white center flex-grow-1'>No collections found</span>
    }

    return (
        <div className='flex-grow-1'>
            <CollectionList onItemClick={handleItemClick} collections={results} />
        </div>
    )
}
