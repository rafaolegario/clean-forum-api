import { PaginationParams } from '@/core/repositories/pagination-parms'
import { AnswerCommentRepository } from '@/domain/forum/application/repositories/answer-comment-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaAnswerCommentMapper } from '../mappers/prisma-answer-comment-mapper'
import { PrismaCommentWithAuthorMapper } from '../mappers/prisma-comment-with-author-mapper'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

@Injectable()
export class PrismaAnswerCommentRepository implements AnswerCommentRepository {
  constructor(private prisma: PrismaService) {}

  async create(answerComment: AnswerComment): Promise<void> {
    const data = PrismaAnswerCommentMapper.toPrisma(answerComment)

    await this.prisma.comment.create({
      data,
    })
  }

  async delete(comment: AnswerComment): Promise<void> {
    const data = PrismaAnswerCommentMapper.toPrisma(comment)

    await this.prisma.comment.delete({
      where: {
        id: data.id,
      },
    })
  }

  async findById(id: string): Promise<AnswerComment | void> {
    const answerComment = await this.prisma.comment.findUnique({
      where: {
        id,
      },
    })

    if (!answerComment) {
      return
    }

    return PrismaAnswerCommentMapper.toDomain(answerComment)
  }

  async fetchManyCommentsByAnswerId(
    answerID: string,
    { page }: PaginationParams,
  ): Promise<AnswerComment[]> {
    const answersComment = await this.prisma.comment.findMany({
      where: {
        answerId: answerID,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return answersComment.map(PrismaAnswerCommentMapper.toDomain)
  }

  async fetchManyCommentsByAnswerIdWithAuthor(
     answerID: string,
      { page }: PaginationParams,
    ): Promise<CommentWithAuthor[]> {
      const answersComment = await this.prisma.comment.findMany({
        where: {
         answerId:answerID,
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
  
    return answersComment.map(PrismaCommentWithAuthorMapper.toDomain)
  }
}
