import { QuestionCommentRepository } from '../repositories/question-comment-repository'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

interface FetchCommentQuestionUseCaseRequest {
  page: number
  questionID: string
}

type FetchCommentQuestionUseCaseResponse = Either<
  null,
  {
    questionComments: QuestionComment[]
  }
>

@Injectable()
export class FetchCommentQuestionUseCase {
  constructor(private questionCommentRepository: QuestionCommentRepository) {}

  async execute({
    page,
    questionID,
  }: FetchCommentQuestionUseCaseRequest): Promise<FetchCommentQuestionUseCaseResponse> {
    const questionComments =
      await this.questionCommentRepository.fetchManyCommentsByQuestionId(
        questionID,
        { page },
      )

    return right({ questionComments })
  }
}
