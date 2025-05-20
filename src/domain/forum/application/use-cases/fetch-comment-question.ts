import { QuestionCommentRepository } from '../repositories/question-comment-repository'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author'

interface FetchCommentQuestionUseCaseRequest {
  page: number
  questionID: string
}

type FetchCommentQuestionUseCaseResponse = Either<
  null,
  {
    comments: CommentWithAuthor[]
  }
>

@Injectable()
export class FetchCommentQuestionUseCase {
  constructor(private questionCommentRepository: QuestionCommentRepository) {}

  async execute({
    page,
    questionID,
  }: FetchCommentQuestionUseCaseRequest): Promise<FetchCommentQuestionUseCaseResponse> {
    const comments =
      await this.questionCommentRepository.fetchManyCommentsByQuestionIdWithAuthor(
        questionID,
        { page },
      )

    return right({ comments })
  }
}
