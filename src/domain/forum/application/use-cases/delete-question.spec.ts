import { InMemoryQuestionRepository } from 'test/repositories/in-memory-questions-repository'
import { DeleteQuestionUseCase } from './delete-question'
import { MakeQuestion } from 'test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from './errors/not-allowed-error'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-questions-attachments-repository'
import { MakeQuestionAttachment } from 'test/factories/make-question-attachment'

let inMemoryQuestionRepository: InMemoryQuestionRepository
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository
let sut: DeleteQuestionUseCase

describe('Delete question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository()
    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentRepository,
    )

    sut = new DeleteQuestionUseCase(inMemoryQuestionRepository)
  })

  it('Should be able to delete an question', async () => {
    const question = MakeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    inMemoryQuestionAttachmentRepository.items.push(
      MakeQuestionAttachment({
        questionId: question.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      MakeQuestionAttachment({
        questionId: question.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    await inMemoryQuestionRepository.create(question)

    await sut.execute({ questionID: 'question-1', authorID: 'author-1' })

    expect(inMemoryQuestionRepository.items).toHaveLength(0)
    expect(inMemoryQuestionAttachmentRepository.items).toHaveLength(0)
  })

  it('Should not be able to delete an question from another user', async () => {
    const question = MakeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    await inMemoryQuestionRepository.create(question)

    const result = await sut.execute({
      questionID: 'question-1',
      authorID: 'author-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
