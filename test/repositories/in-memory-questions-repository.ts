import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-parms'
import { QuestionsRepository } from '@/domain/forum/application/repositories/question-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { InMemoryStudentRepository } from './in-memory-student-repository'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { InMemoryQuestionAttachmentRepository } from './in-memory-questions-attachments-repository'
import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository'

export class InMemoryQuestionRepository implements QuestionsRepository {
  constructor(
    private questionAttachmentRepository: InMemoryQuestionAttachmentRepository,
    private studentRepositoy: InMemoryStudentRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository
  ) {}

  public items: Question[] = []

  async create(question: Question) {
    this.items.push(question)
    this.questionAttachmentRepository.createMany(
      question.attachments.getItems(),
    )
    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async delete(question: Question) {
    this.items = this.items.filter(
      (item) => item.id.toString() !== question.id.toString(),
    )

    this.questionAttachmentRepository.deleteManyByQuestionId(
      question.id.toString(),
    )
  }

  async save(question: Question) {
    const ItemIndex = this.items.findIndex(
      (item) => item.id.toString() === question.id.toString(),
    )

    this.questionAttachmentRepository.createMany(
      question.attachments.getNewItems(),
    )

    this.questionAttachmentRepository.deleteMany(
      question.attachments.getRemovedItems(),
    )

    this.items[ItemIndex] = question
    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async findBySlug(slug: string) {
   const question = this.items.find((item) => item.slug.value === slug)

    if (!question) {
      return null
    }

    return question
  }

   async findDetailsBySlug(slug: string) {
     const question = this.items.find((item) => item.slug.value === slug)

    if (!question) {
      return null
    }

    const author = this.studentRepositoy.items.find(student =>{
      return student.id.equals(question.authorId)
    })

    if(!author){
      throw new Error("Author not found")
    }

    const QuestionAttachments = this.questionAttachmentRepository.items.filter(item =>{
      return item.questionId.equals(question.id)
    })

    const attachments = (QuestionAttachments).map(questionAttachment =>{
      const attachment = this.attachmentsRepository.items.find(attachment =>{
        return attachment.id.equals(questionAttachment.attachmentId)
      })

      if(!attachment){
        throw new Error(`Attachment with ID "${questionAttachment.attachmentId}" does not exist!`)
      }

      return attachment
    })

    return QuestionDetails.create({
      questionId:question.id,
      title:question.title,
      content:question.content,
      slug:question.slug,
      bestAnswerId:question.bestAnswerId,
      authorId:question.authorId,
      authorName:author.name,
      attachments,
      updatedAt: question.updatedAt,
      createdAt:question.createdAt

    })
    
  }

  async findById(id: string) {
    const question = this.items.find((item) => item.id.toValue() === id)

    if (!question) {
      return null
    }

    return question
  }

  async findManyRecent({ page }: PaginationParams) {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return questions
  }
}
