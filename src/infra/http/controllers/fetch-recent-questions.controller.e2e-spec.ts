import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

describe('Fetch Recent questions (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    await app.init()
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
  })

  test('[GET] /questions', async () => {
    const user = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    for (let i = 0; i < 22; i++) {
      await questionFactory.makePrismaQuestion({
        title: `question-${i}`,
        content: `content-${i}`,
        authorId: user.id,
      })
    }

    const response = await request(app.getHttpServer())
      .get('/questions')
      .query({ page: 1 })
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    expect(response.body.recent_questions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: 'question-20' }),
        expect.objectContaining({ title: 'question-21' }),
      ]),
    )
  })
})
