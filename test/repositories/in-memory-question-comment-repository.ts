import { PaginationParams } from '@/core/repositories/pagination-parms'
import { QuestionCommentRepository } from '@/domain/forum/application/repositories/question-comment-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

export class InMemoryQuestionCommentRepository
  implements QuestionCommentRepository
{
  public items: QuestionComment[] = []

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment)
  }

  async delete(comment: QuestionComment) {
    this.items = this.items.filter(
      (item) => item.id.toString() !== comment.id.toString(),
    )
  }

  async findById(id: string) {
    const comment = this.items.find((item) => item.id.toValue() === id)

    if (!comment) {
      return
    }

    return comment
  }

  async fetchManyCommentsByQuestionId(
    questionID: string,
    { page }: PaginationParams,
  ) {
    const comments = this.items
      .filter((item) => item.questionId.toString() === questionID)
      .slice((page - 1) * 20, page * 20)

    return comments
  }
}
