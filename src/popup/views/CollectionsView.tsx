import { useEffect } from 'react'
import { BsPlus } from 'react-icons/bs'
import { useLocation, useNavigate } from 'react-router'
import { SearchResults } from '../components/SearchResults'

export type CollectionsViewState = {
    //   When undefined, clicking on collections will open them
    mode?: 'select'
}

export const CollectionsView = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const state = (location.state as CollectionsViewState) ?? {}

    useEffect(() => {
        const handleClick = () => {
            navigate(location.pathname, {
                state: {},
            })
        }

        window.addEventListener('contextmenu', handleClick)

        return () => {
            window.removeEventListener('contextmenu', handleClick)
        }
    }, [])

    return (
        <section className='d-flex flex-column flex-grow-1 overflow-auto'>
            <h4 className='mt-2'>My Collections</h4>

            <SearchResults />

            <div className='d-flex gap-2'>
                <button
                    onClick={() =>
                        navigate(location.pathname, {
                            state: { mode: 'select' } as CollectionsViewState,
                        })
                    }
                    className='btn btn-primary flex-grow-1 btn-sm'
                >
                    <BsPlus /> Add from Tab
                </button>

                <button onClick={() => navigate('/new')} className='btn btn-secondary btn-sm'>
                    <BsPlus /> Collection
                </button>
            </div>

            {state.mode === 'select' && (
                <span className='text-center pt-2 text-muted'>
                    <small>
                        Select the collection to add the link to. Return with right mouse button.
                    </small>
                </span>
            )}
        </section>
    )
}
