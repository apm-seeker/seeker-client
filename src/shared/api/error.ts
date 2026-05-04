import { AxiosError } from 'axios'

export interface ApiErrorOptions {
  status?: number
  code?: string
  cause?: unknown
}

export class ApiError extends Error {
  readonly status?: number
  readonly code?: string

  constructor(message: string, options: ApiErrorOptions = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = options.status
    this.code = options.code
    if (options.cause !== undefined) {
      ;(this as { cause?: unknown }).cause = options.cause
    }
  }
}

export function toApiError(err: unknown): ApiError {
  if (err instanceof ApiError) return err

  if (err instanceof AxiosError) {
    return new ApiError(err.message, {
      status: err.response?.status,
      code: err.code,
      cause: err,
    })
  }

  return new ApiError(err instanceof Error ? err.message : 'Unknown error', {
    cause: err,
  })
}
