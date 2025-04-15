import { AppModule } from '@/app.module'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Create question (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[POST] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'jonhDoe',
        email: 'Jonhdoe@email.com',
        password: await hash('12345678', 8),
      },
    })

    const accessToken = jwt.sign({ sub: user.id })

    for (let i = 0; i < 22; i++) {
      await prisma.question.create({
        data: {
          title: `question-${i}`,
          content: `content-${i}`,
          slug: `question-${i}`,
          authorId: user.id,
        },
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
