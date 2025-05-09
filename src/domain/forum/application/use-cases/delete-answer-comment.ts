import { Either, left, right } from '@/core/either'
import { AnswerCommentRepository } from '../repositories/answer-comment-repository'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { NotAllowedError } from './errors/not-allowed-error'
import { Injectable } from '@nestjs/common'

interface DeleteAnswerCommentUseCaseRequest {
  authorID: string
  commentID: string
}

type DeleteAnswerCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>

@Injectable()
export class DeleteAnswerCommentUseCase {
  constructor(private AnswerCommentRepository: AnswerCommentRepository) {}

  async execute({
    authorID,
    commentID,
  }: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
    const AnswerComment = await this.AnswerCommentRepository.findById(commentID)

    if (!AnswerComment) {
      return left(new ResourceNotFoundError())
    }

    if (AnswerComment.authorId.toString() !== authorID) {
      return left(new NotAllowedError())
    }

    await this.AnswerCommentRepository.delete(AnswerComment)

    return right({})
  }
}
