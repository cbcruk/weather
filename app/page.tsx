import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import App from '@/app/_components/App'
import { getQueryClient } from './utils'
import { getData as getWeatherData } from '@/pages/api/weather'
import { SearchParamsSchema } from './schema'

type Props = {
  searchParams: SearchParamsSchema
}

export default async function Home({ searchParams }: Props) {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery({
    queryKey: ['weather'],
    queryFn: () => getWeatherData(searchParams),
  })
  const dehydratedState = dehydrate(queryClient)

  return (
    <HydrationBoundary state={dehydratedState}>
      <App />
    </HydrationBoundary>
  )
}
