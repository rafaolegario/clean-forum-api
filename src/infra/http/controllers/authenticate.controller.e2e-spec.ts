import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcrypt'
import request from 'supertest'
import { StudentFactory } from 'test/factories/make-student'

describe('Authenticate (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    studentFactory = moduleRef.get(StudentFactory)
    await app.init()
  })

  test('[POST] /sessions', async () => {
    await studentFactory.makePrismaStudent({
      name: 'JonhDoe',
      email: 'Jonhdoe@email.com',
      password: await hash('12345678', 8),
    })
    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'Jonhdoe@email.com',
      password: '12345678',
    })

    expect(response.statusCode).toBe(201)
    expect(response.body.access_token).toEqual(expect.any(String))
  })
})
