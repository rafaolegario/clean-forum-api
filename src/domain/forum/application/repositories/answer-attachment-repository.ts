import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'

export interface AnswerAttachmentsRepository {
  fetchManyByAnswerId(answerID: string): Promise<AnswerAttachment[]>
  deleteManyByAnswerId(answerId: string): Promise<void>
}
