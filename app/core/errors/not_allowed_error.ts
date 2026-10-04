import type { UseCaseError } from '#core/errors/use_case_error'

export class NotAllowedError extends Error implements UseCaseError {
  constructor() {
    super('Not allowed.')
  }
}
