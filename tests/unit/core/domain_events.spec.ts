import { test } from '@japa/runner'
import { AggregateRoot } from '#core/entities/aggregate_root'
import type { UniqueEntityId } from '#core/entities/unique_entity_id'
import type { DomainEvent } from '#core/events/domain_event'
import { DomainEvents } from '#core/events/domain_events'

class CustomAggregateCreated implements DomainEvent {
  public occurredAt: Date
  private aggregate: CustomAggregate

  constructor(aggregate: CustomAggregate) {
    this.occurredAt = new Date()
    this.aggregate = aggregate
  }

  public getAggregateId(): UniqueEntityId {
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

test.group('DomainEvents', (group) => {
  group.each.teardown(() => {
    DomainEvents.clearHandlers()
    DomainEvents.clearMarkedAggregates()
  })

  test('dispatches and listens to events', ({ assert }) => {
    const received: unknown[] = []

    DomainEvents.register((event) => received.push(event), CustomAggregateCreated.name)

    const aggregate = CustomAggregate.create()

    assert.lengthOf(aggregate.domainEvents, 1)

    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    assert.lengthOf(received, 1)
    assert.instanceOf(received[0], CustomAggregateCreated)
    assert.lengthOf(aggregate.domainEvents, 0)
  })
})
