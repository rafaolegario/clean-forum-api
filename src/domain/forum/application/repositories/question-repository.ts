import { PaginationParams } from '@/core/repositories/pagination-parms'
import { Question } from '../../enterprise/entities/question'
import { QuestionDetails } from '../../enterprise/entities/value-objects/question-details'

export abstract class QuestionsRepository {
  abstract create(question: Question): Promise<void>
  abstract delete(question: Question): Promise<void>
  abstract save(question: Question): Promise<void>
  abstract findBySlug(slug: string): Promise<Question | null>
  abstract findDetailsBySlug(slug: string): Promise<QuestionDetails[]>
  abstract findById(id: string): Promise<Question | null>
  abstract findManyRecent(params: PaginationParams): Promise<Question[]>
}
