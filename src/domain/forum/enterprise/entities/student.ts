import { Entity } from '@/core/entities/entitie'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface StudentProps {
  name: string
}

export class Student extends Entity<StudentProps> {
  static create(props: StudentProps, id?: UniqueEntityID) {
    const answer = new Student(
      {
        ...props,
      },
      id,
    )

    return answer
  }

  get name() {
    return this.props.name
  }
}
