import { QuestionsRepository } from '../repositories/question-repository'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { QuestionCommentRepository } from '../repositories/question-comment-repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { Injectable } from '@nestjs/common'

interface QuestionCommentUseCaseRequest {
  authorID: string
  questionID: string
  content: string
}

type QuestionCommentUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    questionComment: QuestionComment
  }
>

@Injectable()
export class QuestionCommentUseCase {
  constructor(
    private QuestionsRepository: QuestionsRepository,
    private QuestionCommentRepository: QuestionCommentRepository,
  ) {}

  async execute({
    authorID,
    questionID,
    content,
  }: QuestionCommentUseCaseRequest): Promise<QuestionCommentUseCaseResponse> {
    const question = await this.QuestionsRepository.findById(questionID)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    const questionComment = QuestionComment.create({
      authorId: new UniqueEntityID(authorID),
      questionId: question.id,
      content,
    })

    await this.QuestionCommentRepository.create(questionComment)

    return right({ questionComment })
  }
}
