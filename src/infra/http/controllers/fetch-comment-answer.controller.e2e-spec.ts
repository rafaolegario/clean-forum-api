import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AnswerFactory } from 'test/factories/make-answer'
import { AnswerCommentFactory } from 'test/factories/make-comment-answer'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

describe('Fetch answers comment (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let studentFactory: StudentFactory
  let answerFactory: AnswerFactory
  let questionFactory: QuestionFactory
  let answerCommentFactory: AnswerCommentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        AnswerFactory,
        QuestionFactory,
        AnswerCommentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    await app.init()
    studentFactory = moduleRef.get(StudentFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerCommentFactory = moduleRef.get(AnswerCommentFactory)
  })

  test('[GET] /answers/:answerId/comments', async () => {
    const user = await studentFactory.makePrismaStudent({name: 'JonhDoe'})

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const answer = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      questionId: question.id,
    })

    await answerCommentFactory.makePrismaAnswerComment({
      answerId: answer.id,
      content: 'Comment on answer test',
      authorId: user.id,
    })

    const response = await request(app.getHttpServer())
      .get(`/answers/${answer.id}/comments`)
      .query({ page: 1 })
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    expect(response.body.answer_comments).toEqual([
      expect.objectContaining({ content: 'Comment on answer test', authorName: 'JonhDoe' }),
    ])
  })
})
