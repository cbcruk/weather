import { z } from 'zod'

const searchParamsSchema = z.object({
  latitude: z.string(),
  longitude: z.string(),
  theme: z.string(),
})

export type SearchParamsSchema = z.infer<typeof searchParamsSchema>
