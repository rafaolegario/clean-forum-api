import { PaginationParams } from '@/core/repositories/pagination-parms'
import { AnswerComment } from '../../enterprise/entities/answer-comment'

export abstract class AnswerCommentRepository {
  abstract delete(comment: AnswerComment): Promise<void>
  abstract create(AnswerComment: AnswerComment): Promise<void>
  abstract findById(id: string): Promise<AnswerComment | void>
  abstract fetchManyCommentsByAnswerId(
    AnswerID: string,
    props: PaginationParams,
  ): Promise<AnswerComment[]>
}
