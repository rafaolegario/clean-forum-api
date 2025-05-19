import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import {
  QuestionAttachment,
  QuestionAttachmentProps,
} from '@/domain/forum/enterprise/entities/question-attachment'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function MakeQuestionAttachment(
  override: Partial<QuestionAttachmentProps> = {},
  id?: UniqueEntityID,
) {
  const questionAttachment = QuestionAttachment.create(
    {
      questionId: new UniqueEntityID(),
      attachmentId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return questionAttachment
}

@Injectable()
export class QuestionAttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestionAttachment(
    data: Partial<QuestionAttachmentProps> = {},
  ): Promise<QuestionAttachment> {
    const QuestionAttachment = MakeQuestionAttachment(data)

    await this.prisma.attachment.update({
      where: {
        id: QuestionAttachment.attachmentId.toString(),
      },
      data: {
        questionId: QuestionAttachment.questionId.toString(),
      },
    })

    return QuestionAttachment
  }
}
