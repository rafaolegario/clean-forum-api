import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { SendNotificationUseCase } from './send-notification'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

describe('Create Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('Should be able to create an notification', async () => {
    const result = await sut.execute({
      recipientId: '1',
      title: 'send notification',
      content: 'New notification',
    })

    expect(result.isRight()).toBe(true)
  })
})
