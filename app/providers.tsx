'use client'

import { getQueryClient } from '@/helper/getQueryClient'
import {
  QueryClientProvider,
  QueryClientProviderProps,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

type Props = Pick<QueryClientProviderProps, 'children'>

function Providers({ children }: Props) {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}

export default Providers
