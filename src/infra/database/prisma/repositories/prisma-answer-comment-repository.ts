import { PaginationParams } from '@/core/repositories/pagination-parms'
import { AnswerCommentRepository } from '@/domain/forum/application/repositories/answer-comment-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaAnswerCommentRepository implements AnswerCommentRepository {
  async create(AnswerComment: AnswerComment): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async delete(comment: AnswerComment): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async findById(id: string): Promise<AnswerComment | void> {
    throw new Error('Method not implemented.')
  }

  async fetchManyCommentsByAnswerId(
    AnswerID: string,
    props: PaginationParams,
  ): Promise<AnswerComment[]> {
    throw new Error('Method not implemented.')
  }
}
