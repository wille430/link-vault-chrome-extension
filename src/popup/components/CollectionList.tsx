import { ICollection } from '../../types/ICollection'
import { CollectionOptions } from './CollectionOptions'

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
                            <CollectionOptions collection={collection} />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
