import moment from 'moment'
import { ILink } from '../../types/ILink'
import capitalize from 'lodash/capitalize'

export type LinkListProps = {
    links: ILink[]
}

export const LinkList = ({ links }: LinkListProps) => {
    const sortByRecent = ({ createdAt }: ILink, { createdAt: createdAtB }: ILink) =>
        new Date(createdAt).getTime() > new Date(createdAtB).getTime() ? -1 : 1

    return (
        <table className='table table-dark table-striped'>
            <tbody>
                {links.sort(sortByRecent).map((link) => (
                    <tr key={link.id}>
                        <td className='d-flex flex-column'>
                            <a
                                className='text-truncate'
                                href={link.url}
                                target='_blank'
                                style={{ maxWidth: '14rem' }}
                            >
                                {link.url}
                            </a>
                            <span className='fs-7'>
                                {capitalize(
                                    moment(new Date(link.updatedAt ?? link.createdAt)).fromNow()
                                )}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
