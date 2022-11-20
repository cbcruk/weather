import { GetServerSideProps } from 'next'
import { dehydrate, QueryClient } from 'react-query'
import App from '../components/App'
import { KEY } from '../hooks/useWeather'
import { getData } from './api/weather'

function Index() {
  return <App />
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery(KEY, () => getData(query))

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

export default Index
