import { PaginationParams } from '@/core/repositories/pagination-parms'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  async create(answer: Answer): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async delete(answer: Answer): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async save(question: Answer): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async findById(id: string): Promise<Answer | null> {
    throw new Error('Method not implemented.')
  }

  async fetchManyByQuestionId(
    question: string,
    params: PaginationParams,
  ): Promise<Answer[]> {
    throw new Error('Method not implemented.')
  }
}
