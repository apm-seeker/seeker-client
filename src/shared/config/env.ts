import { z } from 'zod'

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url(),
  VITE_USE_MOCK: z.enum(['true', 'false']).optional(),
})

const parsed = envSchema.safeParse(import.meta.env)

if (!parsed.success) {
  throw new Error(`Invalid environment variables: ${parsed.error.message}`)
}

const useMock = parsed.data.VITE_USE_MOCK
  ? parsed.data.VITE_USE_MOCK === 'true'
  : import.meta.env.MODE === 'development'

export const env = {
  apiBaseUrl: parsed.data.VITE_API_BASE_URL,
  useMock,
} as const
