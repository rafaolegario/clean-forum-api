import { Either, left, right } from '@/core/either'
import { QuestionCommentRepository } from '../repositories/question-comment-repository'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { NotAllowedError } from './errors/not-allowed-error'
import { Injectable } from '@nestjs/common'

interface DeleteQuestionCommentUseCaseRequest {
  authorID: string
  commentID: string
}

type DeleteQuestionCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>

@Injectable()
export class DeleteQuestionCommentUseCase {
  constructor(private QuestionCommentRepository: QuestionCommentRepository) {}

  async execute({
    authorID,
    commentID,
  }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
    const QuestionComment =
      await this.QuestionCommentRepository.findById(commentID)

    if (!QuestionComment) {
      return left(new ResourceNotFoundError())
    }

    if (QuestionComment.authorId.toString() !== authorID) {
      return left(new NotAllowedError())
    }

    await this.QuestionCommentRepository.delete(QuestionComment)

    return right({})
  }
}
