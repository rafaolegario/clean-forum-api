import { PaginationParams } from '@/core/repositories/pagination-parms'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author'

export abstract class QuestionCommentRepository {
  abstract create(QuestionComment: QuestionComment): Promise<void>
  abstract delete(comment: QuestionComment): Promise<void>
  abstract findById(id: string): Promise<QuestionComment | void>
  abstract fetchManyCommentsByQuestionId(
    questionID: string,
    props: PaginationParams,
  ): Promise<QuestionComment[]>

  abstract fetchManyCommentsByQuestionIdWithAuthor(
    questionID: string,
    props: PaginationParams,
  ): Promise<CommentWithAuthor[]>
}
