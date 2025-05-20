import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachment-repository'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'

export class InMemoryQuestionAttachmentRepository
  implements QuestionAttachmentsRepository
{
  public items: QuestionAttachment[] = []

  async createMany(attachments: QuestionAttachment[]): Promise<void> {
    this.items.push(...attachments)
  }

  async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
    this.items = this.items.filter((item) => {
      return !attachments.some((attachment) => attachment.equals(item))
    })
  }

  async fetchManyByQuestionId(questionID: string) {
    const attachments = this.items.filter(
      (item) => item.questionId.toString() === questionID,
    )

    return attachments
  }

  async deleteManyByQuestionId(questionID: string) {
    const attachments = this.items.filter(
      (item) => item.questionId.toString() !== questionID,
    )

    this.items = attachments
  }
}
