import { QuestionCommentRepository } from '../repositories/question-comment-repository'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { Either, right } from '@/core/either'

interface FetchCommentQuestionUseCaseRequest {
  page: number
  questionID: string
}

type FetchCommentQuestionUseCaseResponse = Either<
  null,
  {
    CommentQuestions: QuestionComment[]
  }
>

export class FetchCommentQuestionUseCase {
  constructor(private QuestionCommentRepository: QuestionCommentRepository) {}

  async execute({
    page,
    questionID,
  }: FetchCommentQuestionUseCaseRequest): Promise<FetchCommentQuestionUseCaseResponse> {
    const CommentQuestions =
      await this.QuestionCommentRepository.fetchManyCommentsByQuestionId(
        questionID,
        { page },
      )

    return right({ CommentQuestions })
  }
}
