import { Either, left, right } from '@/core/either'
import { QuestionsRepository } from '../repositories/question-repository'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { NotAllowedError } from './errors/not-allowed-error'
import { QuestionAttachmentsRepository } from '../repositories/question-attachment-repository'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'
import { Question } from '../../enterprise/entities/question'

interface EditQuestionUseCaseRequest {
  questionId: string
  authorId: string
  title: string
  content: string
  attachmentIds: string[]
}

type EditQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question
  }
>

@Injectable()
export class EditQuestionUseCase {
  constructor(
    private QuestionsRepository: QuestionsRepository,
    private QuestionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async execute({
    questionId,
    authorId,
    title,
    content,
    attachmentIds,
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const question = await this.QuestionsRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError())
    }

    const currentQuestionAttachments =
      await this.QuestionAttachmentsRepository.fetchManyByQuestionId(questionId)

    const questionAttachmentList = new QuestionAttachmentList(
      currentQuestionAttachments,
    )

    const questionAttachment = attachmentIds.map((id) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityID(id),
        questionId: question.id,
      })
    })

    questionAttachmentList.update(questionAttachment)

    question.attachments = questionAttachmentList
    question.title = title
    question.content = content

    await this.QuestionsRepository.save(question)

    return right({ question })
  }
}
