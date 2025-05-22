import { InMemoryAnswerCommentRepository } from 'test/repositories/in-memory-answer-comment-repository'
import { AnswerCommentUseCase } from './comment-on-answer'
import { MakeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryAnswerAttachmentRepository } from 'test/repositories/in-memory-answer-attachments-repositort'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'

let inMemoryAnswerRepository: InMemoryAnswersRepository
let inMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository
let sut: AnswerCommentUseCase
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository
let inMemoryStudentRepository: InMemoryStudentRepository

describe('Create answer comment', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository()

    inMemoryAnswerRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentRepository,
    )

    inMemoryStudentRepository = new InMemoryStudentRepository()

    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository(
      inMemoryStudentRepository,
    )
    sut = new AnswerCommentUseCase(
      inMemoryAnswerRepository,
      inMemoryAnswerCommentRepository,
    )
  })

  it('Should be able to create an answer comment', async () => {
    const answer = MakeAnswer()

    await inMemoryAnswerRepository.create(answer)

    await sut.execute({
      authorID: answer.authorId.toString(),
      answerID: answer.id.toString(),
      content: 'content example',
    })

    expect(inMemoryAnswerCommentRepository.items[0].content).toEqual(
      'content example',
    )
  })
})
