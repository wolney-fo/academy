import type { UniqueEntityId } from '#core/entities/unique_entity_id'

export interface DomainEvent {
  occurredAt: Date
  getAggregateId(): UniqueEntityId
}
