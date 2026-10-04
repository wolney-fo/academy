import { test } from '@japa/runner'
import { type Either, left, right } from '#core/either'

function doSomething(shouldSucceed: boolean): Either<string, number> {
  if (shouldSucceed) {
    return right(10)
  }

  return left('error')
}

test.group('Either', () => {
  test('success result', ({ assert }) => {
    const result = doSomething(true)

    assert.isTrue(result.isRight())
    assert.isFalse(result.isLeft())
  })

  test('error result', ({ assert }) => {
    const result = doSomething(false)

    assert.isTrue(result.isLeft())
    assert.isFalse(result.isRight())
  })
})
