import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Hasher } from '../cryptography/hasher'
import { StudentsRepository } from '../repositories/studentes-repository'
import { Encrypter } from '../cryptography/encrypter'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

interface AuthenticateStudentUseCaseRequest {
  email: string
  password: string
}

type AuthenticateStudentUseCaseResponse = Either<
  WrongCredentialsError,
  {
    acessToken: string
  }
>

@Injectable()
export class AuthenticateStudentUseCase {
  constructor(
    private studentRepository: StudentsRepository,
    private Hasher: Hasher,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateStudentUseCaseRequest): Promise<AuthenticateStudentUseCaseResponse> {
    const student = await this.studentRepository.findByEmail(email)

    if (!student) {
      return left(new WrongCredentialsError())
    }

    const isCorrectPassword = await this.Hasher.compare(
      password,
      student?.password,
    )

    if (!isCorrectPassword) {
      return left(new WrongCredentialsError())
    }

    const acessToken = await this.encrypter.encrypt({
      sub: student.id.toString(),
    })

    return right({ acessToken })
  }
}
