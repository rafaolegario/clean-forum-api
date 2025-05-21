import { AnswerCommentRepository } from '../repositories/answer-comment-repository'
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author'

interface FetchCommentAnswerUseCaseRequest {
  page: number
  answerID: string
}

type FetchCommentAnswerUseCaseResponse = Either<
  null,
  {
    comments: CommentWithAuthor[]
  }
>

@Injectable()
export class FetchCommentAnswerUseCase {
  constructor(private AnswerCommentRepository: AnswerCommentRepository) {}

  async execute({
    page,
    answerID,
  }: FetchCommentAnswerUseCaseRequest): Promise<FetchCommentAnswerUseCaseResponse> {
    const comments =
      await this.AnswerCommentRepository.fetchManyCommentsByAnswerIdWithAuthor(answerID, {
        page,
      })

    return right({ comments })
  }
}
