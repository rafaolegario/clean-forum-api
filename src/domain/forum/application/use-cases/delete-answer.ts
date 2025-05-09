import { Either, left, right } from '@/core/either'
import { AnswersRepository } from '../repositories/answers-repository'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { NotAllowedError } from './errors/not-allowed-error'
import { Injectable } from '@nestjs/common'

interface DeleteAnswerUseCaseRequest {
  answerID: string
  authorID: string
}

type DeleteAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>

@Injectable()
export class DeleteAnswerUseCase {
  constructor(private AnswersRepository: AnswersRepository) {}

  async execute({
    answerID,
    authorID,
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
    const answer = await this.AnswersRepository.findById(answerID)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (authorID !== answer.authorId.toString()) {
      return left(new NotAllowedError())
    }

    await this.AnswersRepository.delete(answer)

    return right({})
  }
}
