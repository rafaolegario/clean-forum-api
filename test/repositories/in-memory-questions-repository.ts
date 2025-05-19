import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-parms'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachment-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/question-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'

export class InMemoryQuestionRepository implements QuestionsRepository {
  constructor(
    private questionAttachmentRepository: QuestionAttachmentsRepository,
  ) {}

  public items: Question[] = []

  async create(question: Question) {
    this.items.push(question)
    this.questionAttachmentRepository.createMany(
      question.attachments.getItems(),
    )
    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async delete(question: Question) {
    this.items = this.items.filter(
      (item) => item.id.toString() !== question.id.toString(),
    )

    this.questionAttachmentRepository.deleteManyByQuestionId(
      question.id.toString(),
    )
  }

  async save(question: Question) {
    const ItemIndex = this.items.findIndex(
      (item) => item.id.toString() === question.id.toString(),
    )

    this.questionAttachmentRepository.createMany(
      question.attachments.getNewItems(),
    )

    this.questionAttachmentRepository.deleteMany(
      question.attachments.getRemovedItems(),
    )

    this.items[ItemIndex] = question
    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async findBySlug(slug: string) {
    const questions = this.items.find((item) => item.slug.value === slug)

    if (!questions) {
      return null
    }

    return questions
  }

  async findById(id: string) {
    const question = this.items.find((item) => item.id.toValue() === id)

    if (!question) {
      return null
    }

    return question
  }

  async findManyRecent({ page }: PaginationParams) {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return questions
  }
}
