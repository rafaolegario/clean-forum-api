import { InMemoryQuestionRepository } from 'test/repositories/in-memory-questions-repository'
import { MakeQuestion } from 'test/factories/make-question'
import { MakeAnswer } from 'test/factories/make-answer'
import { ChooseBestAnswerUseCase } from './choose-question-best-answer'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { NotAllowedError } from './errors/not-allowed-error'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-questions-attachments-repository'
import { InMemoryAnswerAttachmentRepository } from 'test/repositories/in-memory-answer-attachments-repositort'

let inMemoryQuestionRepository: InMemoryQuestionRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: ChooseBestAnswerUseCase
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository

describe('Best answer', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository()

    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentRepository,
    )

    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository()

    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentRepository,
    )
    sut = new ChooseBestAnswerUseCase(
      inMemoryQuestionRepository,
      inMemoryAnswersRepository,
    )
  })

  it('Should be able to set a best answer in question', async () => {
    const question = MakeQuestion()

    const answer = MakeAnswer({
      questionId: question.id,
    })

    await inMemoryQuestionRepository.create(question)
    await inMemoryAnswersRepository.create(answer)

    await sut.execute({
      answerID: answer.id.toString(),
      authorID: question.authorId.toString(),
    })

    expect(inMemoryQuestionRepository.items[0].bestAnswerId).toEqual(answer.id)
  })

  it('Should not be able to choose best answer from another user questions', async () => {
    const question = MakeQuestion()

    const answer = MakeAnswer({
      questionId: question.id,
    })

    await inMemoryQuestionRepository.create(question)
    await inMemoryAnswersRepository.create(answer)

    const result = await sut.execute({
      answerID: answer.id.toString(),
      authorID: 'author-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
