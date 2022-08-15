import { ICollection } from '../../shared/entities/ICollection'
import { COLLECTION_COLLECTION_NAME } from '../constants'
import { Repository } from './Repository'

export class CollectionsRepository extends Repository<ICollection> {
    constructor() {
        super(COLLECTION_COLLECTION_NAME)
    }
}
