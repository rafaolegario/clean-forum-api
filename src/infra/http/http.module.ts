import { Module } from '@nestjs/common'
import { CreateAccountController } from './controllers/create-account.controller'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateQuestionController } from './controllers/create-question.controller'
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { DatabaseModule } from '../database/database.module'
import { FetchRecentQuestionUseCase } from '@/domain/forum/application/use-cases/fetch-recent-topics'
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student'
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { GetQuestionBySlugController } from './controllers/get-question-by-slug.controller'
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug'
import { EditQuestionController } from './controllers/edit-question.controller'
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'
import { DeleteQuestionController } from './controllers/delete-question.controller'
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question'
import { AnswerQuestionController } from './controllers/answer-question.controller'
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'
import { EditAnswerController } from './controllers/edit-answer.controller'
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer'
import { DeleteAnswerController } from './controllers/delete-answer.controller'
import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer'
import { FetchQuestionAnswersController } from './controllers/fetch-question-answers.controller'
import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers'
import { ChooseBestAnswerController } from './controllers/choose-question-best-answer.controller'
import { ChooseBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer'
import { QuestionCommentController } from './controllers/comment-on-question.controller'
import { QuestionCommentUseCase } from '@/domain/forum/application/use-cases/comment-on-question'
import { DeleteCommentQuestionController } from './controllers/delete-comment-question.controller'
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-comment-question'
import { AnswerCommentController } from './controllers/comment-on-answer.controller'
import { AnswerCommentUseCase } from '@/domain/forum/application/use-cases/comment-on-answer'
import { DeleteCommentAnswerController } from './controllers/delete-comment-answer.controller'
import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment'
import { FetchQuestionCommentsController } from './controllers/fetch-comment-question.controller'
import { FetchCommentQuestionUseCase } from '@/domain/forum/application/use-cases/fetch-comment-question'
import { FetchAnswerCommentController } from './controllers/fetch-comment-answer.controller'
import { FetchCommentAnswerUseCase } from '@/domain/forum/application/use-cases/fetch-comment-answer'
import { UploadAttachmentController } from './controllers/upload-attachment.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
    GetQuestionBySlugController,
    EditQuestionController,
    DeleteQuestionController,
    AnswerQuestionController,
    EditAnswerController,
    DeleteAnswerController,
    FetchQuestionAnswersController,
    ChooseBestAnswerController,
    QuestionCommentController,
    DeleteCommentQuestionController,
    AnswerCommentController,
    DeleteCommentAnswerController,
    FetchQuestionCommentsController,
    FetchAnswerCommentController,
    UploadAttachmentController,
  ],
  providers: [
    CreateQuestionUseCase,
    FetchRecentQuestionUseCase,
    AuthenticateStudentUseCase,
    RegisterStudentUseCase,
    GetQuestionBySlugUseCase,
    EditQuestionUseCase,
    DeleteQuestionUseCase,
    AnswerQuestionUseCase,
    EditAnswerUseCase,
    DeleteAnswerUseCase,
    FetchQuestionAnswersUseCase,
    ChooseBestAnswerUseCase,
    QuestionCommentUseCase,
    DeleteQuestionCommentUseCase,
    AnswerCommentUseCase,
    DeleteAnswerCommentUseCase,
    FetchCommentQuestionUseCase,
    FetchCommentAnswerUseCase,
  ],
})
export class HttpModule {}
