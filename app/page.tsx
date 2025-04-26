import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { App, AppContainer } from '@/app/_components/App/App'
import { SearchParamsSchema } from './schema'
import { getQueryClient } from '@/helper/getQueryClient'
import { weatherOptions } from '@/queries/weather'
import { AppSpring } from './_components/App/AppSpring'

type Props = {
  searchParams: Promise<SearchParamsSchema>
}

export default async function Home({ searchParams }: Props) {
  const params = await searchParams
  const queryClient = getQueryClient()

  queryClient.prefetchQuery(weatherOptions(params))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <App>
        <AppSpring data-theme={params.theme}>
          <AppContainer {...params} />
        </AppSpring>
      </App>
    </HydrationBoundary>
  )
}
