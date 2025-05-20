import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachment-repository'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'

export class InMemoryAnswerAttachmentRepository
  implements AnswerAttachmentsRepository
{
  public items: AnswerAttachment[] = []

  async createMany(attachments: AnswerAttachment[]): Promise<void> {
    this.items.push(...attachments)
  }

  async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
    this.items = this.items.filter((item) => {
      return !attachments.some((attachment) => attachment.equals(item))
    })
  }

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
