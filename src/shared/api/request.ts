import type { AxiosRequestConfig } from 'axios'
import type { z } from 'zod'
import { apiClient } from './client'
import { ApiError } from './error'

export async function request<TSchema extends z.ZodTypeAny>(
  config: AxiosRequestConfig,
  schema: TSchema,
): Promise<z.infer<TSchema>> {
  const response = await apiClient.request(config)
  const parsed = schema.safeParse(response.data)

  if (!parsed.success) {
    throw new ApiError('Response validation failed', {
      code: 'RESPONSE_VALIDATION',
      cause: parsed.error,
    })
  }

  return parsed.data
}
