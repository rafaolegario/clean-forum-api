import { PaginationParams } from '@/core/repositories/pagination-parms'
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author'

export abstract class AnswerCommentRepository {
  abstract delete(comment: AnswerComment): Promise<void>
  abstract create(AnswerComment: AnswerComment): Promise<void>
  abstract findById(id: string): Promise<AnswerComment | void>
  abstract fetchManyCommentsByAnswerId(
    AnswerID: string,
    props: PaginationParams,
  ): Promise<AnswerComment[]>

  abstract fetchManyCommentsByAnswerIdWithAuthor(
      answerID: string,
      props: PaginationParams,
  ): Promise<CommentWithAuthor[]>
}
