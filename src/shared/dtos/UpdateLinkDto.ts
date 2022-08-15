import { CreateLinkDto } from './CreateLinkDto'

export interface UpdateLinkDto extends Partial<CreateLinkDto> {
    id: number
}
