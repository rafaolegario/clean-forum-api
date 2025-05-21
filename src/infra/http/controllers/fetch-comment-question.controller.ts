import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
  Query,
} from '@nestjs/common'

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { FetchCommentQuestionUseCase } from '@/domain/forum/application/use-cases/fetch-comment-question'

import { CommentWithAuthorPresenter } from '../presenters/comment-with-author-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

@Controller('/questions/:questionId/comments')
export class FetchQuestionCommentsController {
  constructor(private FetchCommentQuestions: FetchCommentQuestionUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @Param('questionId') questionId: string,
  ) {
    const result = await this.FetchCommentQuestions.execute({
      page,
      questionID: questionId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const questionComments = result.value.comments

    return { question_comments: questionComments.map(CommentWithAuthorPresenter.toHTTP) }
  }
}
