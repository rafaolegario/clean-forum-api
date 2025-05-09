import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'

import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment'

@Controller('/answers/comments/:id')
export class DeleteCommentAnswerController {
  constructor(private deleteAnswerComment: DeleteAnswerCommentUseCase) {}

  @Delete()
  @HttpCode(200)
  async handle(
    @Param('id') commentId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const authorId = user.sub
    const result = await this.deleteAnswerComment.execute({
      commentID: commentId,
      authorID: authorId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return { message: 'Comment deleted successfully!' }
  }
}
