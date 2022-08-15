import { ILink } from '../../shared/entities/ILink'
import { LINK_COLLECTION_NAME } from '../constants'
import { Repository } from './Repository'

export class LinksRepository extends Repository<ILink> {
    constructor() {
        super(LINK_COLLECTION_NAME)
    }
}
