import { MakeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-question-comment-repository'
import { FetchCommentQuestionUseCase } from './fetch-comment-question'
import { MakeCommentQuestion } from 'test/factories/make-comment-question'
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-questions-attachments-repository'

let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository
let inMemoryQuestionRepository: InMemoryQuestionRepository
let sut: FetchCommentQuestionUseCase
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository

describe('Fetch question comments', () => {
  beforeEach(() => {
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository()
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository()
    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentRepository,
    )
    sut = new FetchCommentQuestionUseCase(inMemoryQuestionCommentRepository)
  })

  it('Should be able to fetch comments in a question', async () => {
    const question = MakeQuestion()

    await inMemoryQuestionRepository.create(question)

    for (let i = 0; i < 5; i++) {
      const QuestionComment = MakeCommentQuestion({
        questionId: question.id,
      })

      await inMemoryQuestionCommentRepository.create(QuestionComment)
    }

    const result = await sut.execute({
      questionID: question.id.toString(),
      page: 1,
    })

    expect(result.value?.questionComments).toHaveLength(5)
  })

  it('Should be able to paginated comments in a question', async () => {
    const question = MakeQuestion()

    await inMemoryQuestionRepository.create(question)

    for (let i = 0; i < 22; i++) {
      const QuestionComment = MakeCommentQuestion({
        questionId: question.id,
      })

      await inMemoryQuestionCommentRepository.create(QuestionComment)
    }

    const result = await sut.execute({
      questionID: question.id.toString(),
      page: 2,
    })

    expect(result.value?.questionComments).toHaveLength(2)
  })
})
