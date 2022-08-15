import { ICollection } from '../entities/ICollection'

export interface CreateCollectionDto extends Pick<ICollection, 'name'> {}
