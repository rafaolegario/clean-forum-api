import { Either, left, right } from '@/core/either'
import { QuestionsRepository } from '../repositories/question-repository'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { NotAllowedError } from './errors/not-allowed-error'

interface DeleteQuestionUseCaseRequest {
  questionID: string
  authorID: string
}

type DeleteQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>

export class DeleteQuestionUseCase {
  constructor(private QuestionsRepository: QuestionsRepository) {}

  async execute({
    questionID,
    authorID,
  }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
    const question = await this.QuestionsRepository.findById(questionID)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (authorID !== question.authorId.toString()) {
      return left(new NotAllowedError())
    }

    await this.QuestionsRepository.delete(question)

    return right({})
  }
}
