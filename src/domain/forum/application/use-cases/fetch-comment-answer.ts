import { AnswerCommentRepository } from '../repositories/answer-comment-repository'
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

interface FetchCommentAnswerUseCaseRequest {
  page: number
  answerID: string
}

type FetchCommentAnswerUseCaseResponse = Either<
  null,
  {
    CommentAnswers: AnswerComment[]
  }
>

@Injectable()
export class FetchCommentAnswerUseCase {
  constructor(private AnswerCommentRepository: AnswerCommentRepository) {}

  async execute({
    page,
    answerID,
  }: FetchCommentAnswerUseCaseRequest): Promise<FetchCommentAnswerUseCaseResponse> {
    const CommentAnswers =
      await this.AnswerCommentRepository.fetchManyCommentsByAnswerId(answerID, {
        page,
      })

    return right({ CommentAnswers })
  }
}
