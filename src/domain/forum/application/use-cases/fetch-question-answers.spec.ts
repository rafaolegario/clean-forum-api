import { InMemoryQuestionRepository } from 'test/repositories/in-memory-questions-repository'
import { MakeQuestion } from 'test/factories/make-question'
import { MakeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { FetchQuestionAnswersUseCase } from './fetch-question-answers'
import { InMemoryAnswerAttachmentRepository } from 'test/repositories/in-memory-answer-attachments-repositort'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-questions-attachments-repository'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'

let inMemoryQuestionRepository: InMemoryQuestionRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: FetchQuestionAnswersUseCase
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository
let inMemoryStudentRepository: InMemoryStudentRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository

describe('Fetch answers', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository()

    inMemoryStudentRepository = new InMemoryStudentRepository()

    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    
    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentRepository,
      inMemoryStudentRepository,
      inMemoryAttachmentsRepository
    )

    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentRepository,
    )
    sut = new FetchQuestionAnswersUseCase(
      inMemoryQuestionRepository,
      inMemoryAnswersRepository,
    )
  })

  it('Should be able to fetch answers in a question', async () => {
    const question = MakeQuestion()

    await inMemoryQuestionRepository.create(question)

    for (let i = 0; i < 5; i++) {
      const answer = MakeAnswer({
        questionId: question.id,
      })

      await inMemoryAnswersRepository.create(answer)
    }

    const result = await sut.execute({
      questionID: question.id.toString(),
      page: 1,
    })

    expect(result.value?.answers).toHaveLength(5)
  })

  it('Should be able to paginated answers in a question', async () => {
    const question = MakeQuestion()

    await inMemoryQuestionRepository.create(question)

    for (let i = 0; i < 22; i++) {
      const answer = MakeAnswer({
        questionId: question.id,
      })

      await inMemoryAnswersRepository.create(answer)
    }

    const result = await sut.execute({
      questionID: question.id.toString(),
      page: 2,
    })

    expect(result.value?.answers).toHaveLength(2)
  })
})
