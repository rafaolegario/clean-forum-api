import { MakeAnswer } from 'test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { EditAnswerUseCase } from './edit-answer'
import { NotAllowedError } from './errors/not-allowed-error'

import { MakeAnswerAttachment } from 'test/factories/make-answer-attachment'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryAnswerAttachmentRepository } from 'test/repositories/in-memory-answer-attachments-repositort'

let inMemoryAnswerRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository
let sut: EditAnswerUseCase

describe('Edit answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository()
    inMemoryAnswerRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentRepository,
    )
    sut = new EditAnswerUseCase(
      inMemoryAnswerRepository,
      inMemoryAnswerAttachmentRepository,
    )
  })

  it('Should be able to edit an answer', async () => {
    const answer = MakeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1'),
    )

    await inMemoryAnswerRepository.create(answer)

    inMemoryAnswerAttachmentRepository.items.push(
      MakeAnswerAttachment({
        answerId: answer.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      MakeAnswerAttachment({
        answerId: answer.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    await sut.execute({
      answerID: 'answer-1',
      authorID: 'author-1',
      content: 'New Content',
      attachmentIds: ['1', '3'],
    })

    expect(inMemoryAnswerRepository.items[0]).toMatchObject({
      content: 'New Content',
    })

    expect(
      inMemoryAnswerRepository.items[0].attachments.currentItems,
    ).toHaveLength(2)

    expect(inMemoryAnswerRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
    ])
  })

  it('Should not be able to edit an answer from another user', async () => {
    const answer = MakeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1'),
    )

    await inMemoryAnswerRepository.create(answer)

    const result = await sut.execute({
      answerID: 'answer-1',
      authorID: 'author-2',
      content: 'New Content',
      attachmentIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
