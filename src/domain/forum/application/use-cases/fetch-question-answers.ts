import { QuestionsRepository } from '../repositories/question-repository'
import { AnswersRepository } from '../repositories/answers-repository'
import { Either, right } from '@/core/either'
import { Answer } from '../../enterprise/entities/answer'

interface FetchQuestionAnswersUseCaseRequest {
  questionID: string
  page: number
}

type FetchQuestionAnswersUseCaseResponse = Either<
  null,
  {
    answers: Answer[]
  }
>

export class FetchQuestionAnswersUseCase {
  constructor(
    private QuestionsRepository: QuestionsRepository,
    private AnswersRepository: AnswersRepository,
  ) {}

  async execute({
    questionID,
    page,
  }: FetchQuestionAnswersUseCaseRequest): Promise<FetchQuestionAnswersUseCaseResponse> {
    const answers = await this.AnswersRepository.fetchManyByQuestionId(
      questionID,
      {
        page,
      },
    )

    return right({ answers })
  }
}
