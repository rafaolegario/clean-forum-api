import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { MakeNotification } from 'test/factories/make-notification'
import { ReadNotificationUseCase } from './read-notification'
import { NotAllowedError } from '@/domain/forum/application/use-cases/errors/not-allowed-error'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: ReadNotificationUseCase

describe('Read Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('Should be able to read an notification', async () => {
    const notification = MakeNotification()

    inMemoryNotificationsRepository.create(notification)

    const result = await sut.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString(),
    })

    expect(result.isRight()).toBe(true)
  })

  it('Should not be able to read an notification from another user', async () => {
    const notification = MakeNotification()

    inMemoryNotificationsRepository.create(notification)

    const result = await sut.execute({
      recipientId: '2',
      notificationId: notification.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
