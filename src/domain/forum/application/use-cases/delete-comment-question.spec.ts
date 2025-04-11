import { MakeCommentQuestion } from 'test/factories/make-comment-question'
import { DeleteQuestionCommentUseCase } from './delete-comment-question'
import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-question-comment-repository'
import { NotAllowedError } from './errors/not-allowed-error'

let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete question comment', () => {
  beforeEach(() => {
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository()
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentRepository)
  })

  it('Should be able to delete an comment question', async () => {
    const CommentQuestion = MakeCommentQuestion()

    await inMemoryQuestionCommentRepository.create(CommentQuestion)

    await sut.execute({
      authorID: CommentQuestion.authorId.toString(),
      commentID: CommentQuestion.id.toString(),
    })

    expect(inMemoryQuestionCommentRepository.items).toHaveLength(0)
  })

  it('Should not be able to delete an question comment from another user', async () => {
    const CommentQuestion = MakeCommentQuestion()

    await inMemoryQuestionCommentRepository.create(CommentQuestion)

    const result = await sut.execute({
      commentID: CommentQuestion.id.toString(),
      authorID: 'author-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
