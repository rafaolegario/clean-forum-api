import { PaginationParams } from '@/core/repositories/pagination-parms'
import { QuestionComment } from '../../enterprise/entities/question-comment'

export interface QuestionCommentRepository {
  create(QuestionComment: QuestionComment): Promise<void>
  delete(comment: QuestionComment): Promise<void>
  findById(id: string): Promise<QuestionComment | void>
  fetchManyCommentsByQuestionId(
    questionID: string,
    props: PaginationParams,
  ): Promise<QuestionComment[]>
}
