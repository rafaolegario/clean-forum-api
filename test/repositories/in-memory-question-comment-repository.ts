import { PaginationParams } from '@/core/repositories/pagination-parms'
import { QuestionCommentRepository } from '@/domain/forum/application/repositories/question-comment-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { InMemoryStudentRepository } from './in-memory-student-repository'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

export class InMemoryQuestionCommentRepository
  implements QuestionCommentRepository
{
  constructor(private inMemoryStudentsRepository: InMemoryStudentRepository) {}

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

  async fetchManyCommentsByQuestionIdWithAuthor(
    questionID: string,
    { page }: PaginationParams,
  ) {
    const comments = this.items
      .filter((item) => item.questionId.toString() === questionID)
      .slice((page - 1) * 20, page * 20)
      .map((comment) => {
        const author = this.inMemoryStudentsRepository.items.find((student) => {
          return student.id.equals(comment.authorId)
        })

        if (!author) {
          throw new Error(
            `Author with ID "${comment.authorId.toString()}" does not exist.`,
          )
        }

        return CommentWithAuthor.create({
          commentId: comment.id,
          authorId: comment.authorId,
          content: comment.content,
          createdAt: comment.createdAt,
          authorName: author.name,
        })
      })

    return comments
  }
}
