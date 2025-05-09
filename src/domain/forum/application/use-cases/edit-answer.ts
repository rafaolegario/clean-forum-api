import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { NotAllowedError } from './errors/not-allowed-error'
import { AnswerAttachmentsRepository } from '../repositories/answer-attachment-repository'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswersRepository } from '../repositories/answers-repository'
import { Injectable } from '@nestjs/common'

interface EditAnswerUseCaseRequest {
  answerID: string
  authorID: string
  content: string
  attachmentIds: string[]
}

type EditAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>

@Injectable()
export class EditAnswerUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async execute({
    answerID,
    authorID,
    content,
    attachmentIds,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerID)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (authorID !== answer.authorId.toString()) {
      return left(new NotAllowedError())
    }

    const currentAnswerAttachments =
      await this.answerAttachmentsRepository.fetchManyByAnswerId(answerID)

    const answerAttachmentList = new AnswerAttachmentList(
      currentAnswerAttachments,
    )

    const answerAttachment = attachmentIds.map((id) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityID(id),
        answerId: answer.id,
      })
    })

    answerAttachmentList.update(answerAttachment)

    answer.attachments = answerAttachmentList
    answer.content = content

    await this.answersRepository.save(answer)

    return right({
      answer,
    })
  }
}
