import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachment-repository'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'

export class InMemoryAnswerAttachmentRepository
  implements AnswerAttachmentsRepository
{
  public items: AnswerAttachment[] = []

  async fetchManyByAnswerId(answerID: string) {
    const attachments = this.items.filter(
      (item) => item.answerId.toString() === answerID,
    )

    return attachments
  }

  async deleteManyByAnswerId(answerID: string) {
    const attachments = this.items.filter(
      (item) => item.answerId.toString() !== answerID,
    )

    this.items = attachments
  }
}
