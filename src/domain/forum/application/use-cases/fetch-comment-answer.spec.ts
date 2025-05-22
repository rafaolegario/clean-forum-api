import { MakeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerCommentRepository } from 'test/repositories/in-memory-answer-comment-repository'
import { FetchCommentAnswerUseCase } from './fetch-comment-answer'
import { MakeCommentAnswer } from 'test/factories/make-comment-answer'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryAnswerAttachmentRepository } from 'test/repositories/in-memory-answer-attachments-repositort'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'
import { MakeStudent } from 'test/factories/make-student'

let inMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository
let inMemoryAnswerRepository: InMemoryAnswersRepository
let sut: FetchCommentAnswerUseCase
let inMemoryStudentsRepository: InMemoryStudentRepository
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository

describe('Fetch answer comments', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentRepository()
    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository(
      inMemoryStudentsRepository,
    )
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository()
    inMemoryAnswerRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentRepository,
    )
    sut = new FetchCommentAnswerUseCase(inMemoryAnswerCommentRepository)
  })

  it('Should be able to fetch comments in a answer', async () => {
    const student = MakeStudent({ name: 'JonhDoe' })

    inMemoryStudentsRepository.items.push(student)

    const answer = MakeAnswer()

    await inMemoryAnswerRepository.create(answer)

    for (let i = 0; i < 5; i++) {
      const AnswerComment = MakeCommentAnswer({
        answerId: answer.id,
        authorId: student.id,
      })

      await inMemoryAnswerCommentRepository.create(AnswerComment)
    }

    const result = await sut.execute({
      answerID: answer.id.toString(),
      page: 1,
    })

    expect(result.value?.comments).toHaveLength(5)
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          authorName: 'JonhDoe',
        }),
      ]),
    )
  })

  it('Should be able to paginated comments in a answer', async () => {
    const student = MakeStudent({ name: 'JonhDoe' })

    inMemoryStudentsRepository.items.push(student)

    const answer = MakeAnswer()

    await inMemoryAnswerRepository.create(answer)

    for (let i = 0; i < 22; i++) {
      const AnswerComment = MakeCommentAnswer({
        answerId: answer.id,
        authorId: student.id,
      })

      await inMemoryAnswerCommentRepository.create(AnswerComment)
    }

    const result = await sut.execute({
      answerID: answer.id.toString(),
      page: 2,
    })

    expect(result.value?.comments).toHaveLength(2)
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          authorName: 'JonhDoe',
        }),
      ]),
    )
  })
})
