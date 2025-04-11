import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { AnswersRepository } from '../repositories/answers-repository'
import { AnswerCommentRepository } from '../repositories/answer-comment-repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from './errors/resource-not-found'

interface AnswerCommentUseCaseRequest {
  authorID: string
  answerID: string
  content: string
}

type AnswerCommentUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    answerComment: AnswerComment
  }
>

export class AnswerCommentUseCase {
  constructor(
    private AnswersRepository: AnswersRepository,
    private AnswerCommentRepository: AnswerCommentRepository,
  ) {}

  async execute({
    authorID,
    answerID,
    content,
  }: AnswerCommentUseCaseRequest): Promise<AnswerCommentUseCaseResponse> {
    const answer = await this.AnswersRepository.findById(answerID)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    const answerComment = AnswerComment.create({
      authorId: new UniqueEntityID(authorID),
      answerId: answer.id,
      content,
    })

    await this.AnswerCommentRepository.create(answerComment)

    return right({ answerComment })
  }
}
