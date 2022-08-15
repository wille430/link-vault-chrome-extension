import { ILink } from '../entities/ILink'

export interface CreateLinkDto
    extends Pick<ILink, 'collectionId' | 'title' | 'description' | 'url'> {}
