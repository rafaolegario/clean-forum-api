import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'

import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-comment-question'

@Controller('/questions/comments/:id')
export class DeleteCommentQuestionController {
  constructor(private deleteQuestionComment: DeleteQuestionCommentUseCase) {}

  @Delete()
  @HttpCode(200)
  async handle(
    @Param('id') commentId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const authorId = user.sub
    const result = await this.deleteQuestionComment.execute({
      commentID: commentId,
      authorID: authorId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return { message: 'Comment deleted successfully!' }
  }
}
