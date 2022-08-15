import { ButtonGroup, Dropdown } from 'react-bootstrap'
import { useNavigate } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { deleteCollection } from '../../shared/actions/collectionActions'
import { ICollection } from '../../shared/entities/ICollection'

export type CollectionOptionsProps = {
    collection: ICollection
}

export function CollectionOptions({ collection }: CollectionOptionsProps) {
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const handleDelete = () => {
        deleteCollection(collection.id)
        queryClient.setQueryData(['collections'], (old: any) => {
            return old.filter((x: ICollection) => x.id !== collection.id)
        })
    }

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
                <Dropdown.Item as='button' onClick={() => handleDelete()}>
                    Delete
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}
