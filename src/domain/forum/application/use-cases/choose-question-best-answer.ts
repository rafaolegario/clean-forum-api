import { Either, left, right } from '@/core/either'
import { Question } from '../../enterprise/entities/question'
import { AnswersRepository } from '../repositories/answers-repository'
import { QuestionsRepository } from '../repositories/question-repository'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { NotAllowedError } from './errors/not-allowed-error'

interface ChooseBestAnswerUseCaseRequest {
  authorID: string
  answerID: string
}

type ChooseBestAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question
  }
>

export class ChooseBestAnswerUseCase {
  constructor(
    private QuestionsRepository: QuestionsRepository,
    private AnswersRepositoy: AnswersRepository,
  ) {}

  async execute({
    authorID,
    answerID,
  }: ChooseBestAnswerUseCaseRequest): Promise<ChooseBestAnswerUseCaseResponse> {
    const answer = await this.AnswersRepositoy.findById(answerID)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    const question = await this.QuestionsRepository.findById(
      answer.questionId.toString(),
    )

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (question?.authorId.toString() !== authorID) {
      return left(new NotAllowedError())
    }

    question.bestAnswerId = answer.id
    this.QuestionsRepository.save(question)

    return right({ question })
  }
}
