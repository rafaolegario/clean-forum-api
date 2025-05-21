
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

export class CommentWithAuthorPresenter {
  static toHTTP(comment: CommentWithAuthor) {
    return {
      commentId: comment.commentId.toString(),
      content: comment.content,
      authorId: comment.authorId.toString(),
      authorName: comment.authorName,
      createdAt: comment.createdAt,
     
    }
  }
}
