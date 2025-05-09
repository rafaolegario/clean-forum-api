import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common'

import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { AnswerCommentUseCase } from '@/domain/forum/application/use-cases/comment-on-answer'
import { CommentPresenter } from '../presenters/comment-presenter'

const answerCommentBodySchema = z.object({
  content: z.string(),
})

type AnswerCommentBodySchema = z.infer<typeof answerCommentBodySchema>

const validationPipe = new ZodValidationPipe(answerCommentBodySchema)

@Controller('/answers/:answerId/comments')
export class AnswerCommentController {
  constructor(private answerComment: AnswerCommentUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(validationPipe) body: AnswerCommentBodySchema,
    @Param('answerId') answerId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { content } = body
    const authorId = user.sub
    const result = await this.answerComment.execute({
      content,
      authorID: authorId,
      answerID: answerId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return {
      answer_comment: CommentPresenter.toHTTP(result.value.answerComment),
    }
  }
}
