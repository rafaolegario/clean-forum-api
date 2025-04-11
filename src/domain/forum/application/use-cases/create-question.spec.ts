import { InMemoryQuestionRepository } from 'test/repositories/in-memory-questions-repository'

import { CreateQuestionUseCase } from './create-question'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-questions-attachments-repository'

let inMemoryQuestionRepository: InMemoryQuestionRepository
let sut: CreateQuestionUseCase
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository

describe('Create questions', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository()
    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentRepository,
    )
    sut = new CreateQuestionUseCase(inMemoryQuestionRepository)
  })

  it('Should be able to create an question', async () => {
    const result = await sut.execute({
      authorId: '1',
      title: 'title example',
      content: 'New question',
      attachmentIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(
      inMemoryQuestionRepository.items[0].attachments.currentItems,
    ).toHaveLength(2)
  })
})
