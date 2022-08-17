import { ICollection } from '../../shared/entities/ICollection'
import { CollectionOptions } from './CollectionOptions'

export type CollectionListProps = {
    collections?: ICollection[]
    onItemClick: (index: number) => any
}

export const CollectionList = ({ collections, onItemClick }: CollectionListProps) => {
    const sortByRecent = (a: ICollection, b: ICollection) =>
        new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime() ? -1 : 1

    return (
        <table className='table table-sm table-dark table-striped'>
            <tbody>
                {collections
                    ? collections.sort(sortByRecent).map((collection, i) => (
                          <tr key={collection.id} role='button'>
                              <td onClick={() => onItemClick(i)}>{collection.name}</td>

                              <td>
                                  <CollectionOptions collection={collection} />
                              </td>
                          </tr>
                      ))
                    : //   Load skeleton
                      Array(5)
                          .fill(null)
                          .map((o, i) => (
                              <tr key={i}>
                                  <td className='pt-2'>
                                      <span
                                          className='text-secondary rounded bg-secondary d-block'
                                          style={{ width: '8rem', height: '0.7rem', opacity: 0.5 }}
                                      ></span>
                                  </td>

                                  <td style={{ color: 'transparent', userSelect: 'none' }}>TEXT</td>
                              </tr>
                          ))}
            </tbody>
        </table>
    )
}
