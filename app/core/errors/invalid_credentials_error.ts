import type { UseCaseError } from '#core/errors/use_case_error'

export class InvalidCredentialsError extends Error implements UseCaseError {
  constructor() {
    super('Invalid credentials.')
  }
}
