import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AnswerFactory } from 'test/factories/make-answer'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

describe('Delete answer (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let studentFactory: StudentFactory
  let answerFactory: AnswerFactory
  let questionFactory: QuestionFactory
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, AnswerFactory, QuestionFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    prisma = moduleRef.get(PrismaService)
    await app.init()
  })

  test('[DELETE] /answers/:id', async () => {
    const user = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const answer = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      questionId: question.id,
    })

    const response = await request(app.getHttpServer())
      .delete(`/answers/${answer.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    const DeletedAnswer = await prisma.answer.findFirst({
      where: {
        id: answer.id.toString(),
      },
    })

    expect(DeletedAnswer).toEqual(null)
  })
})
