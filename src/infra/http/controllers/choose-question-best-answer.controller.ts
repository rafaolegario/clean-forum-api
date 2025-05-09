import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'

import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { ChooseBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer'
import { QuestionPresenter } from '../presenters/question-presenter'

@Controller('/answers/:answerId/choose-as-best')
export class ChooseBestAnswerController {
  constructor(private chooseQuestionBestAnswer: ChooseBestAnswerUseCase) {}

  @Put()
  @HttpCode(200)
  async handle(
    @Param('answerId') answerId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const authorId = user.sub
    const result = await this.chooseQuestionBestAnswer.execute({
      answerID: answerId,
      authorID: authorId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return { question: QuestionPresenter.toHTTP(result.value.question) }
  }
}
