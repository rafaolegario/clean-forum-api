import { Entity } from '@/core/entities/entitie'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface AttachmentProps {
  title: string
  url: string
  // parentId: string
  // parentType: 'question' | 'answer'
}

export class Attachment extends Entity<AttachmentProps> {
  get title() {
    return this.props.title
  }

  get url() {
    return this.props.url
  }

  static create(props: AttachmentProps, id?: UniqueEntityID) {
    const attachment = new Attachment(props, id)

    return attachment
  }
}
