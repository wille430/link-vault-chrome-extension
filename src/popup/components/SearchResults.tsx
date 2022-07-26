import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { ICollection } from '../../shared/entities/ICollection'
import { useAppSelector } from '../hooks/reduxHooks'
import { useAppContext } from '../hooks/useAppContext'
import { getActiveTab } from '../utils/getActiveTab'
import { CollectionsViewState } from '../views/CollectionsView'
import { CollectionList } from './CollectionList'

export const SearchResults = () => {
    const { isLoaded } = useAppSelector((state) => state.cloud)
    const context = useAppContext()
    const {
        data: results,
        error,
        isLoading,
    } = useQuery<ICollection[], any>(['collections'], () => context.collections.getAll(), {
        enabled: isLoaded,
    })

    const navigate = useNavigate()
    const location = useLocation()
    const state = (location.state as CollectionsViewState) ?? {}

    const handleItemClick = async (i: number) => {
        if (!results) return

        const col = results[i]
        if (state.mode === 'select') {
            const tab = await getActiveTab()

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

    if (isLoading || !isLoaded || !results) {
        return (
            <div className='flex-grow-1'>
                <CollectionList onItemClick={handleItemClick} />
            </div>
        )
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
