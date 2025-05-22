import { InMemoryQuestionRepository } from 'test/repositories/in-memory-questions-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { MakeQuestion } from 'test/factories/make-question'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-questions-attachments-repository'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { MakeStudent } from 'test/factories/make-student'
import { MakeAttachment } from 'test/factories/make-attachment'
import { MakeQuestionAttachment } from 'test/factories/make-question-attachment'

let inMemoryQuestionRepository: InMemoryQuestionRepository
let sut: GetQuestionBySlugUseCase
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository
let inMemoryStudentRepository: InMemoryStudentRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
describe('Get question by slug', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository()

    inMemoryStudentRepository = new InMemoryStudentRepository()

    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()

    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentRepository,
      inMemoryStudentRepository,
      inMemoryAttachmentsRepository,
    )
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionRepository)
  })

  it('Should be able to get a question by slug', async () => {
    const student = MakeStudent({ name: 'JonhDoe' })
    inMemoryStudentRepository.items.push(student)

    const attachment = MakeAttachment()
    inMemoryAttachmentsRepository.items.push(attachment)

    const newQuestion = MakeQuestion({
      slug: Slug.create('test-question'),
      authorId: student.id,
    })
    inMemoryQuestionRepository.create(newQuestion)

    const questionAttachment = MakeQuestionAttachment({
      attachmentId: attachment.id,
      questionId: newQuestion.id,
    })

    inMemoryQuestionAttachmentRepository.items.push(questionAttachment)

    const result = await sut.execute({
      slug: 'test-question',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual(
      expect.objectContaining({
        question: expect.objectContaining({
          authorName: 'JonhDoe',
        }),
      }),
    )
  })
})
