import type { UseCaseError } from '#core/errors/use_case_error'

export class ResourceNotFoundError extends Error implements UseCaseError {
  constructor() {
    super('Resource not found.')
  }
}
