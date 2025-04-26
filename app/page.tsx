import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { App, AppContainer } from '@/app/_components/App/App'
import { SearchParamsSchema } from './schema'
import { getQueryClient } from '@/helper/getQueryClient'
import { weatherOptions } from '@/queries/weather'
import { AppSpring } from './_components/App/AppSpring'

type Props = {
  searchParams: SearchParamsSchema
}

export default async function Home({ searchParams }: Props) {
  const queryClient = getQueryClient()

  queryClient.prefetchQuery(weatherOptions(searchParams))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <App>
        <AppSpring data-theme={searchParams.theme}>
          <AppContainer {...searchParams} />
        </AppSpring>
      </App>
    </HydrationBoundary>
  )
}
