import { z } from 'zod'

const searchParamsSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
})

export type SearchParamsSchema = z.infer<typeof searchParamsSchema>
