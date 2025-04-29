import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Student } from '../../enterprise/entities/student'
import { Hasher } from '../cryptography/hasher'
import { StudentsRepository } from '../repositories/studentes-repository'
import { StudentAlreadyExistsError } from './errors/student-already-exitis-error'

interface RegisterStudentUseCaseRequest {
  name: string
  email: string
  password: string
}

type RegisterStudentUseCaseResponse = Either<
  StudentAlreadyExistsError,
  {
    student: Student
  }
>

@Injectable()
export class RegisterStudentUseCase {
  constructor(
    private studentRepository: StudentsRepository,
    private hashGenerator: Hasher,
  ) {}

  async execute({
    email,
    name,
    password,
  }: RegisterStudentUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {
    const studentWithSameEmail = await this.studentRepository.findByEmail(email)

    if (studentWithSameEmail) {
      return left(new StudentAlreadyExistsError(email))
    }

    const hashPassword = await this.hashGenerator.hash(password)

    const student = Student.create({
      email,
      name,
      password: hashPassword,
    })
    await this.studentRepository.create(student)

    return right({ student })
  }
}
