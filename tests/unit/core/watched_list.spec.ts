import { test } from '@japa/runner'
import { WatchedList } from '#core/entities/watched_list'

class NumberWatchedList extends WatchedList<number> {
  compareItems(a: number, b: number): boolean {
    return a === b
  }
}

test.group('WatchedList', () => {
  test('creates a watched list with initial items', ({ assert }) => {
    const list = new NumberWatchedList([1, 2, 3])

    assert.lengthOf(list.currentItems, 3)
  })

  test('adds new items to the list', ({ assert }) => {
    const list = new NumberWatchedList([1, 2, 3])

    list.add(4)

    assert.lengthOf(list.currentItems, 4)
    assert.deepEqual(list.getNewItems(), [4])
  })

  test('removes items from the list', ({ assert }) => {
    const list = new NumberWatchedList([1, 2, 3])

    list.remove(2)

    assert.lengthOf(list.currentItems, 2)
    assert.deepEqual(list.getRemovedItems(), [2])
  })

  test('adds an item even if it was removed before', ({ assert }) => {
    const list = new NumberWatchedList([1, 2, 3])

    list.remove(2)
    list.add(2)

    assert.lengthOf(list.currentItems, 3)
    assert.deepEqual(list.getRemovedItems(), [])
    assert.deepEqual(list.getNewItems(), [])
  })

  test('removes an item even if it was added before', ({ assert }) => {
    const list = new NumberWatchedList([1, 2, 3])

    list.add(4)
    list.remove(4)

    assert.lengthOf(list.currentItems, 3)
    assert.deepEqual(list.getRemovedItems(), [])
    assert.deepEqual(list.getNewItems(), [])
  })

  test('updates watched list items', ({ assert }) => {
    const list = new NumberWatchedList([1, 2, 3])

    list.update([1, 3, 5])

    assert.deepEqual(list.getRemovedItems(), [2])
    assert.deepEqual(list.getNewItems(), [5])
  })
})
