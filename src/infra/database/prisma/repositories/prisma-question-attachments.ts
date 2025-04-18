import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachment-repository'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaQuestionAttachments
  implements QuestionAttachmentsRepository
{
  async fetchManyByQuestionId(
    questionID: string,
  ): Promise<QuestionAttachment[]> {
    throw new Error('Method not implemented.')
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
