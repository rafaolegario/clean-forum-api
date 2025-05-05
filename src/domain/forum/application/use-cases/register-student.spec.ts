import { FakeHasher } from 'test/cryptography/fake-hasher'
import { RegisterStudentUseCase } from './register-student'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'

let inMemoryStudentRepository: InMemoryStudentRepository
let sut: RegisterStudentUseCase
let fakeHasher: FakeHasher

describe('Register student', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository()

    fakeHasher = new FakeHasher()

    sut = new RegisterStudentUseCase(inMemoryStudentRepository, fakeHasher)
  })

  it('Should be able to register a student', async () => {
    const result = await sut.execute({
      email: 'jonhDoe@example.com',
      name: 'JonhDoe',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      student: inMemoryStudentRepository.items[0],
    })
  })

  it('Should hash student password upon registration', async () => {
    const result = await sut.execute({
      email: 'jonhDoe@example.com',
      name: 'JonhDoe',
      password: '123456',
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryStudentRepository.items[0].password).toEqual(hashedPassword)
  })
})
