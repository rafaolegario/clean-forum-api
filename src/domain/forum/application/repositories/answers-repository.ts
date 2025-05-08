import { PaginationParams } from '@/core/repositories/pagination-parms'
import { Answer } from '../../enterprise/entities/answer'

export abstract class AnswersRepository {
  abstract create(answer: Answer): Promise<void>
  abstract delete(answer: Answer): Promise<void>
  abstract save(question: Answer): Promise<void>
  abstract findById(id: string): Promise<Answer | null>
  abstract fetchManyByQuestionId(
    question: string,
    params: PaginationParams,
  ): Promise<Answer[]>
}
