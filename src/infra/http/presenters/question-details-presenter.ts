import { Question } from "@/domain/forum/enterprise/entities/question";
import { QuestionDetails } from "@/domain/forum/enterprise/entities/value-objects/question-details";

export class QuestionDetailsPresenter {
  static toHTTP(questionDetails: QuestionDetails) {
    return {
      questionId: questionDetails.questionId.toString(),
      title: questionDetails.title,
      content: questionDetails.content,
      slug: questionDetails.slug.value,
      bestAnswerId: questionDetails.bestAnswerId?.toString(),
      attachments: questionDetails.attachments,
      authorId: questionDetails.authorId,
      author: questionDetails.authorName,
      createdAt: questionDetails.createdAt,
      updatedAt: questionDetails.updatedAt,
    };
  }
}
