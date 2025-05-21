import { PaginationParams } from '@/core/repositories/pagination-parms'
import { QuestionCommentRepository } from '@/domain/forum/application/repositories/question-comment-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaQuestionCommentMapper } from '../mappers/prisma-question-comment-mapper'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { PrismaCommentWithAuthorMapper } from '../mappers/prisma-comment-with-author-mapper'

@Injectable()
export class PrismaQuestionCommentRepository
  implements QuestionCommentRepository
{
  constructor(private prisma: PrismaService) {}

  async create(questionComment: QuestionComment): Promise<void> {
    const data = PrismaQuestionCommentMapper.toPrisma(questionComment)

    await this.prisma.comment.create({
      data,
    })
  }

  async delete(comment: QuestionComment): Promise<void> {
    const data = PrismaQuestionCommentMapper.toPrisma(comment)

    await this.prisma.comment.delete({
      where: {
        id: data.id,
      },
    })
  }

  async findById(id: string): Promise<QuestionComment | void> {
    const questionComment = await this.prisma.comment.findUnique({
      where: {
        id,
      },
    })

    if (!questionComment) {
      return
    }

    return PrismaQuestionCommentMapper.toDomain(questionComment)
  }

  async fetchManyCommentsByQuestionId(
    questionID: string,
    { page }: PaginationParams,
  ): Promise<QuestionComment[]> {
    const questionsComment = await this.prisma.comment.findMany({
      where: {
        questionId: questionID,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return questionsComment.map(PrismaQuestionCommentMapper.toDomain)
  }

  async fetchManyCommentsByQuestionIdWithAuthor(
    questionID: string,
    { page }: PaginationParams,
  ): Promise<CommentWithAuthor[]> {
    const questionsComment = await this.prisma.comment.findMany({
      where: {
        questionId: questionID,
      },
      include:{
        author:true
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return questionsComment.map(PrismaCommentWithAuthorMapper.toDomain)
  }
}
