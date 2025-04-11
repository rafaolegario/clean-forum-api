import { QuestionsRepository } from '../repositories/question-repository'
import { Question } from '../../enterprise/entities/question'
import { Either, right } from '@/core/either'

interface FetchRecentQuestionUseCaseRequest {
  page: number
}

type FetchRecentQuestionUseCaseResponse = Either<
  null,
  {
    questions: Question[]
  }
>

export class FetchRecentQuestionUseCase {
  constructor(private QuestionsRepository: QuestionsRepository) {}

  async execute({
    page,
  }: FetchRecentQuestionUseCaseRequest): Promise<FetchRecentQuestionUseCaseResponse> {
    const questions = await this.QuestionsRepository.findManyRecent({ page })

    return right({ questions })
  }
}
