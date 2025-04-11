import { InMemoryAnswerCommentRepository } from 'test/repositories/in-memory-answer-comment-repository'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { MakeCommentAnswer } from 'test/factories/make-comment-answer'
import { NotAllowedError } from './errors/not-allowed-error'

let inMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete answer comment', () => {
  beforeEach(() => {
    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository()
    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentRepository)
  })

  it('Should be able to delete an comment answer', async () => {
    const CommentAnswer = MakeCommentAnswer()

    await inMemoryAnswerCommentRepository.create(CommentAnswer)

    await sut.execute({
      authorID: CommentAnswer.authorId.toString(),
      commentID: CommentAnswer.id.toString(),
    })

    expect(inMemoryAnswerCommentRepository.items).toHaveLength(0)
  })

  it('Should not be able to delete an answer comment from another user', async () => {
    const CommentAnswer = MakeCommentAnswer()

    await inMemoryAnswerCommentRepository.create(CommentAnswer)

    const result = await sut.execute({
      commentID: CommentAnswer.id.toString(),
      authorID: 'author-2',
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
