import { ICollection } from '../../types/ICollection'
import { ButtonGroup, Dropdown } from 'react-bootstrap'
import { useNavigate } from 'react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { customFetcher } from '../../helpers/customFetcher'

export type CollectionOptionsProps = {
    collection: ICollection
}

export function CollectionOptions({ collection }: CollectionOptionsProps) {
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
                <Dropdown.Item as='a' onClick={() => navigate(`/${collection.id}/edit`)}>
                    Edit
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
