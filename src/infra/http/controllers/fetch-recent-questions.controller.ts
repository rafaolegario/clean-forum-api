import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth-guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { FetchRecentQuestionUseCase } from '@/domain/forum/application/use-cases/fetch-recent-topics'
import { QuestionPresenter } from '../presenters/question-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(private FetchRecentQuestions: FetchRecentQuestionUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.FetchRecentQuestions.execute({
      page,
    })

    if (result.isLeft()) {
      throw new Error()
    }

    const questions = result.value.questions

    return { recent_questions: questions.map(QuestionPresenter.toHTTP) }
  }
}
