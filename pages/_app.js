import Head from 'next/head'
import '../styles/globals.css'

function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="현재, 어제, 최저, 최고 온도 정보" />
        <link rel="apple-touch-icon" href="/logo192.png" />
        <link rel="manifest" href="/manifest.json" />
        <title>날씨</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default App
