import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-parms'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachment-repository'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

export class InMemoryAnswersRepository implements AnswersRepository {
  constructor(
    private answerAttachmentRepository: AnswerAttachmentsRepository,
  ) {}

  public items: Answer[] = []

  async create(answer: Answer) {
    this.items.push(answer)
    this.answerAttachmentRepository.createMany(answer.attachments.getItems())

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async delete(answer: Answer) {
    this.items = this.items.filter(
      (item) => item.id.toString() !== answer.id.toString(),
    )

    this.answerAttachmentRepository.deleteManyByAnswerId(answer.id.toString())
  }

  async save(answer: Answer) {
    const ItemIndex = this.items.findIndex(
      (item) => item.id.toString() === answer.id.toString(),
    )
    this.answerAttachmentRepository.createMany(answer.attachments.getNewItems())

    this.answerAttachmentRepository.deleteMany(
      answer.attachments.getRemovedItems(),
    )

    this.items[ItemIndex] = answer
    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async findById(id: string) {
    const answer = this.items.find((item) => item.id.toValue() === id)

    if (!answer) {
      return null
    }

    return answer
  }

  async fetchManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const answers = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)

    return answers
  }
}
