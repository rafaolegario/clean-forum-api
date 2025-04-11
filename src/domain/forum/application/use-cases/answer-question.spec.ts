import { InMemoryAnswerAttachmentRepository } from 'test/repositories/in-memory-answer-attachments-repositort'
import { AnswerQuestionUseCase } from './answer-question'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: AnswerQuestionUseCase
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository

describe('Create Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentRepository,
    )
    sut = new AnswerQuestionUseCase(inMemoryAnswersRepository)
  })

  it('Should be able to create an answer', async () => {
    const result = await sut.execute({
      instructorId: '1',
      questionId: '2',
      content: 'New answer',
      attachmentIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(
      inMemoryAnswersRepository.items[0].attachments.currentItems,
    ).toHaveLength(2)
  })
})
