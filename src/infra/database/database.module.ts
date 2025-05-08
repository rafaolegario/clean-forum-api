import { Module } from '@nestjs/common'
import { PrismaService } from '../database/prisma/prisma.service'
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions-repository'
import { PrismaQuestionCommentRepository } from './prisma/repositories/prisma-question-comment-repository'
import { PrismaQuestionAttachmentsRepository } from './prisma/repositories/prisma-question-attachments-repository'
import { PrismaAnswersRepository } from './prisma/repositories/prisma-answers-repository'
import { PrismaAnswerCommentRepository } from './prisma/repositories/prisma-answer-comment-repository'

import { QuestionsRepository } from '@/domain/forum/application/repositories/question-repository'
import { StudentsRepository } from '@/domain/forum/application/repositories/studentes-repository'
import { PrismaStudentsRepository } from './prisma/repositories/prisma-students-repository'
import { PrismaAnswerAttachments } from './prisma/repositories/prisma-answer-attachments-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: QuestionsRepository,
      useClass: PrismaQuestionsRepository,
    },
    {
      provide: StudentsRepository,
      useClass: PrismaStudentsRepository,
    },
    PrismaQuestionCommentRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaAnswersRepository,
    PrismaAnswerCommentRepository,
    PrismaAnswerAttachments,
  ],
  exports: [
    PrismaService,
    PrismaService,
    QuestionsRepository,
    PrismaQuestionCommentRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaAnswersRepository,
    PrismaAnswerCommentRepository,
    PrismaAnswerAttachments,
    StudentsRepository,
  ],
})
export class DatabaseModule {}
