import { PaginationParams } from '@/core/repositories/pagination-parms'
import { QuestionCommentRepository } from '@/domain/forum/application/repositories/question-comment-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaQuestionCommentRepository
  implements QuestionCommentRepository
{
  async create(QuestionComment: QuestionComment): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async delete(comment: QuestionComment): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async findById(id: string): Promise<QuestionComment | void> {
    throw new Error('Method not implemented.')
  }

  async fetchManyCommentsByQuestionId(
    questionID: string,
    props: PaginationParams,
  ): Promise<QuestionComment[]> {
    throw new Error('Method not implemented.')
  }
}
