import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'
import { AuthenticateStudentUseCase } from './authenticate-student'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { MakeStudent } from 'test/factories/make-student'

let inMemoryStudentRepository: InMemoryStudentRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateStudentUseCase

describe('Authenticate student', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository()

    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()

    sut = new AuthenticateStudentUseCase(
      inMemoryStudentRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('Should be able to register a student', async () => {
    const student = MakeStudent({
      email: 'jonhDoe@example.com',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryStudentRepository.create(student)

    const result = await sut.execute({
      email: 'jonhDoe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })
})
