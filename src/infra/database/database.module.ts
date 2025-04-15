import { Module } from '@nestjs/common'
import { PrismaService } from '../database/prisma/prisma.service'
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions-repository'
import { PrismaQuestionCommentRepository } from './prisma/repositories/prisma-question-comment-repository'
import { PrismaQuestionAttachments } from './prisma/repositories/prisma-question-attachments'
import { PrismaAnswersRepository } from './prisma/repositories/prisma-answers-repository'
import { PrismaAnswerCommentRepository } from './prisma/repositories/prisma-answer-comment-repository'
import { PrismaAnswerAttachmentsRepository } from './prisma/repositories/prisma-answer-attachments-repository'

@Module({
  providers: [
    PrismaService,
    PrismaQuestionsRepository,
    PrismaQuestionCommentRepository,
    PrismaQuestionAttachments,
    PrismaAnswersRepository,
    PrismaAnswerCommentRepository,
    PrismaAnswerAttachmentsRepository,
  ],
  exports: [
    PrismaService,
    PrismaService,
    PrismaQuestionsRepository,
    PrismaQuestionCommentRepository,
    PrismaQuestionAttachments,
    PrismaAnswersRepository,
    PrismaAnswerCommentRepository,
    PrismaAnswerAttachmentsRepository,
  ],
})
export class DatabaseModule {}
