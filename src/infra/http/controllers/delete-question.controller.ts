import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'

import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question'

@Controller('/questions/:id')
export class DeleteQuestionController {
  constructor(private deleteQuestion: DeleteQuestionUseCase) {}

  @Delete()
  @HttpCode(200)
  async handle(
    @Param('id') questionId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const authorId = user.sub
    const result = await this.deleteQuestion.execute({
      questionId,
      authorId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return { message: 'Question deleted successfully!' }
  }
}
