import { test } from '@japa/runner'
import { Entity } from '#core/entities/entity'
import { UniqueEntityId } from '#core/entities/unique_entity_id'

class CustomEntity extends Entity<{ name: string }> {
  static create(name: string, id?: UniqueEntityId) {
    return new CustomEntity({ name }, id)
  }
}

test.group('Entity', () => {
  test('entities with the same id are equal', ({ assert }) => {
    const first = CustomEntity.create('first', new UniqueEntityId('same-id'))
    const second = CustomEntity.create('second', new UniqueEntityId('same-id'))

    assert.isTrue(first.equals(second))
  })

  test('entities with different ids are not equal', ({ assert }) => {
    const first = CustomEntity.create('same')
    const second = CustomEntity.create('same')

    assert.isFalse(first.equals(second))
  })
})
