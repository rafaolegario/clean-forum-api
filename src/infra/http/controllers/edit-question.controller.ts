import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'

import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'
import { QuestionPresenter } from '../presenters/question-presenter'

const editQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>

const validationPipe = new ZodValidationPipe(editQuestionBodySchema)

@Controller('/questions/:id')
export class EditQuestionController {
  constructor(private editQuestion: EditQuestionUseCase) {}

  @Put()
  @HttpCode(200)
  async handle(
    @Body(validationPipe) body: EditQuestionBodySchema,
    @Param('id') questionId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { title, content } = body
    const authorId = user.sub
    const result = await this.editQuestion.execute({
      title,
      content,
      authorId,
      questionId,
      attachmentIds: [],
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return { question: QuestionPresenter.toHTTP(result.value.question) }
  }
}
