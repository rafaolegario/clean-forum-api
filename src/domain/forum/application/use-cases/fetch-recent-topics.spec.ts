import { InMemoryQuestionRepository } from 'test/repositories/in-memory-questions-repository'
import { MakeQuestion } from 'test/factories/make-question'
import { FetchRecentQuestionUseCase } from './fetch-recent-topics'

let inMemoryQuestionRepository: InMemoryQuestionRepository
let sut: FetchRecentQuestionUseCase

describe('Fetch recent topics', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionRepository()
    sut = new FetchRecentQuestionUseCase(inMemoryQuestionRepository)
  })

  it('Should be able to fetch recent questions', async () => {
    await inMemoryQuestionRepository.create(
      MakeQuestion({ createdAt: new Date(2025, 0, 20) }),
    )
    await inMemoryQuestionRepository.create(
      MakeQuestion({ createdAt: new Date(2025, 0, 18) }),
    )
    await inMemoryQuestionRepository.create(
      MakeQuestion({ createdAt: new Date(2025, 0, 23) }),
    )

    const result = await sut.execute({ page: 1 })

    expect(result.value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2025, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2025, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2025, 0, 18) }),
    ])
  })

  it('should be able to fetch paginated recents questions', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionRepository.create(MakeQuestion())
    }

    const result = await sut.execute({ page: 2 })

    expect(result.value?.questions).toHaveLength(2)
  })
})
