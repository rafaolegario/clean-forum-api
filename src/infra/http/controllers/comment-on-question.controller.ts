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
import { QuestionCommentUseCase } from '@/domain/forum/application/use-cases/comment-on-question'
import { CommentPresenter } from '../presenters/comment-presenter'

const questionCommentBodySchema = z.object({
  content: z.string(),
})

type QuestionCommentBodySchema = z.infer<typeof questionCommentBodySchema>

const validationPipe = new ZodValidationPipe(questionCommentBodySchema)

@Controller('/questions/:questionId/comments')
export class QuestionCommentController {
  constructor(private questionComment: QuestionCommentUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(validationPipe) body: QuestionCommentBodySchema,
    @Param('questionId') questionId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { content } = body
    const authorId = user.sub
    const result = await this.questionComment.execute({
      content,
      authorId,
      questionId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return {
      question_comment: CommentPresenter.toHTTP(result.value.questionComment),
    }
  }
}
