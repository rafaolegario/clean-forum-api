import { MakeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-question-comment-repository'
import { FetchCommentQuestionUseCase } from './fetch-comment-question'
import { MakeCommentQuestion } from 'test/factories/make-comment-question'
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-questions-attachments-repository'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'
import { MakeStudent } from 'test/factories/make-student'

let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository
let inMemoryQuestionRepository: InMemoryQuestionRepository
let inMemoryStudentsRepository: InMemoryStudentRepository
let sut: FetchCommentQuestionUseCase
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository

describe('Fetch question comments', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentRepository()
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository(
      inMemoryStudentsRepository,
    )
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository()
    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentRepository,
    )
    sut = new FetchCommentQuestionUseCase(inMemoryQuestionCommentRepository)
  })

  it('Should be able to fetch comments in a question', async () => {
    const student = MakeStudent({ name: 'JonhDoe' })

    inMemoryStudentsRepository.items.push(student)
    const question = MakeQuestion()

    await inMemoryQuestionRepository.create(question)

    for (let i = 0; i < 5; i++) {
      const QuestionComment = MakeCommentQuestion({
        questionId: question.id,
        authorId: student.id,
      })

      await inMemoryQuestionCommentRepository.create(QuestionComment)
    }

    const result = await sut.execute({
      questionID: question.id.toString(),
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

  it('Should be able to paginated comments in a question', async () => {
    const student = MakeStudent({ name: 'JonhDoe' })

    inMemoryStudentsRepository.items.push(student)
    const question = MakeQuestion({})

    await inMemoryQuestionRepository.create(question)

    for (let i = 0; i < 22; i++) {
      const QuestionComment = MakeCommentQuestion({
        questionId: question.id,
        authorId: student.id,
      })

      await inMemoryQuestionCommentRepository.create(QuestionComment)
    }

    const result = await sut.execute({
      questionID: question.id.toString(),
      page: 2,
    })

    expect(result.value?.comments).toHaveLength(2)
  })
})
