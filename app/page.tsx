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

  const options = weatherOptions(params)

  // prefetchQuery는 실패를 삼키고 resolve된다.
  // 서버에서 무엇이 실패했는지 알려면 완료 후 쿼리 상태를 직접 확인해야 한다.
  queryClient.prefetchQuery(options).then(() => {
    const { error } = queryClient.getQueryState(options.queryKey) ?? {}

    if (error) {
      console.error(`[page] weather 프리페치 실패\n${String(error)}`)
    }
  })

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
