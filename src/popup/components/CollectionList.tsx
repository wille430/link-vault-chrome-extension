import { ICollection } from '../../types/ICollection'
import { ButtonGroup, Dropdown } from 'react-bootstrap'
import { useNavigate } from 'react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { customFetcher } from '../../helpers/customFetcher'
import { insert } from '../../utils/insert'

export type CollectionListProps = {
    collections: ICollection[]
    onItemClick: (index: number) => any
}

export const CollectionList = ({ collections, onItemClick }: CollectionListProps) => {
    const sortByRecent = (a: ICollection, b: ICollection) =>
        new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime() ? -1 : 1

    return (
        <table className='table table-sm table-dark table-striped'>
            <tbody>
                {collections.sort(sortByRecent).map((collection, i) => (
                    <tr key={collection.id} role='button'>
                        <td onClick={() => onItemClick(i)}>{collection.name}</td>

                        <td>
                            <CollectionOptions index={i} collection={collection} />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export type CollectionOptionsProps = {
    collection: ICollection
    index: number
}

function CollectionOptions({ collection, index }: CollectionOptionsProps) {
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const deleteMut = useMutation(
        () => customFetcher(`/collections/${collection.id}`, { method: 'DELETE' }),
        {
            onMutate: () => {
                queryClient.setQueryData(['collections'], (old: any) => {
                    return {
                        ...old,
                        results: old.results.filter((x: ICollection) => x.id !== collection.id),
                    }
                })
            },
            onError: () => {
                queryClient.setQueryData(['collections'], (old: any) => {
                    return {
                        ...old,
                        results: insert(old.results as ICollection[], index, collection),
                    }
                })
            },
        }
    )

    return (
        <Dropdown as={ButtonGroup} size='sm'>
            <Dropdown.Toggle
                as='span'
                role='button'
                variant='info'
                id='dropdown-options'
            ></Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item as='a' onClick={() => navigate(`/${collection.id}`)}>
                    Goto
                </Dropdown.Item>
                <Dropdown.Item
                    as='button'
                    onClick={() => deleteMut.mutate()}
                    disabled={deleteMut.isLoading}
                >
                    Delete
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}
