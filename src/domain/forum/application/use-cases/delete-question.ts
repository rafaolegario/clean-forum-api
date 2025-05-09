import { Either, left, right } from '@/core/either'
import { QuestionsRepository } from '../repositories/question-repository'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { NotAllowedError } from './errors/not-allowed-error'
import { Injectable } from '@nestjs/common'

interface DeleteQuestionUseCaseRequest {
  questionId: string
  authorId: string
}

type DeleteQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>

@Injectable()
export class DeleteQuestionUseCase {
  constructor(private QuestionsRepository: QuestionsRepository) {}

  async execute({
    questionId,
    authorId,
  }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
    const question = await this.QuestionsRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError())
    }

    await this.QuestionsRepository.delete(question)

    return right({})
  }
}
