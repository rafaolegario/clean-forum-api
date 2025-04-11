import { PaginationParams } from '@/core/repositories/pagination-parms'
import { Answer } from '../../enterprise/entities/answer'

export interface AnswersRepository {
  create(answer: Answer): Promise<void>
  delete(answer: Answer): Promise<void>
  save(question: Answer): Promise<void>
  findById(id: string): Promise<Answer | null>
  fetchManyByQuestionId(
    question: string,
    params: PaginationParams,
  ): Promise<Answer[]>
}
