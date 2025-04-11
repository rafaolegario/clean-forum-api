import { Optional } from '@/core/@types/optional'
import { Entity } from '@/core/entities/entitie'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface NoficationProps {
  recipientId: UniqueEntityID
  title: string
  content: string
  readAt?: Date
  createdAt: Date
}

export class Notification extends Entity<NoficationProps> {
  get recipientId() {
    return this.props.recipientId
  }

  get title() {
    return this.props.title
  }

  get content() {
    return this.props.content
  }

  get createdAt() {
    return this.props.createdAt
  }

  get readAt() {
    return this.props.readAt
  }

  read() {
    this.props.readAt = new Date()
  }

  static create(
    props: Optional<NoficationProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const notification = new Notification(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return notification
  }
}
