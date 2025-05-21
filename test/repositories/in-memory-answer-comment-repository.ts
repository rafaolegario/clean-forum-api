import { PaginationParams } from '@/core/repositories/pagination-parms'
import { AnswerCommentRepository } from '@/domain/forum/application/repositories/answer-comment-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { InMemoryStudentRepository } from './in-memory-student-repository'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

export class InMemoryAnswerCommentRepository
  implements AnswerCommentRepository
{
  constructor(private inMemoryStudentsRepository: InMemoryStudentRepository){}

  public items: AnswerComment[] = []

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment)
  }

  async delete(comment: AnswerComment) {
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

  async fetchManyCommentsByAnswerId(
    answerID: string,
    { page }: PaginationParams,
  ) {
    const comments = this.items
      .filter((item) => item.answerId.toString() === answerID)
      .slice((page - 1) * 20, page * 20)

    return comments
  }


    async fetchManyCommentsByAnswerIdWithAuthor(
      answerID: string,
      { page }: PaginationParams,
    ) {
      const comments = this.items
        .filter((item) => item.answerId.toString() === answerID)
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
