import { DomainEvent } from '../events/domain-event'
import { DomainEvents } from '../events/domain-events'
import { AggregateRoot } from './aggregate-root'
import { UniqueEntityID } from './unique-entity-id'

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date
  private aggregate: CustomAggregate // eslint-disable-line

  constructor(aggregate: CustomAggregate) {
    this.ocurredAt = new Date()
    this.aggregate = aggregate
  }

  public getAggregateId(): UniqueEntityID {
    return this.aggregate.id
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null)

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

    return aggregate
  }
}

describe('Domain events', () => {
  it('Should be able to dispatch and listen to events', () => {
    const callbackSpy = vi.fn()

    // Subscriber cadastrado (ouvindo o evento de "resposta criada")
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

    // Criando uma resposta porém SEM salvar no banco
    const aggregate = CustomAggregate.create()

    // Assegurando que o evento foi criado porém não foi desparado
    expect(aggregate.domainEvents).toHaveLength(1)

    // Salvando a resposta no banco de dados e assim disparado o evento
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    // Subscriber ouve o evento e faz o que precisa ser feito com o dado
    expect(callbackSpy).toHaveBeenCalled()
    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
